import { getServices } from '@estecla/firebase'
import type { UserInfo } from '@estecla/types'
import type { User as FirebaseUser } from 'firebase/auth'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { doc, getDoc, onSnapshot } from 'firebase/firestore'
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'

export interface AuthContextValue {
  user: UserInfo | null
  loading: boolean
  logout: () => Promise<void>
}

const defaultValue: AuthContextValue = {
  user: null,
  loading: true,
  logout: async () => {},
}

const AuthContext = createContext<AuthContextValue>(defaultValue)

export const useAuth = () => useContext(AuthContext)

export interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<UserInfo | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const { auth, db } = getServices()

    let unsubscribeUserDoc: (() => void) | null = null
    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (unsubscribeUserDoc) {
        unsubscribeUserDoc()
        unsubscribeUserDoc = null
      }

      if (firebaseUser) {
        try {
          const userDocRef = doc(db, 'users', firebaseUser.uid)
          const snap = await getDoc(userDocRef)
          if (snap.exists()) {
            setUser(snap.data() as UserInfo)
          } else {
            const minimalUser: UserInfo = {
              uid: firebaseUser.uid,
              username: firebaseUser.displayName || '',
              profilePic: firebaseUser.photoURL || '',
            }
            setUser(minimalUser)
          }
          unsubscribeUserDoc = onSnapshot(
            userDocRef,
            (docSnap) => {
              if (docSnap.exists()) setUser(docSnap.data() as UserInfo)
            },
            (err) => console.warn('User doc listener error:', err)
          )
          setLoading(false)
        } catch (err) {
          console.error('Error fetching user profile:', err)
          setUser(null)
          setLoading(false)
        }
      } else {
        setUser(null)
        setLoading(false)
      }
    })

    return () => {
      if (unsubscribeUserDoc) unsubscribeUserDoc()
      unsubscribeAuth()
    }
  }, [])

  const logout = async () => {
    try {
      const { auth } = getServices()
      await signOut(auth)
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const value = useMemo<AuthContextValue>(() => ({ user, loading, logout }), [user, loading])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
