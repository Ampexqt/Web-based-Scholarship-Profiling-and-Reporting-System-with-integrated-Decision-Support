import axios from 'axios';

// Dynamically determine the backend URL based on the current hostname.
// This allows the app to work seamlessly on localhost, local IP (for mobile testing), and production.
const getApiUrl = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  if (import.meta.env.PROD) {
    return '/api'; // Use relative path in production
  }
  
  // In development, point to the backend running on port 3000 of the same host
  return `http://${window.location.hostname}:3000/api`;
};

const API_URL = getApiUrl();

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor for attaching auth token if needed
apiClient.interceptors.request.use(
  (config) => {
    // Example: get token from local storage or Zustand store
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor for handling global responses/errors
apiClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    // Handle global errors (e.g., 401 Unauthorized redirect)
    if (error.response?.status === 401) {
      // e.g., redirect to login or clear store
    }
    return Promise.reject(error);
  }
);
