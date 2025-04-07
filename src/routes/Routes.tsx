// src/routes/Routes.tsx
import { createBrowserRouter } from 'react-router-dom'
import App from '../App'
import Home from '../pages/Home'
import Profile from '../pages/Profile'
import Login from '../pages/Login'
import Register from '../pages/Register'
import { ProtectedRoute } from '../components/ProtectedRoute'
import Countdown from '../pages/Countdown'

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <App />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Home /> },
      { path: 'profile/:username', element: <Profile /> },
      { path: 'countdown', element: <Countdown /> },
    ],
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
])
