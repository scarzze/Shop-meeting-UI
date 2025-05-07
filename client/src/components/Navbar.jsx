import React from 'react';
import { FiShoppingCart, FiHeart, FiUser, FiSearch } from 'react-icons/fi';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeadset } from '@fortawesome/free-solid-svg-icons';

const Navbar = () => {
  return (
    <header className="bg-white border-b sticky top-0 z-50">
      {/* Top banner */}
      <div className="bg-black text-white text-sm text-center py-2">
        Mid-year Sales for All Laptops And Free Express Delivery - OFF 50%!&nbsp;
        <a href="/" className="underline font-semibold hover:text-gray-300">ShopNow</a>
      </div>

      {/* Main navbar */}
      <div className="max-w-7xl mx-auto flex items-center justify-between py-4 px-4">
        <div className="text-2xl font-bold">ShopMeeting</div>

        <nav className="hidden md:flex gap-6 text-gray-700 font-medium">
          <a href="/" className="hover:text-black transition">Home</a>
          <a href="/about" className="hover:text-black transition">About</a>
          <a href="/wishlist" className="hover:text-black transition">Wishlist</a>
          <a href="/register" className="hover:text-black transition">Sign Up</a>
        </nav>

        <div className="flex items-center gap-6">
          {/* Search input */}
          <div className="relative hidden md:block">
            <input
              type="text"
              placeholder="What are you looking for?"
              className="border rounded-full px-4 py-1.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-black transition w-64"
            />
            <FiSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
          </div>

          {/* Icons */}
          <div className="flex gap-4 items-center text-gray-700">
            <a href="/wishlist">
              <FiHeart className="w-5 h-5 cursor-pointer transition-colors duration-200 hover:text-red-500" />
            </a>
            <a href="/cart">
              <FiShoppingCart className="w-5 h-5 cursor-pointer transition-colors duration-200 hover:text-red-500" />
            </a>
            <a href="/profile">
              <FiUser className="w-5 h-5 cursor-pointer transition-colors duration-200 hover:text-red-500" />
            </a>
            <a href="/contact">
              <FontAwesomeIcon icon={faHeadset} className="w-5 h-5 cursor-pointer transition-colors duration-200 hover:text-red-500" />
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
