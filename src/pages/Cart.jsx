import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import CartItem from '../components/CartItem';

const Cart = () => {
  // Dummy cart items data
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: 'LCD Monitor',
      price: 28000,
      image: '/monitor.webp',
      quantity: 1
    },
    {
      id: 2,
      name: 'Hi Gamepad',
      price: 2000,
      image: '/gamepad.jpg',
      quantity: 2
    }
  ]);

  // Calculate subtotal
  const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const shipping = 0; // Free shipping
  const total = subtotal + shipping;

  // Handle quantity change
  const handleQuantityChange = (itemId, newQuantity) => {
    const updatedItems = cartItems.map(item => 
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    );
    setCartItems(updatedItems);
  };

  // Handle item removal
  const handleRemoveItem = (itemId) => {
    const updatedItems = cartItems.filter(item => item.id !== itemId);
    setCartItems(updatedItems);
  };

  // Handle cart update
  const handleUpdateCart = () => {
    // In a real app, you would sync with backend here
    alert('Cart updated!');
  };

  // Apply coupon code
  const [couponCode, setCouponCode] = useState('');
  const handleApplyCoupon = () => {
    // In a real app, you would validate and apply the coupon here
    alert(`Applying coupon: ${couponCode}`);
  };

  return (
    <div className="p-4 md:p-10">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-black">Home</Link> / <span className="text-black font-medium">Cart</span>
      </div>

      {cartItems.length === 0 ? (
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
          <Link to="/" className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div>
          {/* Cart Header */}
          <div className="hidden md:flex border-b pb-2 font-medium">
            <div className="w-6"></div> {/* Remove button space */}
            <div className="w-20"></div> {/* Image space */}
            <div className="flex-grow mx-4">Product</div>
            <div className="w-24 text-right">Price</div>
            <div className="w-32 mx-4 text-center">Quantity</div>
            <div className="w-24 text-right">Subtotal</div>
          </div>

          {/* Cart Items */}
          <div>
            {cartItems.map(item => (
              <CartItem 
                key={item.id} 
                item={item}
                onQuantityChange={handleQuantityChange}
                onRemove={handleRemoveItem}
              />
            ))}
          </div>

          {/* Cart Actions */}
          <div className="flex flex-col md:flex-row justify-between items-start mt-6 gap-4">
            {/* Coupon Section */}
            <div className="flex w-full md:w-auto">
              <input
                type="text"
                placeholder="Coupon Code"
                className="border rounded-l p-2 w-full md:w-64"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
              />
              <button 
                className="bg-red-500 text-white px-4 py-2 rounded-r hover:bg-red-600"
                onClick={handleApplyCoupon}
              >
                Apply Coupon
              </button>
            </div>

            <Link to="/" className="border px-4 py-2 rounded hover:bg-gray-100 w-full md:w-auto text-center">
              Return To Shop
            </Link>

            <button 
              className="border px-4 py-2 rounded hover:bg-gray-100 w-full md:w-auto"
              onClick={handleUpdateCart}
            >
              Update Cart
            </button>
          </div>

          {/* Cart Totals */}
          <div className="mt-12 md:w-96 ml-auto">
            <h2 className="text-xl font-bold mb-4">Cart Total</h2>
            <div className="border rounded p-4">
              <div className="flex justify-between py-3 border-b">
                <span>Subtotal:</span>
                <span className="font-medium">KES{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-3 border-b">
                <span>Shipping:</span>
                <span className="font-medium">{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between py-3">
                <span>Total:</span>
                <span className="font-bold">KES{total.toFixed(2)}</span>
              </div>
              <button className="w-full bg-red-500 text-white mt-4 py-3 rounded hover:bg-red-600">
                Process to checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;