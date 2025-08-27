// src/hooks/useProfile.ts
import { useProfile as useSharedProfile } from '@estecla/hooks'
import { useNavigate, useParams } from 'react-router-dom'

export const useProfile = () => {
  const { username } = useParams<{ username: string }>()
  const navigate = useNavigate()
  return useSharedProfile({ username, onMissing: () => navigate('/') })
}
