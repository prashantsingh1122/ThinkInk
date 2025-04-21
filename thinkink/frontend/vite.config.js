import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,           // equivalent to 0.0.0.0 → accessible on local network
    port: 5173,           // you can change if needed
  },
})
