# @estecla/firebase-react

Provider React condiviso per autenticazione basato su @estecla/firebase.

Requisiti:
- L'app deve inizializzare Firebase (initFirebase) prima dell'uso.
- React 18+.

Uso:

```tsx
// main.tsx
import { initFirebase } from '@estecla/firebase'
import { AuthProvider } from '@estecla/firebase-react'

initFirebase({ /* env config */ })

root.render(
  <AuthProvider>
    <App />
  </AuthProvider>
)
```

API:
- AuthProvider: React provider che espone { user, loading, logout }
- useAuth: hook per accedere al contesto