// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // NO PROXY - we're using direct Railway calls
  server: {
    port: 5173,
    rewrites: [
      {
        source: /^\/(?!api|assets|\.well-known)(\/.*)?/,
        destination: '/index.html',
      },
    ],
  },
});