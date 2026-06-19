import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['gemini-service', 'shared', 'pipeline']
  },
  build: {
    commonjsOptions: {
      include: [/gemini-service/, /shared/, /pipeline/, /node_modules/]
    }
  }
})
