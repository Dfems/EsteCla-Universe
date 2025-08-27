import { PropsWithChildren, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

export interface GateProps {
  /** Run on pathname changes. If returns true, we redirect to fallbackPath. */
  predicate: (pathname: string) => boolean
  fallbackPath: string
  onAllowedVisit?: () => void
}

/**
 * Generic Gate: evaluates a predicate on route changes; if true, navigates to fallbackPath.
 * No app-specific state. Caller owns any persistence (e.g., localStorage snooze/lastSeen).
 */
function Gate({ children, predicate, fallbackPath, onAllowedVisit }: PropsWithChildren<GateProps>) {
  const { pathname } = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    if (predicate(pathname)) {
      navigate(fallbackPath, { replace: true })
      return
    }
    onAllowedVisit?.()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  return <>{children}</>
}

export default Gate
