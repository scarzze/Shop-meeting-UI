import React, { useEffect } from 'react';
import ProfileForm from '../components/ProfileForm';

const Profile = () => {
  useEffect(() => {
    document.title = 'Profile - Shop Meeting';
  }, []);

  return (
    <div className="min-h-screen bg-white">

      {/* Main Container */}
      <div className="flex flex-col lg:flex-row p-6 lg:p-16 gap-6">
        {/* Sidebar */}
        <aside className="w-full lg:w-1/4 border-r border-gray-200 pr-6">
          <h3 className="text-lg font-semibold mb-4">Manage My Profile</h3>
          <ul className="space-y-2 text-gray-600">
            <li className="text-red-500 font-semibold">My Profile</li>
            <li className="hover:text-black cursor-pointer">Address Book</li>
            <li className="hover:text-black cursor-pointer">My Payment Options</li>
          </ul>
          <h3 className="text-lg font-semibold mt-6 mb-4">My Orders</h3>
          <ul className="space-y-2 text-gray-600">
            <li className="hover:text-black cursor-pointer">My Returns</li>
            <li className="hover:text-black cursor-pointer">My Cancellations</li>
          </ul>
          <h3 className="text-lg font-semibold mt-6 mb-4">My Wishlist</h3>
        </aside>

        {/* Profile Form Section */}
        <section className="w-full lg:w-3/4 bg-gray-50 p-8 rounded-md shadow-sm">
          <h2 className="text-xl font-semibold text-red-500 mb-6">Edit Your Profile</h2>
          <ProfileForm />
        </section>
      </div>
    </div>
  );
};

export default Profile;
