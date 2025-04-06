import { Outlet } from 'react-router-dom'
import Navbar from './components/Navbar'
import { useAuth } from './context/AuthContext'
import BirthdayCountdown from './components/BirthdayCountdown'

export default function App() {
  const { user } = useAuth()

  if (!user) return null

  console.log('Firebase Config:', import.meta.env)

  return (
    <>
      <Navbar />
      <main style={{ padding: '1rem' }}>
        <Outlet />
        <BirthdayCountdown/>
      </main>
    </>
  )
}
