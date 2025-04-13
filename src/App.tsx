import LoadingSpinner from './components/common/LoadingSpinner'
import Navbar from './components/Navbar'
import { useAuth } from './context/AuthContext'
import { Navigate, Outlet } from 'react-router-dom'

export default function App() {
  const { user, loading } = useAuth()

  if (loading) return <LoadingSpinner />

  if (!user) {
    return <Navigate to="/login" />
  }

  return (
    <>
      <Navbar />
      <main style={{ marginTop: '60px' }}>
        <Outlet />
      </main>
    </>
  )
}
