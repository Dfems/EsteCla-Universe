import { auth, db } from '@services/firebase';
import { collection, doc, getDoc, getDocs, limit, onSnapshot, query, where, orderBy, startAfter, writeBatch, } from 'firebase/firestore';
function requireAuth() {
    const u = auth.currentUser;
    if (!u)
        throw new Error('Utente non autenticato');
    return u;
}
export function followDocRefs(targetUid) {
    const u = requireAuth();
    const followingRef = doc(db, 'users', u.uid, 'following', targetUid);
    const followersRef = doc(db, 'users', targetUid, 'followers', u.uid);
    return { followingRef, followersRef, selfUid: u.uid };
}
export async function followUser(targetUid) {
    const { followingRef, selfUid } = followDocRefs(targetUid);
    if (selfUid === targetUid)
        return;
    const batch = writeBatch(db);
    const now = Date.now();
    batch.set(followingRef, { uid: targetUid, createdAt: now });
    // Mirror e contatori gestiti da Cloud Functions
    await batch.commit();
}
export async function unfollowUser(targetUid) {
    const { followingRef, selfUid } = followDocRefs(targetUid);
    if (selfUid === targetUid)
        return;
    const batch = writeBatch(db);
    batch.delete(followingRef);
    await batch.commit();
}
export function observeIsFollowing(targetUid, cb) {
    const u = requireAuth();
    if (u.uid === targetUid)
        return () => { };
    const ref = doc(db, 'users', u.uid, 'following', targetUid);
    return onSnapshot(ref, (snap) => cb(snap.exists()), (err) => {
        const code = err.code;
        if (code === 'permission-denied') {
            cb(false);
            return;
        }
        console.error('Errore observeIsFollowing:', err);
        cb(false);
    });
}
export async function getFollowersOf(uid) {
    const q = query(collection(db, 'users', uid, 'followers'));
    const snap = await getDocs(q);
    return snap.docs.map((d) => d.id);
}
export async function getFollowingOf(uid) {
    const q = query(collection(db, 'users', uid, 'following'));
    const snap = await getDocs(q);
    return snap.docs.map((d) => d.id);
}
export async function listFollowersPage(uid, pageSize = 20, cursor) {
    const base = query(collection(db, 'users', uid, 'followers'), orderBy('createdAt', 'desc'), limit(pageSize));
    const q2 = cursor ? query(base, startAfter(cursor)) : base;
    const snap = await getDocs(q2);
    return { docs: snap.docs, nextCursor: snap.docs[snap.docs.length - 1] };
}
export async function listFollowingPage(uid, pageSize = 20, cursor) {
    const base = query(collection(db, 'users', uid, 'following'), orderBy('createdAt', 'desc'), limit(pageSize));
    const q2 = cursor ? query(base, startAfter(cursor)) : base;
    const snap = await getDocs(q2);
    return { docs: snap.docs, nextCursor: snap.docs[snap.docs.length - 1] };
}
export async function getUsersByUids(uids, batchSize = 10) {
    const results = [];
    for (let i = 0; i < uids.length; i += batchSize) {
        const batch = uids.slice(i, i + batchSize);
        if (!batch.length)
            continue;
        // where('uid','in', batch) richiede un indice ma batch ≤ 10
        const q = query(collection(db, 'users'), where('uid', 'in', batch));
        const snap = await getDocs(q);
        results.push(...snap.docs.map((d) => d.data()));
    }
    return results;
}
async function buildFoFCandidates(meUid, myFollowing, followingSet) {
    const candidatesMap = new Map();
    const sampleFriends = myFollowing.slice(0, 12);
    for (const fid of sampleFriends) {
        try {
            const page = await listFollowingPage(fid, 20);
            for (const docSnap of page.docs) {
                const cid = docSnap.id;
                if (cid === meUid || followingSet.has(cid))
                    continue;
                const cand = await getUserByUid(cid);
                if (!cand)
                    continue;
                const cur = candidatesMap.get(cid);
                candidatesMap.set(cid, { user: cand, score: (cur?.score || 0) + 1 });
            }
        }
        catch {
            // ignora errori singoli
        }
    }
    return candidatesMap;
}
function dedupeAndTrim(users, limitCount) {
    const seen = new Set();
    const out = [];
    for (const it of users) {
        if (seen.has(it.uid))
            continue;
        seen.add(it.uid);
        out.push(it);
        if (out.length >= limitCount)
            break;
    }
    return out;
}
export async function getSuggestedUsers(limitCount = 8) {
    const u = requireAuth();
    const myFollowing = await getFollowingOf(u.uid);
    const followingSet = new Set(myFollowing);
    const candidatesMap = await buildFoFCandidates(u.uid, myFollowing, followingSet);
    let ranked = Array.from(candidatesMap.values())
        .sort((a, b) => b.score - a.score)
        .map((x) => x.user);
    if (ranked.length < limitCount) {
        const snap = await getDocs(query(collection(db, 'users'), limit(60)));
        const pool = snap.docs.map((d) => d.data());
        const extra = pool.filter((usr) => usr.uid !== u.uid && !followingSet.has(usr.uid));
        ranked = [...ranked, ...extra];
    }
    return dedupeAndTrim(ranked, limitCount);
}
export async function getUserByUid(uid) {
    const d = await getDoc(doc(db, 'users', uid));
    return d.exists() ? d.data() : null;
}
