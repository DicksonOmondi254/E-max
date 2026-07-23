import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Increase chunk size warning limit to 1000 kB (fewer false positives)
    chunkSizeWarningLimit: 1000,
  },
})
