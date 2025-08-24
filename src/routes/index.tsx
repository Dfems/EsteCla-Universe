// src/routes/Routes.tsx
import { createBrowserRouter } from 'react-router-dom'
import App from '@/App'
import ErrorPage from '@pages/Error'
import { ProtectedRoute } from '@components/ProtectedRoute'

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <App />
      </ProtectedRoute>
    ),
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        async lazy() {
          const { default: Home } = await import('@pages/Home')
          return { Component: Home }
        },
      },
      {
        path: '/welcome',
        async lazy() {
          const { default: Welcome } = await import('@pages/Welcome')
          return { Component: Welcome }
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
    errorElement: <ErrorPage />,
  },
  {
    path: '/register',
    async lazy() {
      const { default: Register } = await import('@pages/Register')
      return { Component: Register }
    },
    errorElement: <ErrorPage />,
  },
])
