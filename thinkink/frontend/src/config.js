const config = {
  apiUrl: import.meta.env.VITE_API_BASE_URL || 
    (import.meta.env.DEV ? 'http://localhost:5000/api' : 'https://thinkink-backend.onrender.com/api'),
};

export default config;