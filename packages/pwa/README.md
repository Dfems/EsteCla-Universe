# @estecla/pwa

API minime per PWA, senza dipendenze da React. Offre helper per:
- registrazione/unregister del Service Worker
- pulizia cache e storage
- ascolto aggiornamenti di base (senza Workbox)
- integrazione opzionale con Workbox (se installato dall’app)

## API
- `registerSW(options)`
- `unregisterSW()`
- `clearCaches(patterns)`
- `getSWStatus()`
- `listenForUpdates(cb)`
- `promptUpdate()`
- `setupWorkboxUpdateFlow(wb, onNeedRefresh?, onUpdated?)`

## Uso base (Vite + vite-plugin-pwa)
```ts
import { registerSW, listenForUpdates, promptUpdate } from '@estecla/pwa'

await registerSW({ url: '/sw.js' })
listenForUpdates(({ updated }) => {
	if (updated) window.location.reload()
})
await promptUpdate()
```

Note: con vite-plugin-pwa in modalità generateSW il file è `sw.js`.

## Integrazione opzionale con Workbox

Questo pacchetto non importa `workbox-window` a runtime: è un peer opzionale. Se l’app lo installa, può passare un’istanza di `Workbox` ai nostri helper.

Installazione nell’app:

```sh
npm i -D workbox-window
```

Wiring consigliato:

```ts
import { Workbox } from 'workbox-window'
import { setupWorkboxUpdateFlow } from '@estecla/pwa'

const wb = new Workbox('/sw.js')

let needRefresh = false
const { update } = setupWorkboxUpdateFlow(
	wb,
	() => {
		needRefresh = true
		// mostra banner/toast "New version available"
	},
	() => {
		// nuova versione attiva: ricarica o aggiorna stato UI
		window.location.reload()
	}
)

// Quando l’utente accetta di aggiornare:
if (needRefresh) await update()
```

Note:
- Non effettuiamo import di `workbox-window` per non forzare la dipendenza.
- Se non installi `workbox-window`, continua a funzionare l’API base.
- Il messaggio `{ type: 'SKIP_WAITING' }` è gestito dal SW generato da Workbox in generateSW.
