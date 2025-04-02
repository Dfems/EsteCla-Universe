import { createBrowserRouter } from 'react-router-dom'
import Login from '../pages/Login'
import Home from '../pages/Home'
import Profile from '../pages/Profile'
import App from '../App'
import { ProtectedRoute } from '../components/ProtectedRoute'

// Modifica il router per includere la protezione
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
    ],
  },
  {
    path: '/login',
    element: <Login />,
  },
])
