import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
    resolve: {
    alias: {
      'stream': 'stream-browserify',
      'buffer': 'buffer',
    }
  },
  optimizeDeps: {
    esbuildOptions: {
      // Node.js global to browser polyfills
      define: {
        global: 'globalThis',
      },
    }
  }
})
