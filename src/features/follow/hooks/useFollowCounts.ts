import { useEffect, useState } from 'react'
import { collection, getCountFromServer } from 'firebase/firestore'
import { db } from '@services/firebase'

export function useFollowCounts(uid?: string) {
  const [followers, setFollowers] = useState<number | undefined>(undefined)
  const [following, setFollowing] = useState<number | undefined>(undefined)

  useEffect(() => {
    let cancelled = false
    async function run() {
      if (!uid) return
      try {
        const [fc, fg] = await Promise.all([
          getCountFromServer(collection(db, 'users', uid, 'followers')),
          getCountFromServer(collection(db, 'users', uid, 'following')),
        ])
        if (!cancelled) {
          setFollowers(fc.data().count)
          setFollowing(fg.data().count)
        }
      } catch {
        /* ignore */
      }
    }
    run()
    return () => {
      cancelled = true
    }
  }, [uid])

  return { followers, following }
}
