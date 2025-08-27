import React, { JSX } from 'react'
import { Navigate } from 'react-router-dom'

export interface ProtectedRouteProps {
  children: JSX.Element
  isAllowed: boolean
  loading?: boolean
  fallbackPath?: string
  loadingFallback?: JSX.Element | null
}

/**
 * Generic ProtectedRoute: stateless, no auth coupling.
 * Decide outside: isAllowed and loading state; provide fallbacks via props.
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  isAllowed,
  loading = false,
  fallbackPath = '/login',
  loadingFallback = null,
}) => {
  if (loading) return loadingFallback
  if (!isAllowed) return <Navigate to={fallbackPath} replace />
  return children
}

export default ProtectedRoute
