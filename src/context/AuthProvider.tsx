// src/context/AuthProvider.tsx
import React, { useEffect, useState } from 'react'
import { onAuthStateChanged, signOut, User as FirebaseUser } from 'firebase/auth'
import { auth } from '../services/firebase'
import { AuthContext } from './AuthContext'
import { UserInfo } from '../types/interfaces'

interface AuthProviderProps {
  children: React.ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserInfo | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        // Creiamo un minimal user (prendendo i dati disponibili da Firebase)
        const minimalUser: UserInfo = {
          uid: firebaseUser.uid,
          username: firebaseUser.displayName || '',
          profilePic: firebaseUser.photoURL || '',
        }
        setUser(minimalUser)
      } else {
        setUser(null)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const logout = async () => {
    try {
      await signOut(auth)
    } catch (error) {
      console.error('Logout error: ', error)
    }
  }

  return <AuthContext.Provider value={{ user, loading, logout }}>{children}</AuthContext.Provider>
}
