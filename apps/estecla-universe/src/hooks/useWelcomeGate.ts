import { useAuth } from '@estecla/firebase-react'
import { useCallback, useMemo } from 'react'

// Inactivity window in ms, configurable via env VITE_WELCOME_INACTIVITY_MS. Default: 1 day.
const envMs = Number(import.meta.env.VITE_WELCOME_INACTIVITY_MS)
const INACTIVITY_WINDOW_MS = Number.isFinite(envMs) && envMs > 0 ? envMs : 1 * 24 * 60 * 60 * 1000

const storageKey = (uid?: string) => (uid ? `welcome.lastSeenAt:${uid}` : 'welcome.lastSeenAt')
const snoozeKey = (uid?: string) => (uid ? `welcome.snoozeUntil:${uid}` : 'welcome.snoozeUntil')

export function useWelcomeGate() {
  const { user } = useAuth()

  const key = useMemo(() => storageKey(user?.uid), [user?.uid])
  const keySnooze = useMemo(() => snoozeKey(user?.uid), [user?.uid])

  const getLastSeen = useCallback((): number | null => {
    try {
      const raw = localStorage.getItem(key)
      if (!raw) return null
      const n = Number(raw)
      return Number.isFinite(n) ? n : null
    } catch {
      return null
    }
  }, [key])

  const getSnoozeUntil = useCallback((): number | null => {
    try {
      const raw = localStorage.getItem(keySnooze)
      if (!raw) return null
      const n = Number(raw)
      return Number.isFinite(n) ? n : null
    } catch {
      return null
    }
  }, [keySnooze])

  const setSnoozeUntilEndOfDay = useCallback(() => {
    try {
      const now = new Date()
      const end = new Date(now)
      end.setHours(23, 59, 59, 999)
      localStorage.setItem(keySnooze, String(end.getTime()))
    } catch {
      // ignore
    }
  }, [keySnooze])

  const setLastSeenNow = useCallback(() => {
    try {
      localStorage.setItem(key, String(Date.now()))
    } catch {
      // ignore
    }
  }, [key])

  const shouldShowWelcome = useCallback(() => {
    // Snooze has priority: if active, skip welcome
    const snoozedUntil = getSnoozeUntil()
    if (snoozedUntil && Date.now() < snoozedUntil) return false

    const last = getLastSeen()
    if (!last) return true
    const inactiveFor = Date.now() - last
    return inactiveFor > INACTIVITY_WINDOW_MS
  }, [getLastSeen, getSnoozeUntil])

  return {
    shouldShowWelcome,
    setLastSeenNow,
    inactivityWindowMs: INACTIVITY_WINDOW_MS,
    setSnoozeUntilEndOfDay,
  }
}

export default useWelcomeGate
