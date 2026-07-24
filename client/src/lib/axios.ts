import axios from 'axios';

// You can set the base URL from your environment variables
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

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
