import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

// Keep chunks small and cache-friendly by grouping popular deps
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

  // Shared Estecla SDK split, if used here
  const isSdk = /@estecla(?:\/)?firebase(?!-react)|[\\/]packages[\\/]firebase[\\/]/.test(id)
  if (isSdk) return 'sdk'
  return undefined
}

export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
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
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => classifyChunk(id),
      },
    },
    // Relax the warning threshold to align with Estecla; real fix is chunking above
    chunkSizeWarningLimit: 1500,
  },
})
