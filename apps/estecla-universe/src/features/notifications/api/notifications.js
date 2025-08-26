import { db, auth } from '@services/firebase';
import { addDoc, collection, doc, getDocs, limit, onSnapshot, orderBy, query, serverTimestamp, startAfter, updateDoc, where, } from 'firebase/firestore';
export async function createFollowNotification(targetUid, fromUid) {
    // Da usare lato Functions; lasciamo l'API client per eventuali usi futuri controllati
    await addDoc(collection(db, 'users', targetUid, 'notifications'), {
        type: 'follow',
        fromUid,
        createdAt: serverTimestamp(),
        read: false,
    });
}
export function observeNotifications(cb) {
    const u = auth.currentUser;
    if (!u)
        return () => { };
    const q = query(collection(db, 'users', u.uid, 'notifications'), where('read', '==', false), orderBy('createdAt', 'desc'), limit(100));
    return onSnapshot(q, (snap) => cb(snap.size), (err) => {
        const code = err.code;
        if (code === 'permission-denied') {
            cb(0);
            return;
        }
        console.error('Errore notifications listener:', err);
        cb(0);
    });
}
const notificationConverter = {
    toFirestore(data) {
        // Only used for writes in Functions; here we mainly read. Keep passthrough.
        return data;
    },
    fromFirestore(snapshot) {
        return snapshot.data();
    },
};
export async function listNotificationsPage(pageSize = 20, cursor) {
    const u = auth.currentUser;
    if (!u)
        return { items: [], cursor: null };
    const base = query(collection(db, 'users', u.uid, 'notifications').withConverter(notificationConverter), orderBy('createdAt', 'desc'), limit(pageSize));
    const q = cursor ? query(base, startAfter(cursor)) : base;
    const snap = await getDocs(q);
    const docs = snap.docs;
    const items = docs.map((d) => {
        const data = d.data();
        return {
            id: d.id,
            type: data.type,
            fromUid: data.fromUid,
            createdAt: data.createdAt ? data.createdAt.toDate() : null,
            read: data.read ?? false,
        };
    });
    // Pick the last available createdAt as cursor; if missing, return null
    const last = docs[docs.length - 1];
    const lastData = last ? last.data() : undefined;
    const nextCursor = lastData?.createdAt ?? null;
    return { items, cursor: nextCursor };
}
export async function markNotificationRead(id, value = true) {
    const u = auth.currentUser;
    if (!u)
        return;
    await updateDoc(doc(db, 'users', u.uid, 'notifications', id), { read: value });
}
export async function markAllNotificationsRead() {
    const u = auth.currentUser;
    if (!u)
        return;
    // Nota: per semplicità aggiorniamo le ultime N; per bulk reale usare una Cloud Function
    const first = await getDocs(query(collection(db, 'users', u.uid, 'notifications'), where('read', '==', false), orderBy('createdAt', 'desc'), limit(100)));
    await Promise.all(first.docs.map((d) => updateDoc(d.ref, { read: true })));
}
