import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const navigate = useNavigate();
  const [notification, setNotification] = useState({ message: '', type: '' });

  const handleLogin = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      email: formData.get('email'),
      password: formData.get('password'),
    };

    try {
      const response = await axios.post('http://localhost:5001/login', data);
      localStorage.setItem('token', response.data.token);
      setNotification({ message: 'Login successful', type: 'success' });
      setTimeout(() => navigate('/'), 2000); // Redirect after 2 seconds
    } catch (error) {
      setNotification({ message: error.response?.data?.error || 'Login failed', type: 'error' });
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col justify-between">
      {notification.message && (
        <div className={`notification ${notification.type} p-4 mb-4`}>{notification.message}</div>
      )}

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row items-center justify-center p-6 lg:p-16">
        {/* Image Section */}
        <div className="hidden lg:block w-full lg:w-1/2 p-6">
          <img
            src="/shopping-mobile-cart.avif"
            alt="Shopping Visual"
            className="w-full max-w-md mx-auto"
          />
        </div>

        {/* Login Form */}
        <div className="w-full lg:w-1/2 max-w-md">
          <h2 className="text-3xl font-semibold mb-2">Log in to ShopMeeting</h2>
          <p className="text-gray-600 mb-6">Enter your details below</p>
          <form className="space-y-4" onSubmit={handleLogin}>
            <input
              type="text"
              name="email"
              placeholder="Email or Phone Number"
              className="w-full border-b border-gray-300 py-2 focus:outline-none"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="w-full border-b border-gray-300 py-2 focus:outline-none"
            />
            <div className="flex items-center justify-between">
              <button
                type="submit"
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-md"
              >
                Log In
              </button>
              <a href="#" className="text-red-500 hover:underline text-sm">Forget Password?</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
