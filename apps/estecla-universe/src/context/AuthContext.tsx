// src/context/AuthContext.ts
import { createContext, useContext } from 'react'
import { UserInfo } from '@models/interfaces'

interface AuthContextValue {
  user: UserInfo | null
  loading: boolean
  logout: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  logout: async () => {},
})

// Custom hook per usare il contesto
export const useAuth = () => {
  return useContext(AuthContext)
}
