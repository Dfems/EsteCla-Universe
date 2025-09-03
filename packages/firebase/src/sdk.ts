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

// Validate Firebase configuration
function validateFirebaseConfig(config: any): void {
  const requiredKeys = ['apiKey', 'authDomain', 'projectId', 'storageBucket', 'messagingSenderId', 'appId']
  const missing = requiredKeys.filter(key => !config[key])
  
  if (missing.length > 0) {
    console.error('Missing Firebase config keys:', missing)
    throw new Error(`Firebase configuration incomplete. Missing: ${missing.join(', ')}`)
  }
  
  console.log('Firebase configuration validated successfully')
}

export function initFirebase(config: object): FirebaseServices {
  validateFirebaseConfig(config)
  
  const app = getApps().length ? getApps()[0] : initializeApp(config)
  console.log('Firebase app initialized with project:', (config as any).projectId)
  
  return {
    app,
    auth: getAuth(app),
    db: getFirestore(app),
    storage: getStorage(app),
  }
}

export const googleProvider = new GoogleAuthProvider()

// Configure Google provider with proper scopes and custom parameters
googleProvider.addScope('email')
googleProvider.addScope('profile')
googleProvider.setCustomParameters({
  prompt: 'select_account' // Always show account selection dialog
})

console.log('Google provider configured with scopes:', googleProvider.getScopes())

// Ottiene i servizi dall'app Firebase già inizializzata.
// Nota: richiede che l'app sia stata inizializzata altrove (es. nell'app consumer).
export function getServices(): FirebaseServices {
  const apps = getApps()
  if (!apps.length) {
    throw new Error(
      "Firebase non inizializzato: chiama initFirebase nell'app prima di usare i hook condivisi"
    )
  }
  const app = apps[0]
  return {
    app,
    auth: getAuth(app),
    db: getFirestore(app),
    storage: getStorage(app),
  }
}
