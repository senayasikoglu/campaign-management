import axios from 'axios';
/**
 * API Utility
 * Creates an axios instance with a base URL
 * Intercepts requests to add authentication headers
 */
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api'
});
  

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle unAuhtorized error
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const originalUrl = error.config?.url || '';

    // Only force logout + redirect for protected requests, not for login itself
    if (status === 401) {
      const hasToken = !!localStorage.getItem('token');
      const isLoginRequest = originalUrl.includes('/auth/login');

      if (hasToken && !isLoginRequest) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default api; 