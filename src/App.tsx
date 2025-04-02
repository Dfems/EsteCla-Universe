import { Outlet } from 'react-router-dom'
import Navbar from './components/Navbar'
import { useAuth } from './context/AuthContext'

export default function App() {
  const { user } = useAuth()

  if (!user) return null

  return (
    <>
      <Navbar />
      <main style={{ padding: '1rem' }}>
        <Outlet />
      </main>
    </>
  )
}
