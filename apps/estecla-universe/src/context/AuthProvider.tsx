// src/context/AuthProvider.tsx
import React, { useEffect, useState } from 'react'
import { onAuthStateChanged, signOut, User as FirebaseUser } from 'firebase/auth'
import { doc, onSnapshot, getDoc } from 'firebase/firestore'
import { FirebaseError } from 'firebase/app'
import { auth, db } from '@services/firebase'
import { AuthContext } from '@context/AuthContext'
import { UserInfo } from '@estecla/types'

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
        ;(async () => {
          try {
            const userDocRef = doc(db, 'users', firebaseUser.uid)
            // Primo tentativo: lettura singola per verificare i permessi
            const snap = await getDoc(userDocRef)

            if (snap.exists()) {
              setUser(snap.data() as UserInfo)
            } else {
              // Documento mancante: utente minimo per evitare null
              const minimalUser: UserInfo = {
                uid: firebaseUser.uid,
                username: firebaseUser.displayName || '',
                profilePic: firebaseUser.photoURL || '',
              }
              setUser(minimalUser)
            }

            // Se la prima lettura è andata a buon fine, apriamo il listener realtime
            unsubscribeUserDoc = onSnapshot(
              userDocRef,
              (docSnap) => {
                if (docSnap.exists()) {
                  setUser(docSnap.data() as UserInfo)
                }
                // Se non esiste, manteniamo lo stato attuale (minimo o precedente)
              },
              (err) => {
                // Evita errori "uncaught" del listener: log sobrio senza rompere il flusso UI
                console.warn('Listener user doc interrotto:', err)
              }
            )
            setLoading(false)
          } catch (err: unknown) {
            // Gestione specifica permessi negati
            if (err instanceof FirebaseError && err.code === 'permission-denied') {
              console.warn(
                'Permessi insufficienti per leggere il profilo; fallback a utente minimo'
              )
              const minimalUser: UserInfo = {
                uid: firebaseUser.uid,
                username: firebaseUser.displayName || '',
                profilePic: firebaseUser.photoURL || '',
              }
              setUser(minimalUser)
              setLoading(false)
              return
            }
            console.error('Errore nel recupero del documento utente:', err)
            setUser(null)
            setLoading(false)
          }
        })()
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
