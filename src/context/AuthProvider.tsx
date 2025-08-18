// src/context/AuthProvider.tsx
import React, { useEffect, useState } from 'react'
import { onAuthStateChanged, signOut, User as FirebaseUser } from 'firebase/auth'
import { doc, onSnapshot } from 'firebase/firestore'
import { auth, db } from '@services/firebase'
import { AuthContext } from './AuthContext'
import { UserInfo } from '@models/interfaces'

interface AuthProviderProps {
  children: React.ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserInfo | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Ascolta lo stato di autenticazione e sottoscrive in tempo reale il documento utente
    let unsubscribeUserDoc: (() => void) | null = null

    const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
      // Pulisci la precedente sottoscrizione al doc utente
      if (unsubscribeUserDoc) {
        unsubscribeUserDoc()
        unsubscribeUserDoc = null
      }

      if (firebaseUser) {
        try {
          const userDocRef = doc(db, 'users', firebaseUser.uid)
          unsubscribeUserDoc = onSnapshot(
            userDocRef,
            (snap) => {
              if (snap.exists()) {
                const userData = snap.data() as UserInfo
                setUser(userData)
              } else {
                // Documento mancante: manteniamo un utente minimo per evitare null
                const minimalUser: UserInfo = {
                  uid: firebaseUser.uid,
                  username: firebaseUser.displayName || '',
                  profilePic: firebaseUser.photoURL || '',
                }
                setUser(minimalUser)
              }
              setLoading(false)
            },
            (error) => {
              console.error('Errore sottoscrizione documento utente:', error)
              setUser(null)
              setLoading(false)
            }
          )
        } catch (error) {
          console.error("Errore nell'impostare la sottoscrizione del documento utente:", error)
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
      await signOut(auth)
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return <AuthContext.Provider value={{ user, loading, logout }}>{children}</AuthContext.Provider>
}
