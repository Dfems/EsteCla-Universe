import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

function classifyChunk(id: string): string | undefined {
  const inNodeModules = id.includes('node_modules')
  if (inNodeModules) {
    const vendors = [
      { test: /@chakra-ui/, name: 'chakra' },
      { test: /firebase/, name: 'firebase' },
      { test: /react-router/, name: 'router' },
    ] as const
    const hit = vendors.find((v) => v.test.test(id))
    return hit ? hit.name : 'vendor'
  }

  const isUi = /@estecla(?:\/)?ui|[\\/]packages[\\/]ui[\\/]/.test(id)
  if (isUi) {
    if (id.includes('/navigation/')) return 'ui-navigation'
    if (id.includes('/feedback/')) return 'ui-feedback'
    if (id.includes('/profile/')) return 'ui-profile'
    return 'ui'
  }

  const isSdk = /@estecla(?:\/)?firebase(?!-react)|[\\/]packages[\\/]firebase[\\/]/.test(id)
  if (isSdk) return 'sdk'
  return undefined
}

export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@components': fileURLToPath(new URL('./src/components', import.meta.url)),
      '@pages': fileURLToPath(new URL('./src/pages', import.meta.url)),
      '@routes': fileURLToPath(new URL('./src/routes', import.meta.url)),
      '@hooks': fileURLToPath(new URL('./src/hooks', import.meta.url)),
      '@context': fileURLToPath(new URL('./src/context', import.meta.url)),
      '@features': fileURLToPath(new URL('./src/features', import.meta.url)),
      '@services': fileURLToPath(new URL('./src/services', import.meta.url)),
    },
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/favicon.ico', 'icons/apple-touch-icon.png'],
      // Important: don't intercept Firebase reserved paths like /__/auth/handler
      workbox: {
        navigateFallbackDenylist: [/^\/__/],
        // Ensure we never cache the auth handler route
        runtimeCaching: [
          {
            urlPattern: /^\/__\//,
            handler: 'NetworkOnly',
            options: { cacheName: 'bypass-firebase-reserved' },
          },
        ],
      },
      manifest: {
        name: 'Estecla Universe',
        short_name: 'Estecla',
        description: 'Il tuo social universe',
        theme_color: '#ffffff',
        icons: [
          { src: '/icons/web-app-manifest-192x192.png', sizes: '192x192', type: 'image/png' },
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
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => classifyChunk(id),
      },
    },
    chunkSizeWarningLimit: 1500,
  },
})
