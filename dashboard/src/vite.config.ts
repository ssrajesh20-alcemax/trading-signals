import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  root: '.',
    base: '/trading-signals/',
  server: { port: 5173 },
  plugins: [react()],
})
