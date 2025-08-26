import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore, setLogLevel } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)
export const googleProvider = new GoogleAuthProvider()

// Opzionale: riduci la verbosità dei log Firestore in ambienti di sviluppo o test
// Usa VITE_FIRESTORE_LOG_LEVEL = 'silent' | 'error' | 'debug'
const desiredLogLevel = (import.meta.env.VITE_FIRESTORE_LOG_LEVEL ?? '').toLowerCase()
if (desiredLogLevel === 'silent' || desiredLogLevel === 'error' || desiredLogLevel === 'debug') {
  setLogLevel(desiredLogLevel as 'silent' | 'error' | 'debug')
} else if (import.meta.env.MODE !== 'production') {
  // Default in dev: riduci a 'error' per evitare log rumorosi di listener falliti
  setLogLevel('error')
}
