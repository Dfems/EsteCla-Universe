import { initFirebase } from '@estecla/firebase'

// Construisci la config leggendo da variabili Vite
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

// Check for missing variables but warn instead of throwing
const missing = Object.entries(firebaseConfig)
  .filter(([, v]) => !v)
  .map(([k]) => k)

if (missing.length) {
  const hint =
    `⚠️  Warning: Mancano variabili Firebase: ${missing.join(', ')}.\n` +
    "Per testare il login Google, crea un file .env.local in apps/estecla-universe con le chiavi VITE_FIREBASE_* oppure imposta le variabili d'ambiente.\n" +
    'Vedi anche apps/estecla-universe/.env.example.'
  console.warn('[Firebase config incompleta]\n' + hint)
  // Don't throw - let Firebase itself handle invalid config
}

const { app, auth, db, storage } = initFirebase(firebaseConfig)
export { googleProvider } from '@estecla/firebase'
export { app, auth, db, storage }

// Opzionale: riduci la verbosità dei log Firestore in ambienti di sviluppo o test
// Usa VITE_FIRESTORE_LOG_LEVEL = 'silent' | 'error' | 'debug'
const desiredLogLevel = (import.meta.env.VITE_FIRESTORE_LOG_LEVEL ?? '').toLowerCase()
if (desiredLogLevel === 'silent' || desiredLogLevel === 'error' || desiredLogLevel === 'debug') {
  // Firestore log level ora è controllato dentro i servizi se necessario
}
