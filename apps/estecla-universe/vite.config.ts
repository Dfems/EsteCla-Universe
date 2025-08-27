import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import { fileURLToPath, URL } from 'node:url'

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
      '@services': fileURLToPath(new URL('./src/lib', import.meta.url)),
      '@theme': fileURLToPath(new URL('./src/styles/theme.ts', import.meta.url)),
      '@assets': fileURLToPath(new URL('./src/assets', import.meta.url)),
      '@ui': fileURLToPath(new URL('../../packages/ui/src', import.meta.url)),
      '@types': fileURLToPath(new URL('../../packages/types/src', import.meta.url)),
      '@utils': fileURLToPath(new URL('../../packages/utils/src', import.meta.url)),
      '@theme-pkg': fileURLToPath(new URL('../../packages/theme/src', import.meta.url)),
    },
  },
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
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('@chakra-ui')) return 'chakra'
            if (id.includes('firebase')) return 'firebase'
            if (id.includes('react-router')) return 'router'
            return 'vendor'
          }
          if (id.includes('/packages/ui/')) {
            if (id.includes('/navigation/')) return 'ui-navigation'
            if (id.includes('/social/')) return 'ui-social'
            if (id.includes('/feedback/')) return 'ui-feedback'
            return 'ui'
          }
          if (id.includes('/packages/firebase/')) return 'sdk'
          return undefined
        },
      },
    },
    chunkSizeWarningLimit: 1500,
  },
})
