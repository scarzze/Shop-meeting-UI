import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../utils/axiosConfig';

// Create the auth context
export const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  // Initialize user state from localStorage if available
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem('access_token');
    const savedUser = localStorage.getItem('user');
    if (token && savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch (e) {
        return null;
      }
    }
    return null;
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to check authentication status
  const checkAuthStatus = async () => {
    try {
      setLoading(true);
      
      // Check if we have a token in localStorage
      const token = localStorage.getItem('access_token');
      
      if (!token) {
        setUser(null);
        return false;
      }
      
      // Get user profile using the token
      const response = await api.get('/profile');
      
      setUser(response.data);
      return true;
    } catch (err) {
      // Clear user state and tokens if not authenticated
      setUser(null);
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
      setError(err.response?.data?.error || 'Authentication failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Check if user is authenticated on component mount and set up token refresh
  useEffect(() => {
    // Initial auth check
    checkAuthStatus();

    // Set up token refresh interval (every 45 minutes)
    const refreshInterval = setInterval(async () => {
      if (user) {
        try {
          await refreshToken();
          console.log('Token refreshed successfully');
        } catch (err) {
          console.error('Failed to refresh token:', err);
        }
      }
    }, 45 * 60 * 1000); // 45 minutes

    return () => clearInterval(refreshInterval);
  }, []); // Empty dependency array to only run on mount

  // Login function
  const login = async (username, password) => {
    try {
      setLoading(true);
      const response = await api.post('/login', { username, password });
      
      // Store user data
      setUser(response.data.user);
      
      // Store tokens and user data in localStorage
      localStorage.setItem('access_token', response.data.access_token);
      localStorage.setItem('refresh_token', response.data.refresh_token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      return { success: true };
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
      return { success: false, error: err.response?.data?.error || 'Login failed' };
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      setLoading(true);
      await api.post('/logout', {});
      
      // Clear user data and tokens
      setUser(null);
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
      
      return { success: true };
    } catch (err) {
      setError(err.response?.data?.error || 'Logout failed');
      return { success: false, error: err.response?.data?.error || 'Logout failed' };
    } finally {
      setLoading(false);
    }
  };

  // Refresh token function
  const refreshToken = async () => {
    try {
      const refreshTokenValue = localStorage.getItem('refresh_token');
      
      if (!refreshTokenValue) {
        throw new Error('No refresh token available');
      }
      
      // The token will be added by the interceptor
      const response = await api.post('/refresh', {});
      
      // Update tokens in localStorage
      if (response.data.access_token) {
        localStorage.setItem('access_token', response.data.access_token);
      }
      
      return { success: true };
    } catch (err) {
      // If refresh fails, logout the user
      setUser(null);
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
      return { success: false, error: err.response?.data?.error || 'Token refresh failed' };
    }
  };

  // Check if user is authenticated
  const isAuthenticated = () => !!user || !!localStorage.getItem('access_token');

  // Email verification functions removed

  // Context value
  const value = {
    user,
    loading,
    error,
    login,
    logout,
    refreshToken,
    isAuthenticated
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
