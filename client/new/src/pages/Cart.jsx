import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaTimes } from 'react-icons/fa';
import { useCartContext } from '../context/CartContext';
import toast from 'react-hot-toast';

const DISCOUNT_CODES = {
  'WELCOME10': {
    minAmount: 100,
    percentage: 10,
    description: '10% off on orders above $100'
  }
};

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal } = useCartContext();
  const [discountCode, setDiscountCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(null);
  const navigate = useNavigate();

  const handleDiscountSubmit = (e) => {
    e.preventDefault();
    const discount = DISCOUNT_CODES[discountCode.toUpperCase()];
    
    if (!discount) {
      toast.error('Invalid discount code');
      return;
    }

    if (getCartTotal() < discount.minAmount) {
      toast.error(`This code requires a minimum purchase of $${discount.minAmount}`);
      return;
    }

    setAppliedDiscount(discount);
    toast.success('Discount applied successfully!');
  };

  const calculateDiscount = () => {
    if (!appliedDiscount) return 0;
    return (getCartTotal() * appliedDiscount.percentage) / 100;
  };

  const calculateFinalTotal = () => {
    return getCartTotal() - calculateDiscount();
  };

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-8">Looks like you haven't added any items yet.</p>
          <Link 
            to="/"
            className="inline-block bg-primary text-white px-6 py-3 rounded-md hover:bg-primary-dark"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div 
                key={item.id} 
                className="bg-white rounded-lg shadow-md p-4 flex items-center"
              >
                <img 
                  src={item.image} 
                  alt={item.name}
                  className="w-24 h-24 object-cover rounded-md"
                />
                <div className="flex-1 ml-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-gray-600 text-sm">${item.price.toFixed(2)}</p>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <FaTimes />
                    </button>
                  </div>
                  <div className="flex items-center mt-4">
                    <div className="flex items-center border border-gray-300 rounded-md">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                      >
                        -
                      </button>
                      <span className="px-3 py-1 border-x border-gray-300">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                      >
                        +
                      </button>
                    </div>
                    <span className="ml-auto font-semibold">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${getCartTotal().toFixed(2)}</span>
              </div>

              {/* Discount Code Input */}
              <div className="py-3">
                <form onSubmit={handleDiscountSubmit} className="flex gap-2">
                  <input
                    type="text"
                    value={discountCode}
                    onChange={(e) => setDiscountCode(e.target.value)}
                    placeholder="Enter discount code"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
                  >
                    Apply
                  </button>
                </form>
              </div>

              {appliedDiscount && (
                <div className="flex justify-between text-green-600">
                  <span>Discount ({appliedDiscount.percentage}%)</span>
                  <span>-${calculateDiscount().toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Shipping</span>
                <span>Free</span>
              </div>

              <div className="border-t pt-3">
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span className="text-primary">${calculateFinalTotal().toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={() => navigate('/checkout')}
                className="w-full mt-6 bg-primary text-white py-3 rounded-md hover:bg-primary-dark"
              >
                Proceed to Checkout
              </button>
              <Link
                to="/"
                className="block text-center mt-4 text-gray-600 hover:text-gray-800"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;