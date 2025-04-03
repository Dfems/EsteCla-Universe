/// <reference lib="webworker" />

declare const self: ServiceWorkerGlobalScope

self.addEventListener('install', (event) => {
  console.log('Service Worker installed')
  console.log(event)
})

self.addEventListener('activate', (event) => {
  console.log('Service Worker activated')
  console.log(event)
})

self.addEventListener('fetch', (event) => {
  // Logica custom per il caching
  console.log(event)
})
