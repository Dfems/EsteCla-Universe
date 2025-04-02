import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { JSX } from 'react'
import LoadingSpinner from '../components/LoadingSpinner'

// Componente per proteggere le rotte
export const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return <LoadingSpinner />
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return children
}
