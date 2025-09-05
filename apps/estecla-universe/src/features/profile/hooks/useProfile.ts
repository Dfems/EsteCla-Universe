// src/hooks/useProfile.ts
import { useAuth } from '@estecla/firebase-react'
import { useProfile as useSharedProfile } from '@estecla/hooks'
import { useCallback, useEffect, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

export const useProfile = () => {
  const { username } = useParams<{ username: string }>()
  const { user, loading: authLoading } = useAuth()
  const navigate = useNavigate()

  // Risolvi alias e casi vuoti: '/profile/me' oppure nessun parametro
  const resolvedUsername = useMemo(() => {
    if (username && username !== 'me') return username
    return user?.username
  }, [username, user?.username])

  const onMissing = useCallback(() => navigate('/'), [navigate])
  const shared = useSharedProfile({ username: resolvedUsername, onMissing })
  // Se dopo auth non abbiamo ancora uno username, manda a welcome per completare
  useEffect(() => {
    if (!authLoading && (!resolvedUsername || resolvedUsername.trim() === '')) {
      navigate('/welcome', { replace: true })
    }
  }, [authLoading, resolvedUsername, navigate])

  return {
    ...shared,
    // Mostra loading finché auth è in corso oppure il core hook è in loading
    loading: authLoading || shared.loading,
  }
}
