import Navbar from '@components/Navbar'
import { Outlet } from 'react-router-dom'
import { Suspense } from 'react'
import { LoadingSpinner } from '@estecla/ui/feedback'
import WelcomeGate from '@components/WelcomeGate'

export default function App() {
  return (
    <>
      <Navbar />
      <main className="content">
        <WelcomeGate>
          <Suspense fallback={<LoadingSpinner />}>
            <Outlet />
          </Suspense>
        </WelcomeGate>
      </main>
    </>
  )
}
