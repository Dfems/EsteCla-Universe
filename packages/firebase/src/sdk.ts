import { initializeApp, getApps, type FirebaseApp } from 'firebase/app'
import { getAuth, type Auth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore, type Firestore } from 'firebase/firestore'
import { getStorage, type FirebaseStorage } from 'firebase/storage'

export interface FirebaseServices {
  app: FirebaseApp
  auth: Auth
  db: Firestore
  storage: FirebaseStorage
}

export function initFirebase(config: object): FirebaseServices {
  const app = getApps().length ? getApps()[0] : initializeApp(config)
  return {
    app,
    auth: getAuth(app),
    db: getFirestore(app),
    storage: getStorage(app),
  }
}

export const googleProvider = new GoogleAuthProvider()
