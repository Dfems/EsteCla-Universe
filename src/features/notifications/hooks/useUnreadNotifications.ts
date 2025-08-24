import { useEffect, useState } from 'react'
import { observeNotifications } from '@features/notifications/api/notifications'

export function useUnreadNotifications() {
  const [unread, setUnread] = useState(0)
  useEffect(() => {
    const unsub = observeNotifications(setUnread)
    return () => unsub?.()
  }, [])
  return unread
}

export default useUnreadNotifications
