import axios from 'axios';

// Create a base Axios instance for public routes
const api = axios.create({
  // Use import.meta.env for Vite, falling back to localhost
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Optional: Global error logger for public requests
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("Public API Error:", error.message);
    return Promise.reject(error);
  }
);

export default api;