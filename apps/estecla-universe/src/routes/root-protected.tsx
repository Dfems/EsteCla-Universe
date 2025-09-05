import { useAuth } from '@estecla/firebase-react'
import { LoadingSpinner } from '@estecla/ui/feedback'
import { ProtectedRoute } from '@estecla/ui/navigation'

export default function RootProtected({ children }: { children: React.ReactElement }) {
  const { user, loading } = useAuth()
  return (
    <ProtectedRoute isAllowed={!!user} loading={loading} loadingFallback={<LoadingSpinner />}>
      {children}
    </ProtectedRoute>
  )
}
