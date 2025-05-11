import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
  baseURL: 'http://localhost:5000',
  withCredentials: true
});

// Add request interceptor to add Authorization header to all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle token refresh on 401 errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // If the error is 401 and we haven't already tried to refresh the token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Try to refresh the token
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) {
          // No refresh token available, redirect to login
          return Promise.reject(error);
        }
        
        // Call the refresh endpoint
        const response = await axios.post(
          'http://localhost:5000/refresh',
          {},
          {
            headers: {
              'Authorization': `Bearer ${refreshToken}`
            },
            withCredentials: true
          }
        );
        
        // If successful, update the access token
        if (response.data.access_token) {
          localStorage.setItem('access_token', response.data.access_token);
          
          // Update the original request with the new token
          originalRequest.headers.Authorization = `Bearer ${response.data.access_token}`;
          
          // Retry the original request
          return axios(originalRequest);
        }
      } catch (refreshError) {
        // If refresh fails, clear tokens and reject
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        return Promise.reject(error);
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;
