import React, { useState } from 'react';
import OrderSummary from '../components/OrderSummary';

const Checkout = () => {
  // Mock data - this will be replaced with database data later
  const [cartItems] = useState([
    {
      id: 1,
      name: 'LCD Monitor',
      price: 650,
      quantity: 1,
      image: 'https://via.placeholder.com/60'
    },
    {
      id: 2,
      name: 'H1 Gamepad',
      price: 1100,
      quantity: 1,
      image: 'https://via.placeholder.com/60'
    }
  ]);

  const [formData, setFormData] = useState({
    firstName: '',
    companyName: '',
    streetAddress: '',
    apartment: '',
    city: '',
    phone: '',
    email: '',
    saveInfo: true,
  });

  const [coupon, setCoupon] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleCouponApply = () => {
    alert(`Coupon "${coupon}" applied!`);
  };

  const handleOrder = (e) => {
    e.preventDefault();
    alert('Order placed successfully!');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-2 gap-12">
      {/* Billing Details */}
      <div>
        <h2 className="text-2xl font-semibold mb-6">Billing Details</h2>
        <form onSubmit={handleOrder} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">First Name*</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 px-4 py-2 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Company Name</label>
            <input
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              className="w-full border border-gray-300 px-4 py-2 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Street Address*</label>
            <input
              type="text"
              name="streetAddress"
              value={formData.streetAddress}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 px-4 py-2 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Apartment, floor, etc. (optional)</label>
            <input
              type="text"
              name="apartment"
              value={formData.apartment}
              onChange={handleChange}
              className="w-full border border-gray-300 px-4 py-2 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Town/City*</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 px-4 py-2 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Phone Number*</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 px-4 py-2 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email Address*</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 px-4 py-2 rounded-md"
            />
          </div>
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              name="saveInfo"
              checked={formData.saveInfo}
              onChange={handleChange}
              className="w-4 h-4 text-red-500"
            />
            <span className="ml-2 text-sm text-gray-700">
              Save this information for faster check-out next time
            </span>
          </label>
        </form>
      </div>

      {/* Order Summary */}
      <div>
        <div className="space-y-4">
          <OrderSummary products={cartItems} />

          {/* Payment Method */}
          <div className="mt-4 space-y-2 bg-gray-100 p-6 rounded-lg">
            <label className="flex items-center">
              <input
                type="radio"
                name="payment"
                value="bank"
                checked={paymentMethod === 'bank'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="mr-2"
              />
              Bank
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="payment"
                value="cash"
                checked={paymentMethod === 'cash'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="mr-2"
              />
              Cash on delivery
            </label>

            {/* Coupon Code */}
            <div className="flex items-center mt-4 space-x-2">
              <input
                type="text"
                placeholder="Coupon Code"
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
                className="flex-grow border border-gray-300 px-4 py-2 rounded-md"
              />
              <button
                type="button"
                onClick={handleCouponApply}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
              >
                Apply Coupon
              </button>
            </div>

            <button
              type="submit"
              onClick={handleOrder}
              className="w-full bg-red-500 text-white py-3 rounded-md mt-6 hover:bg-red-600"
            >
              Place Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
