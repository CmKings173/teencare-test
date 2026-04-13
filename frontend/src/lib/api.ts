import axios from 'axios';

/**
 * Centralized API client configuration.
 * Base URL is read from VITE_API_URL environment variable.
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
});

export default api;
