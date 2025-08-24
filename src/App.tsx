import Navbar from '@components/Navbar'
import { Outlet } from 'react-router-dom'
import { Suspense } from 'react'
import LoadingSpinner from '@components/ui/LoadingSpinner'
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
