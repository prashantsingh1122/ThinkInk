// API URL configuration for different environments (no collisions):
// 1. Local dev (npm run dev) → http://localhost:5000/api (local backend)
// 2. Docker (docker compose) → /api (proxied by Nginx to Docker backend)
// 3. Vercel (production) → https://thinkink-backend.onrender.com/api (Render backend)
//    Set VITE_API_BASE_URL in Vercel environment variables
const getApiUrl = () => {
  // Priority 1: Explicitly set via environment variable (highest priority)
  // This is used by Vercel/Render deployments - set in their dashboard
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  
  // Priority 2: Local development mode (npm run dev)
  // Uses local backend on localhost:5000 - no collision with Docker or production
  if (import.meta.env.DEV) {
    return 'http://localhost:5000/api';
  }
  
  // Priority 3: Production build (Docker or Vercel without env var)
  // Default to relative /api (works for Docker - Nginx proxies to backend)
  // For Vercel: MUST set VITE_API_BASE_URL=https://thinkink-backend.onrender.com/api
  // This ensures Vercel frontend → Render backend (not Docker backend)
  return '/api';
};

const config = {
  apiUrl: getApiUrl(),
};

export default config;