import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/favicon.ico', 'icons/apple-touch-icon.png'],
      manifest: {
        name: 'Estecla Universe',
        short_name: 'Estecla',
        description: 'Il tuo social universe',
        theme_color: '#ffffff',
        icons: [
          {
            src: '/icons/web-app-manifest-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/icons/web-app-manifest-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
      },
      workbox: {
        maximumFileSizeToCacheInBytes: 3000000,
        globPatterns: ['**/*.{js,css,html,png,svg,ico}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
          },
          {
            urlPattern: /^https:\/\/firebasestorage\.googleapis\.com\/.*/i,
            handler: 'StaleWhileRevalidate',
          },
        ],
      },
    }),
  ],
})
