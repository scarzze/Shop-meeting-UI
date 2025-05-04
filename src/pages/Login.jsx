import React from 'react';

const Login = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col justify-between">
      {/* Top Banner */}
      <div className="bg-black text-white text-center text-sm py-2">
        <span>Mid-year Sales for All Laptops And Free Express Delivery - OFF 50%! </span>
        <a href="#" className="underline ml-2">ShopNow</a>
      </div>

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
          <form className="space-y-4">
            <input
              type="text"
              placeholder="Email or Phone Number"
              className="w-full border-b border-gray-300 py-2 focus:outline-none"
            />
            <input
              type="password"
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
