// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  appType: 'spa',
  // NO PROXY - we're using direct Railway calls
  server: {
    port: 5173
  }
})