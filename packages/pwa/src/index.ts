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
  } catch {}
  try {
    sessionStorage.clear()
  } catch {}
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
