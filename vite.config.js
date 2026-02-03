import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': '/src',
      '@components': '/src/components',
      '@ui': '/src/components/ui',
      '@layouts': '/src/layouts',
      '@screens': '/src/screens',
      '@hooks': '/src/hooks',
      '@context': '/src/context',
      '@utils': '/src/utils',
      '@services': '/src/services',
      '@assets': '/src/assets',
      '@styles': '/src/styles',
      '@config': '/src/config',
    },
  },
})
