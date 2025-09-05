import { initFirebase } from '@estecla/firebase'
import { GoogleAuthProvider } from 'firebase/auth'
import { setLogLevel as setFirestoreLogLevel } from 'firebase/firestore'

// Config da Vite
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

// Fail-fast se manca qualcosa
const missing = Object.entries(firebaseConfig)
  .filter(([, v]) => !v)
  .map(([k]) => k)
if (missing.length) {
  const hint =
    `Mancano variabili Firebase: ${missing.join(', ')}.\n` +
    "Crea un file .env.local in apps/estecla-universe con le chiavi VITE_FIREBASE_* oppure imposta le variabili d'ambiente.\n" +
    'Vedi anche apps/estecla-universe/.env.example.'
  console.error('[Firebase config non valida]\n' + hint)
  throw new Error('Firebase config non valida: variabili mancanti')
}

// Inizializza
const { app, auth, db, storage } = initFirebase(firebaseConfig)

// ✅ Provider QUI (configurazione liberamente modificabile)
export const googleProvider = new GoogleAuthProvider()
// Esempi possibili:
// googleProvider.setCustomParameters({ prompt: 'select_account' })
// googleProvider.addScope('https://www.googleapis.com/auth/contacts.readonly')

// (Opzionale) log Firestore da env
const desiredLogLevel = (import.meta.env.VITE_FIRESTORE_LOG_LEVEL ?? '').toLowerCase()
if (desiredLogLevel === 'silent' || desiredLogLevel === 'error' || desiredLogLevel === 'debug') {
  setFirestoreLogLevel(desiredLogLevel as 'silent' | 'error' | 'debug')
}

export { app, auth, db, storage }
