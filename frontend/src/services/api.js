import axios from 'axios';

// Hardcoded for the hackathon deployment to prevent any environment variable issues
const API_BASE_URL = 'https://ratefluencer-backend-1.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add a request interceptor to attach JWT token
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
