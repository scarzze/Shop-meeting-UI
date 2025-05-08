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

  // Check if user is authenticated on component mount
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
  }, []);

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
