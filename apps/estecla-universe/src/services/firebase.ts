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

// Fail-fast con messaggio chiaro se mancano variabili necessarie
const missing = Object.entries(firebaseConfig)
  .filter(([, v]) => !v)
  .map(([k]) => k)

if (missing.length) {
  // Suggerisci come risolvere in locale con .env.local
  // Nota: Vite legge automaticamente i file .env.* alla radice del progetto app
  //       (es. apps/estecla-universe/.env.local)
  const hint =
    `Mancano variabili Firebase: ${missing.join(', ')}.\n` +
    "Crea un file .env.local in apps/estecla-universe con le chiavi VITE_FIREBASE_* oppure imposta le variabili d'ambiente.\n" +
    'Vedi anche apps/estecla-universe/.env.example.'
  // Mostra in console per contesto più leggibile durante lo sviluppo
  // e solleva un errore esplicito per evitare l'errore criptico auth/invalid-api-key
  // senza bloccare i type-check
  console.error('[Firebase config non valida]\n' + hint)
  throw new Error('Firebase config non valida: variabili mancanti')
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
