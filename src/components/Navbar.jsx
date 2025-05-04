import React from 'react';

const Navbar = () => {
  return (
    <header className="bg-white border-b">
      <div className="max-w-6xl mx-auto flex items-center justify-between py-4 px-4">
        <h1 className="text-2xl font-bold">ShopMeeting</h1>
        <nav className="space-x-6 hidden md:block">
          <a href="#" className="text-gray-700 hover:text-black">Home</a>
          <a href="#" className="text-gray-700 hover:text-black">Contact</a>
          <a href="#" className="text-gray-700 hover:text-black">About</a>
          <a href="#" className="text-gray-700 hover:text-black">Sign Up</a>
        </nav>
        <div className="relative">
          <input
            type="text"
            placeholder="What are you looking for?"
            className="border rounded-full px-4 py-1 w-64 text-sm"
          />
          <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</span>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
