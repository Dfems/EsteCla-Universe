import { auth, db } from '@services/firebase'
import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
  type QueryDocumentSnapshot,
} from 'firebase/firestore'
import type { UserInfo } from '@estecla/types'
import {
  followUser as followUserShared,
  unfollowUser as unfollowUserShared,
  observeIsFollowing as observeIsFollowingShared,
  getFollowersOf as getFollowersOfShared,
  getFollowingOf as getFollowingOfShared,
  listFollowersPage as listFollowersPageShared,
  listFollowingPage as listFollowingPageShared,
  getUsersByUids as getUsersByUidsShared,
} from '@estecla/firebase'

function requireAuth(): NonNullable<typeof auth.currentUser> {
  const u = auth.currentUser
  if (!u) throw new Error('Utente non autenticato')
  return u
}

export async function followUser(targetUid: string): Promise<void> {
  await followUserShared({ auth, db }, targetUid)
}

export async function unfollowUser(targetUid: string): Promise<void> {
  await unfollowUserShared({ auth, db }, targetUid)
}

export function observeIsFollowing(
  targetUid: string,
  cb: (isFollowing: boolean) => void
): () => void {
  return observeIsFollowingShared({ auth, db }, targetUid, cb)
}

export async function getFollowersOf(uid: string): Promise<string[]> {
  return getFollowersOfShared(db, uid)
}

export async function getFollowingOf(uid: string): Promise<string[]> {
  return getFollowingOfShared(db, uid)
}

export async function listFollowersPage(
  uid: string,
  pageSize = 20,
  cursor?: QueryDocumentSnapshot
) {
  return listFollowersPageShared(db, uid, pageSize, cursor)
}

export async function listFollowingPage(
  uid: string,
  pageSize = 20,
  cursor?: QueryDocumentSnapshot
) {
  return listFollowingPageShared(db, uid, pageSize, cursor)
}

export async function getUsersByUids(uids: string[], batchSize = 10): Promise<UserInfo[]> {
  return getUsersByUidsShared(db, uids, batchSize)
}

async function buildFoFCandidates(
  meUid: string,
  myFollowing: string[],
  followingSet: Set<string>
): Promise<Map<string, { user: UserInfo; score: number }>> {
  const candidatesMap = new Map<string, { user: UserInfo; score: number }>()
  const sampleFriends = myFollowing.slice(0, 12)
  for (const fid of sampleFriends) {
    try {
      const page = await listFollowingPage(fid, 20)
      for (const docSnap of page.docs) {
        const cid = docSnap.id
        if (cid === meUid || followingSet.has(cid)) continue
        const cand = await getUserByUid(cid)
        if (!cand) continue
        const cur = candidatesMap.get(cid)
        candidatesMap.set(cid, { user: cand, score: (cur?.score || 0) + 1 })
      }
    } catch {
      // ignora errori singoli
    }
  }
  return candidatesMap
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

export async function getSuggestedUsers(limitCount = 8): Promise<UserInfo[]> {
  const u = requireAuth()
  const myFollowing = await getFollowingOf(u.uid)
  const followingSet = new Set(myFollowing)

  const candidatesMap = await buildFoFCandidates(u.uid, myFollowing, followingSet)
  let ranked = Array.from(candidatesMap.values())
    .sort((a, b) => b.score - a.score)
    .map((x) => x.user)

  if (ranked.length < limitCount) {
    const snap = await getDocs(query(collection(db, 'users'), limit(60)))
    const pool = snap.docs.map((d) => d.data() as UserInfo)
    const extra = pool.filter((usr) => usr.uid !== u.uid && !followingSet.has(usr.uid))
    ranked = [...ranked, ...extra]
  }
  return dedupeAndTrim(ranked, limitCount)
}

export async function getUserByUid(uid: string): Promise<UserInfo | null> {
  const d = await getDoc(doc(db, 'users', uid))
  return d.exists() ? (d.data() as UserInfo) : null
}
