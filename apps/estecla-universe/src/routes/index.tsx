// src/routes/Routes.tsx
import App from '@/App'
import ErrorPage from '@pages/Error'
import { createBrowserRouter } from 'react-router-dom'
import RootProtected from './root-protected'

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <RootProtected>
        <App />
      </RootProtected>
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
      {
        path: '/notifications',
        async lazy() {
          const { default: Notifications } = await import('@pages/Notifications')
          return { Component: Notifications }
        },
      },
      {
        path: '/settings',
        async lazy() {
          const { default: Settings } = await import('@pages/Settings')
          return { Component: Settings }
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
