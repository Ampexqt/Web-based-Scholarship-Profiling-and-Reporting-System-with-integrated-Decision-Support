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
  
  // In development, point to the Vite proxy to avoid firewall and CORS issues on mobile devices
  return '/api';
};

export const getBaseUrl = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL.replace(/\/api$/, '');
  }
  
  if (import.meta.env.PROD) {
    return ''; 
  }
  return ''; // Use relative path to rely on Vite proxy
};

export const API_URL = getApiUrl();

export const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true,
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

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Interceptor for handling global responses/errors
apiClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  async (error) => {
    const originalRequest = error.config;

    // If 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then(() => {
            return apiClient(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Attempt to refresh token
        await axios.post(`${API_URL}/auth/refresh`, {}, { withCredentials: true });
        
        isRefreshing = false;
        processQueue(null);
        
        // Retry the original request
        return apiClient(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;
        processQueue(refreshError, null);
        
        // Refresh token is expired or invalid, log user out
        localStorage.removeItem('isLoggedIn');
        window.location.href = '/login';
        
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
