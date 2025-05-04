import React, { useState } from 'react';

const ProfileForm = () => {
  const [formData, setFormData] = useState({
    firstName: 'Sam',
    lastName: 'Greenfield',
    email: 'samgreenfields@gmail.com',
    address: 'Nairobi, Kenya',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    // TODO: Add actual save logic
    console.log('Saving changes...', formData);
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <input
          type="text"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          placeholder="First Name"
          className="w-full border border-gray-300 p-2 rounded"
        />
        <input
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          placeholder="Last Name"
          className="w-full border border-gray-300 p-2 rounded"
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          className="w-full border border-gray-300 p-2 rounded"
        />
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="Address"
          className="w-full border border-gray-300 p-2 rounded"
        />
      </div>

      <div>
        <h4 className="text-md font-medium mb-2">Password Changes</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="password"
            name="currentPassword"
            value={formData.currentPassword}
            onChange={handleChange}
            placeholder="Current Password"
            className="w-full border border-gray-300 p-2 rounded"
          />
          <input
            type="password"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            placeholder="New Password"
            className="w-full border border-gray-300 p-2 rounded"
          />
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm New Password"
            className="w-full border border-gray-300 p-2 rounded"
          />
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <button
          type="button"
          className="border border-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-100"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded"
        >
          Save Changes
        </button>
      </div>
    </form>
  );
};

export default ProfileForm;