import { getServices } from '@estecla/firebase'
import { collection, getCountFromServer } from 'firebase/firestore'
import { useEffect, useRef, useState } from 'react'

export function useFollowCounts(uid?: string) {
  const [followers, setFollowers] = useState<number | undefined>(undefined)
  const [following, setFollowing] = useState<number | undefined>(undefined)
  const lastUidRef = useRef<string | undefined>(undefined)

  useEffect(() => {
    let cancelled = false
    async function run() {
      if (!uid) return
      if (lastUidRef.current === uid) return
      lastUidRef.current = uid
      const { db } = getServices()
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
        if (!cancelled) {
          // Fall back to zero to avoid UI waiting on undefined forever
          setFollowers(0)
          setFollowing(0)
        }
      }
    }
    run()
    return () => {
      cancelled = true
    }
  }, [uid])

  return { followers, following }
}

export default useFollowCounts
