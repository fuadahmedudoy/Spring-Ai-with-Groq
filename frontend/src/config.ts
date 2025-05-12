// API Configuration
const isDevelopment = import.meta.env.DEV;

// In development mode use local IP, in production use the environment variable
export const API_BASE_URL = isDevelopment 
  ? 'http://192.168.1.110:8080'
  : import.meta.env.VITE_API_BASE_URL || 'https://your-backend-url.com'; 