import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

// Create the auth context
export const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is authenticated on component mount and set up token refresh
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        setLoading(true);
        // Get user profile using the HTTP-only cookie
        const response = await axios.get('http://localhost:5000/profile', {
          withCredentials: true
        });
        setUser(response.data);
      } catch (err) {
        // Clear user state if not authenticated
        setUser(null);
        setError(err.response?.data?.error || 'Authentication failed');
      } finally {
        setLoading(false);
      }
    };

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
  }, [user]); // Added user to dependency array

  // Login function
  const login = async (username, password) => {
    try {
      setLoading(true);
      const response = await axios.post('http://localhost:5000/login', 
        { username, password },
        { withCredentials: true }
      );
      
      setUser(response.data.user);
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
      await axios.post('http://localhost:5000/logout', {}, { withCredentials: true });
      setUser(null);
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
      const response = await axios.post('http://localhost:5000/refresh', {}, { withCredentials: true });
      return { success: true };
    } catch (err) {
      // If refresh fails, logout the user
      setUser(null);
      return { success: false, error: err.response?.data?.error || 'Token refresh failed' };
    }
  };

  // Check if user is authenticated
  const isAuthenticated = () => !!user;

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
