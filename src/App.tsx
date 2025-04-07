import Navbar from './components/Navbar'
import { useAuth } from './context/AuthContext'
import { Outlet } from 'react-router-dom'

export default function App() {
  const { user } = useAuth()

  if (!user) return null

  console.log('Firebase Config:', import.meta.env)

  return (
    <>
      <Navbar />
      <main style={{ padding: '1rem' }}>
        <Outlet />
      </main>
    </>
  )
}
