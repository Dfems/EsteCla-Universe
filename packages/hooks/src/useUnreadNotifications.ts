import { useEffect, useState } from 'react'
import { observeNotifications, getServices } from '@estecla/firebase'

export function useUnreadNotifications() {
  const [unread, setUnread] = useState(0)
  useEffect(() => {
    const { auth, db } = getServices()
    const unsub = observeNotifications({ auth, db }, setUnread)
    return () => unsub?.()
  }, [])
  return unread
}

export default useUnreadNotifications
