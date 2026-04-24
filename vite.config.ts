import path from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined
          // Check most specific patterns first to avoid substring collisions
          if (id.includes('/framer-motion/')) return 'motion'
          if (id.includes('/@tanstack/')) return 'query'
          if (id.includes('/react-router')) return 'router'
          if (id.includes('/react-dom/') || id.includes('/node_modules/react/')) return 'react-vendor'
          return 'vendor'
        },
      },
    },
  },
})
