import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const navigate = useNavigate();
  const [notification, setNotification] = useState({ message: '', type: '' });

  const handleLogin = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      username: formData.get('username'),
      password: formData.get('password'),
    };

    try {
      const response = await axios.post('http://localhost:5000/login', data);
      const { access_token } = response.data;
      localStorage.setItem('token', access_token); // Store token in localStorage
      setNotification({ message: 'Login successful', type: 'success' });
      setTimeout(() => navigate('/'), 1000);
    } catch (error) {
      setNotification({ message: error.response?.data?.error || 'Login failed', type: 'error' });
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col justify-center items-center">
      {notification.message && (
        <div
          className={`notification ${notification.type} p-4 mb-4 text-center rounded-md shadow-md ${
            notification.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}
        >
          {notification.message}
        </div>
      )}

      <div className="w-full max-w-md">
        <h2 className="text-3xl font-semibold mb-6">Log In</h2>
        <form className="space-y-4" onSubmit={handleLogin}>
          <input
            type="text"
            name="username"
            placeholder="username"
            className="w-full border-b border-gray-300 py-2 focus:outline-none"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full border-b border-gray-300 py-2 focus:outline-none"
          />
          <button
            type="submit"
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-md w-full"
          >
            Log In
          </button>
        </form>
        <p className="text-center text-sm mt-4">
          Don't have an account?{' '}
          <Link to="/register" className="text-red-500 hover:underline">Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
