// API minime PWA (no React)
export type SWStatus =
  | 'unsupported'
  | 'unregistered'
  | 'registered'
  | 'installing'
  | 'installed'
  | 'activating'
  | 'activated'
  | 'redundant'

export interface RegisterOptions {
  scope?: string
  url?: string // default: /sw.js (vite-plugin-pwa generateSW)
}

export interface UpdateInfo {
  updated: boolean
  needRefresh: boolean
}

export async function registerSW(
  options: RegisterOptions = {}
): Promise<ServiceWorkerRegistration | null> {
  if (!('serviceWorker' in navigator)) return null
  const url = options.url ?? '/sw.js'
  return navigator.serviceWorker.register(url, { scope: options.scope })
}

export async function unregisterSW(): Promise<boolean> {
  if (!('serviceWorker' in navigator)) return false
  const reg = await navigator.serviceWorker.getRegistration()
  if (!reg) return false
  await reg.unregister()
  return true
}

export async function clearCaches(patterns: (string | RegExp)[] = [/./]): Promise<number> {
  if (!('caches' in window)) return 0
  const names = await caches.keys()
  let removed = 0
  for (const name of names) {
    if (patterns.some((p) => (typeof p === 'string' ? name.includes(p) : p.test(name)))) {
      if (await caches.delete(name)) removed++
    }
  }
  // storage locali
  try {
    localStorage.clear()
  } catch {
    // ignore storage clearing errors
  }
  try {
    sessionStorage.clear()
  } catch {
    // ignore storage clearing errors
  }
  return removed
}

export async function getSWStatus(): Promise<SWStatus> {
  if (!('serviceWorker' in navigator)) return 'unsupported'
  const reg = await navigator.serviceWorker.getRegistration()
  if (!reg) return 'unregistered'
  const s = reg.installing ?? reg.waiting ?? reg.active
  return (s?.state as SWStatus) ?? 'registered'
}

export function listenForUpdates(cb: (info: UpdateInfo) => void): () => void {
  if (!('serviceWorker' in navigator)) return () => {}
  const onControllerChange = () => cb({ updated: true, needRefresh: false })
  navigator.serviceWorker.addEventListener('controllerchange', onControllerChange)
  return () => navigator.serviceWorker.removeEventListener('controllerchange', onControllerChange)
}

export async function promptUpdate(): Promise<void> {
  if (!('serviceWorker' in navigator)) return
  const reg = await navigator.serviceWorker.getRegistration()
  await reg?.update()
}

// Optional Workbox integration (no runtime import to keep peer truly optional)
// Minimal shape of a Workbox instance passed from the app (constructed via new Workbox('/sw.js'))
export interface MinimalWorkbox {
  addEventListener: (
    type: 'waiting' | 'controlling' | 'message',
    listener: (event: unknown) => void
  ) => void
  register: () => Promise<void>
  messageSW: (data: unknown) => Promise<unknown>
}

/**
 * Wire a standard Workbox update flow.
 * The app is responsible for constructing the Workbox instance and passing it in.
 * Returns an async "update" function that sends SKIP_WAITING and reloads when controlled.
 */
export function setupWorkboxUpdateFlow(
  wb: MinimalWorkbox,
  onNeedRefresh?: () => void,
  onUpdated?: () => void
) {
  // When a new SW is waiting, notify the app UI so it can prompt the user
  wb.addEventListener('waiting', () => {
    onNeedRefresh?.()
  })

  // Once the new SW takes control, notify and optionally reload
  wb.addEventListener('controlling', () => {
    onUpdated?.()
  })

  // Start registration
  void wb.register()

  // Return an updater that asks the waiting SW to skip waiting, then reloads when controlled
  const update = async () => {
    try {
      await wb.messageSW({ type: 'SKIP_WAITING' })
      // The page will be reloaded by the app when receiving 'controlling' or manually here
    } catch {
      // ignore message errors
    }
  }

  return { update }
}
