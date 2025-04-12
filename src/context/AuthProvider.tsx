// src/context/AuthProvider.tsx
import React, { useEffect, useState } from 'react'
import { onAuthStateChanged, signOut, User as FirebaseUser } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { auth, db } from '../services/firebase'
import { AuthContext } from './AuthContext'
import { UserInfo } from '../types/interfaces'

interface AuthProviderProps {
  children: React.ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserInfo | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Ascoltiamo le variazioni dello stato di autenticazione tramite Firebase Auth
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        try {
          // Recupera il documento utente dalla collezione "users" in Firestore
          const userDocRef = doc(db, 'users', firebaseUser.uid)
          const snap = await getDoc(userDocRef)

          if (snap.exists()) {
            // Se il documento esiste, usiamo i dati completi salvati su Firestore
            const userData = snap.data() as UserInfo
            setUser(userData)
          } else {
            // Se per qualche motivo il documento non esiste (caso raro),
            // creiamo un oggetto minimo usando i dati disponibili in firebaseUser
            const minimalUser: UserInfo = {
              uid: firebaseUser.uid,
              username: firebaseUser.displayName || '',
              profilePic: firebaseUser.photoURL || '',
            }
            setUser(minimalUser)
          }
        } catch (error) {
          console.error('Errore nel recuperare il documento utente:', error)
          setUser(null)
        }
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
      console.error('Logout error:', error)
    }
  }

  return <AuthContext.Provider value={{ user, loading, logout }}>{children}</AuthContext.Provider>
}
