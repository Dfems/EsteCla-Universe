import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  root: '.',
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@ui': fileURLToPath(new URL('../../packages/ui/src', import.meta.url)),
      '@hooks': fileURLToPath(new URL('../../packages/hooks/src', import.meta.url)),
      '@types': fileURLToPath(new URL('../../packages/types/src', import.meta.url)),
      '@firebase': fileURLToPath(new URL('../../packages/firebase/src', import.meta.url)),
      '@utils': fileURLToPath(new URL('../../packages/utils/src', import.meta.url)),
      '@theme': fileURLToPath(new URL('../../packages/theme/src', import.meta.url)),
    },
  },
  plugins: [react()],
})
