// API Configuration
// Use environment variable in production, fallback to local IP for development
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://192.168.1.110:8080'; 