import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@hooks': fileURLToPath(new URL('../../packages/hooks/src', import.meta.url)),
      '@types': fileURLToPath(new URL('../../packages/types/src', import.meta.url)),
      '@utils': fileURLToPath(new URL('../../packages/utils/src', import.meta.url)),
      '@theme-pkg': fileURLToPath(new URL('../../packages/theme/src', import.meta.url)),
      '@estecla/firebase-react': fileURLToPath(
        new URL('../../packages/firebase-react/src', import.meta.url)
      ),
    },
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      includeAssets: ['icons/favicon.ico', 'icons/apple-touch-icon.png'],
      manifest: {
        name: 'Glufri Travelers',
        short_name: 'Glufri',
        description: 'Viaggi condivisi',
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
})
