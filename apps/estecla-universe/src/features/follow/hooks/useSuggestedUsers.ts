import { useEffect, useState } from 'react'
import { getSuggestedUsers } from '@features/follow/api/follow'
import type { UserInfo } from '@models/interfaces'

export function useSuggestedUsers(count = 6) {
  const [users, setUsers] = useState<UserInfo[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let active = true
    const load = async () => {
      setLoading(true)
      try {
        const res = await getSuggestedUsers(count)
        if (active) setUsers(res)
      } finally {
        if (active) setLoading(false)
      }
    }
    load()
    return () => {
      active = false
    }
  }, [count])

  return { users, loading }
}
