import { initFirebase } from '@estecla/firebase'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

const { app, auth, db, storage } = initFirebase(firebaseConfig)
export { app, auth, db, storage }
export { googleProvider } from '@estecla/firebase'

// Opzionale: riduci la verbosità dei log Firestore in ambienti di sviluppo o test
// Usa VITE_FIRESTORE_LOG_LEVEL = 'silent' | 'error' | 'debug'
const desiredLogLevel = (import.meta.env.VITE_FIRESTORE_LOG_LEVEL ?? '').toLowerCase()
if (desiredLogLevel === 'silent' || desiredLogLevel === 'error' || desiredLogLevel === 'debug') {
  // Firestore log level ora è controllato dentro i servizi se necessario
}
