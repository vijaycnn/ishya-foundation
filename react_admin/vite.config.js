import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base : '/admin/',
  plugins: [react()],
  server: {
    host: '127.0.0.1',
    port: 5173, // 👈 change this to your custom port
    strictPort: true,
    allowedHosts: ['0.0.0.0'],    
    hmr: false,
    cors: false,
    fs: {
      strict: true
    }
  },
})
