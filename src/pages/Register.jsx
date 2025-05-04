import React from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';

const Register = () => {
  const handleGoogleSignUp = () => {
    // TODO: Implement actual Google authentication
    console.log('Google sign-up clicked');
  };

  return (
    <div className="min-h-screen bg-white flex flex-col justify-between">
      {/* Banner */}
      <div className="bg-black text-white text-center text-sm py-2">
        <span>Mid-year Sales for All Laptops And Free Express Delivery - OFF 50%! </span>
        <a href="#" className="underline ml-2">ShopNow</a>
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row items-center justify-center p-6 lg:p-16">
        {/* Image Side */}
        <div className="hidden lg:block w-full lg:w-1/2 p-6">
          <img
            src="/shopping-mobile-cart.avif"
            alt="Shopping Visual"
            className="w-full max-w-md mx-auto"
          />
        </div>

        {/* Register Form */}
        <div className="w-full lg:w-1/2 max-w-md">
          <h2 className="text-3xl font-semibold mb-2">Create an Account</h2>
          <p className="text-gray-600 mb-6">Enter your details below</p>
          
          {/* Google Sign Up Button */}
          <button
            onClick={handleGoogleSignUp}
            className="w-full border border-gray-300 py-2 px-4 rounded-md mb-4 flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Sign up with Google
          </button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or</span>
            </div>
          </div>

          <form className="space-y-4">
            <input
              type="text"
              placeholder="Full Name"
              className="w-full border-b border-gray-300 py-2 focus:outline-none"
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full border-b border-gray-300 py-2 focus:outline-none"
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full border-b border-gray-300 py-2 focus:outline-none"
            />
            <button
              type="submit"
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-md w-full"
            >
              Create Account
            </button>
            <p className="text-center text-sm mt-4">
              Already have an account?{' '}
              <Link to="/login" className="text-red-500 hover:underline">Log In</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
