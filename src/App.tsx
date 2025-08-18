import Navbar from './components/Navbar'
import { Outlet } from 'react-router-dom'

export default function App() {
  return (
    <>
      <Navbar />
      <main style={{ marginTop: '60px' }}>
        <Outlet />
      </main>
    </>
  )
}
