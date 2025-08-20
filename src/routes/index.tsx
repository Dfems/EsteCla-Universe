// src/routes/Routes.tsx
import { createBrowserRouter } from 'react-router-dom'
import App from '@/App'
import { ProtectedRoute } from '@components/ProtectedRoute'

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <App />
      </ProtectedRoute>
    ),
    errorElement: (
      <div style={{ padding: 24 }}>
        <h1>Qualcosa è andato storto</h1>
        <p>Riprova a ricaricare la pagina.</p>
      </div>
    ),
    children: [
      {
        index: true,
        async lazy() {
          const { default: Home } = await import('@pages/Home')
          return { Component: Home }
        },
      },
      {
        path: '/profile/:username',
        async lazy() {
          const { default: Profile } = await import('@pages/Profile')
          return { Component: Profile }
        },
      },
      {
        path: '/countdown',
        async lazy() {
          const { default: Countdown } = await import('@pages/Countdown')
          return { Component: Countdown }
        },
      },
    ],
  },
  {
    path: '/login',
    async lazy() {
      const { default: Login } = await import('@pages/Login')
      return { Component: Login }
    },
    errorElement: (
      <div style={{ padding: 24 }}>
        <h1>Qualcosa è andato storto</h1>
        <p>Riprova a ricaricare la pagina.</p>
      </div>
    ),
  },
  {
    path: '/register',
    async lazy() {
      const { default: Register } = await import('@pages/Register')
      return { Component: Register }
    },
    errorElement: (
      <div style={{ padding: 24 }}>
        <h1>Qualcosa è andato storto</h1>
        <p>Riprova a ricaricare la pagina.</p>
      </div>
    ),
  },
])
