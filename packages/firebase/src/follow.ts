import type { Firestore, QueryDocumentSnapshot } from 'firebase/firestore'
import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  startAfter,
  where,
  writeBatch,
  type Unsubscribe,
} from 'firebase/firestore'
import type { Auth } from 'firebase/auth'
import type { UserInfo } from '@estecla/types'

function requireAuth(auth: Auth): NonNullable<Auth['currentUser']> {
  const u = auth.currentUser
  if (!u) throw new Error('Utente non autenticato')
  return u
}

export function followDocRefs(services: { auth: Auth; db: Firestore }, targetUid: string) {
  const u = requireAuth(services.auth)
  const followingRef = doc(services.db, 'users', u.uid, 'following', targetUid)
  const followersRef = doc(services.db, 'users', targetUid, 'followers', u.uid)
  return { followingRef, followersRef, selfUid: u.uid }
}

export async function followUser(services: { auth: Auth; db: Firestore }, targetUid: string) {
  const { followingRef, selfUid } = followDocRefs(services, targetUid)
  if (selfUid === targetUid) return
  const batch = writeBatch(services.db)
  const now = Date.now()
  batch.set(followingRef, { uid: targetUid, createdAt: now })
  await batch.commit()
}

export async function unfollowUser(services: { auth: Auth; db: Firestore }, targetUid: string) {
  const { followingRef, selfUid } = followDocRefs(services, targetUid)
  if (selfUid === targetUid) return
  const batch = writeBatch(services.db)
  batch.delete(followingRef)
  await batch.commit()
}

export function observeIsFollowing(
  services: { auth: Auth; db: Firestore },
  targetUid: string,
  cb: (isFollowing: boolean) => void
): Unsubscribe {
  const u = requireAuth(services.auth)
  if (u.uid === targetUid) return () => {}
  const ref = doc(services.db, 'users', u.uid, 'following', targetUid)
  return onSnapshot(
    ref,
    (snap) => cb(snap.exists()),
    (err) => {
      const code = (err as { code?: string }).code
      if (code === 'permission-denied') {
        cb(false)
        return
      }
      console.error('Errore observeIsFollowing:', err)
      cb(false)
    }
  )
}

export async function getFollowersOf(db: Firestore, uid: string): Promise<string[]> {
  const q = query(collection(db, 'users', uid, 'followers'))
  const snap = await getDocs(q)
  return snap.docs.map((d) => d.id)
}

export async function getFollowingOf(db: Firestore, uid: string): Promise<string[]> {
  const q = query(collection(db, 'users', uid, 'following'))
  const snap = await getDocs(q)
  return snap.docs.map((d) => d.id)
}

export async function listFollowersPage(
  db: Firestore,
  uid: string,
  pageSize = 20,
  cursor?: QueryDocumentSnapshot
) {
  const base = query(
    collection(db, 'users', uid, 'followers'),
    orderBy('createdAt', 'desc'),
    limit(pageSize)
  )
  const q2 = cursor ? query(base, startAfter(cursor)) : base
  const snap = await getDocs(q2)
  return { docs: snap.docs, nextCursor: snap.docs[snap.docs.length - 1] }
}

export async function listFollowingPage(
  db: Firestore,
  uid: string,
  pageSize = 20,
  cursor?: QueryDocumentSnapshot
) {
  const base = query(
    collection(db, 'users', uid, 'following'),
    orderBy('createdAt', 'desc'),
    limit(pageSize)
  )
  const q2 = cursor ? query(base, startAfter(cursor)) : base
  const snap = await getDocs(q2)
  return { docs: snap.docs, nextCursor: snap.docs[snap.docs.length - 1] }
}

export async function getUsersByUids(db: Firestore, uids: string[], batchSize = 10) {
  const results: UserInfo[] = []
  for (let i = 0; i < uids.length; i += batchSize) {
    const batch = uids.slice(i, i + batchSize)
    if (!batch.length) continue
    const q = query(collection(db, 'users'), where('uid', 'in', batch))
    const snap = await getDocs(q)
    results.push(...snap.docs.map((d) => d.data() as UserInfo))
  }
  return results
}

function dedupeAndTrim(users: UserInfo[], limitCount: number): UserInfo[] {
  const seen = new Set<string>()
  const out: UserInfo[] = []
  for (const it of users) {
    if (seen.has(it.uid)) continue
    seen.add(it.uid)
    out.push(it)
    if (out.length >= limitCount) break
  }
  return out
}

export async function getSuggestedUsers(
  services: { auth: Auth; db: Firestore },
  limitCount = 8
): Promise<UserInfo[]> {
  const u = requireAuth(services.auth)
  const myFollowing = await getFollowingOf(services.db, u.uid)
  const followingSet = new Set(myFollowing)

  // friends-of-friends sampling
  const candidatesMap = new Map<string, { user: UserInfo; score: number }>()
  const sampleFriends = myFollowing.slice(0, 12)
  for (const fid of sampleFriends) {
    try {
      const page = await listFollowingPage(services.db, fid, 20)
      for (const docSnap of page.docs) {
        const cid = docSnap.id
        if (cid === u.uid || followingSet.has(cid)) continue
        const cand = await getUsersByUids(services.db, [cid], 1)
        const user = cand[0]
        if (!user) continue
        const cur = candidatesMap.get(cid)
        candidatesMap.set(cid, { user, score: (cur?.score || 0) + 1 })
      }
    } catch {
      // ignora errori singoli
    }
  }

  let ranked = Array.from(candidatesMap.values())
    .sort((a, b) => b.score - a.score)
    .map((x) => x.user)

  if (ranked.length < limitCount) {
    const snap = await getDocs(query(collection(services.db, 'users'), limit(60)))
    const pool = snap.docs.map((d) => d.data() as UserInfo)
    const extra = pool.filter((usr) => usr.uid !== u.uid && !followingSet.has(usr.uid))
    ranked = [...ranked, ...extra]
  }
  return dedupeAndTrim(ranked, limitCount)
}
