import { useEffect, useState } from 'react'
import { getSuggestedUsers, getServices } from '@estecla/firebase'
import type { UserInfo } from '@estecla/types'

export function useSuggestedUsers(count = 6) {
  const [users, setUsers] = useState<UserInfo[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let active = true
    const load = async () => {
      setLoading(true)
      try {
        const services = getServices()
        const res = await getSuggestedUsers(services, count)
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

export default useSuggestedUsers
