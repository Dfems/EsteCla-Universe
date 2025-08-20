import Navbar from '@components/Navbar'
import { Outlet } from 'react-router-dom'
import { Suspense } from 'react'
import LoadingSpinner from '@components/ui/LoadingSpinner'

export default function App() {
  return (
    <>
      <Navbar />
      <main className="content">
        <Suspense fallback={<LoadingSpinner />}>
          <Outlet />
        </Suspense>
      </main>
    </>
  )
}
