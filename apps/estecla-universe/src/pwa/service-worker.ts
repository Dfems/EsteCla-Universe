/// <reference lib="webworker" />

const sw = self as unknown as ServiceWorkerGlobalScope

sw.addEventListener('install', (event) => {
  console.log('Service Worker installed')
  console.log(event)
})

sw.addEventListener('activate', (event) => {
  console.log('Service Worker activated')
  console.log(event)
})

sw.addEventListener('fetch', (event) => {
  // Logica custom per il caching
  console.log(event)
})
