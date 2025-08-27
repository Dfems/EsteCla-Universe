import Navbar from '@components/Navbar'
import { Outlet, useLocation } from 'react-router-dom'
import { Suspense } from 'react'
import { LoadingSpinner } from '@estecla/ui/feedback'
import { Gate } from '@estecla/ui/navigation'
import { useWelcomeGate } from '@hooks/useWelcomeGate'

export default function App() {
  const { pathname } = useLocation()
  const { shouldShowWelcome, setLastSeenNow } = useWelcomeGate()
  return (
    <>
      <Navbar />
      <main className="content">
        <Gate
          predicate={(p) => p === '/' && shouldShowWelcome()}
          fallbackPath="/welcome"
          onAllowedVisit={() => {
            if (pathname === '/') setLastSeenNow()
          }}
        >
          <Suspense fallback={<LoadingSpinner />}>
            <Outlet />
          </Suspense>
        </Gate>
      </main>
    </>
  )
}
