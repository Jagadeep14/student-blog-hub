import axios from 'axios';

// Create Axios instance with base API URL
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Interceptor to automatically add JWT token to outgoing requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
