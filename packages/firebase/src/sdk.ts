// packages/firebase/src/sdk.ts (o index.ts se preferisci)
import { getApps, initializeApp, type FirebaseApp, type FirebaseOptions } from 'firebase/app'
import { getAuth, type Auth } from 'firebase/auth'
import { getFirestore, type Firestore } from 'firebase/firestore'
import { getStorage, type FirebaseStorage } from 'firebase/storage'

export interface FirebaseServices {
  app: FirebaseApp
  auth: Auth
  db: Firestore
  storage: FirebaseStorage
}

let globalServices: FirebaseServices | null = null

export function initFirebase(config: FirebaseOptions): FirebaseServices {
  const app = getApps().length ? getApps()[0]! : initializeApp(config)
  const services: FirebaseServices = {
    app,
    auth: getAuth(app),
    db: getFirestore(app),
    storage: getStorage(app),
  }
  globalServices = services
  return services
}

export function getServices(): FirebaseServices {
  if (globalServices) return globalServices
  const apps = getApps()
  if (!apps.length) {
    throw new Error(
      "Firebase non inizializzato: chiama initFirebase nell'app prima di usare i servizi"
    )
  }
  const app = apps[0]!
  globalServices = {
    app,
    auth: getAuth(app),
    db: getFirestore(app),
    storage: getStorage(app),
  }
  return globalServices
}

// ❌ Opzionale: rimuovi questo dal core per flessibilità
// export const googleProvider = new GoogleAuthProvider()
