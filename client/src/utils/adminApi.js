import axios from 'axios';

// 1. Create the base connection
const adminApi = axios.create({
  baseURL: 'http://localhost:5000/api', // Adjust if your backend port is different
});

// 2. Request Interceptor: Automatically show the wristband
adminApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// 3. Response Interceptor: Kick out if the wristband is expired
adminApi.interceptors.response.use(
  (response) => {
    // Everything is good, pass the data through
    return response;
  },
  (error) => {
    // If the server says "401 Unauthorized" (token missing or expired)
    if (error.response && error.response.status === 401) {
      console.warn("Admin session expired. Logging out.");
      localStorage.removeItem('adminToken'); // Rip up the expired wristband
      window.location.href = '/admin/login'; // Escort out the front door
    }
    return Promise.reject(error);
  }
);

export default adminApi;