import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    proxy: {
      '/api': {
        target: process.env.NODE_ENV === 'production' 
          ? 'https://thinkink-backend.onrender.com' 
          : 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
