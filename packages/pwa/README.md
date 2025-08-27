# @estecla/pwa

API piccole e riusabili per interagire con il Service Worker, senza dipendenze da React.

## API
- registerSW(options)
- unregisterSW()
- clearCaches(patterns)
- getSWStatus()
- listenForUpdates(cb)
- promptUpdate()

## Uso rapido (Vite + vite-plugin-pwa)
```ts
import { registerSW } from '@estecla/pwa'

registerSW({ url: '/sw.js' })
```

Note: con vite-plugin-pwa in modalità generateSW il file è `sw.js`.
