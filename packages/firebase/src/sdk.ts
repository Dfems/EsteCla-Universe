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

let globalServices: FirebaseServices | null = null

export function initFirebase(config: object): FirebaseServices {
  const app = getApps().length ? getApps()[0] : initializeApp(config)
  const services = {
    app,
    auth: getAuth(app),
    db: getFirestore(app),
    storage: getStorage(app),
  }
  globalServices = services
  return services
}

// Create and export a single Google provider instance
export const googleProvider = new GoogleAuthProvider()

// Simple getter for services without the complexity of service injection
export function getServices(): FirebaseServices {
  if (!globalServices) {
    const apps = getApps()
    if (!apps.length) {
      throw new Error(
        "Firebase non inizializzato: chiama initFirebase nell'app prima di usare i hook condivisi"
      )
    }
    const app = apps[0]
    globalServices = {
      app,
      auth: getAuth(app),
      db: getFirestore(app),
      storage: getStorage(app),
    }
  }
  return globalServices
}
