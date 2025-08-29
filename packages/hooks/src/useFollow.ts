import { followUser, getServices, observeIsFollowing, unfollowUser } from '@estecla/firebase'
import { useCallback, useEffect, useState } from 'react'

export function useFollow(targetUid: string | undefined) {
  const [isFollowing, setIsFollowing] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!targetUid) return
    setLoading(true)
    const { auth, db } = getServices()
    const unsub = observeIsFollowing({ auth, db }, targetUid, (val) => {
      setIsFollowing(val)
      setLoading(false)
    })
    return () => unsub()
  }, [targetUid])

  const follow = useCallback(async () => {
    if (!targetUid) return
    const { auth, db } = getServices()
    await followUser({ auth, db }, targetUid)
  }, [targetUid])

  const unfollow = useCallback(async () => {
    if (!targetUid) return
    const { auth, db } = getServices()
    await unfollowUser({ auth, db }, targetUid)
  }, [targetUid])

  return { isFollowing, loading, follow, unfollow }
}

export default useFollow
