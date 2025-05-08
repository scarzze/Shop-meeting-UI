import React, { useContext, useEffect } from 'react';
import { Trash2, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishlistContext';

// Recommended items will be static for now, but could be fetched from backend in future
const recommendedItems = [
  {
    id: 1,
    name: 'ASUS FHD Gaming Laptop',
    price: 9600,
    oldPrice: 11600,
    discount: '-35%',
    rating: 5,
    image: '/images/laptop.png'
  },
  {
    id: 2,
    name: 'IPS LCD Gaming Monitor',
    price: 11600,
    rating: 5,
    image: '/images/monitor.png'
  },
  {
    id: 3,
    name: 'HAVIT HV-G92 Gamepad',
    price: 5600,
    isNew: true,
    rating: 5,
    image: '/images/red-gamepad.png'
  },
  {
    id: 4,
    name: 'AK-900 Wired Keyboard',
    price: 2000,
    rating: 5,
    image: '/images/keyboard.png'
  },
];



const Wishlist = () => {
  const { addToCart } = useContext(CartContext);
  const { 
    wishlistItems, 
    loading, 
    error, 
    fetchWishlistItems, 
    removeFromWishlist, 
    moveToCart, 
    moveAllToCart 
  } = useContext(WishlistContext);

  useEffect(() => {
    fetchWishlistItems();
  }, [fetchWishlistItems]);

  const handleMoveToCart = async (item) => {
    const success = await moveToCart(item.product_id);
    if (success) {
      alert(`${item.name} has been moved to the cart.`);
    }
  };

  const handleRemoveFromWishlist = async (item) => {
    const success = await removeFromWishlist(item.product_id);
    if (success) {
      alert(`${item.name} has been removed from your wishlist.`);
    }
  };

  const handleMoveAllToCart = async () => {
    const success = await moveAllToCart();
    if (success) {
      alert('All items have been moved to your cart.');
    }
  };

  return (
    <div className="px-6 md:px-12 py-10 space-y-12">
      {/* Wishlist Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Wishlist ({wishlistItems.length})</h2>
        {wishlistItems.length > 0 && (
          <button 
            onClick={handleMoveAllToCart}
            className="px-4 py-2 border border-black hover:bg-black hover:text-white transition"
          >
            Move All To Bag
          </button>
        )}
      </div>

      {/* Wishlist Items */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {loading ? (
          <div className="col-span-full text-center py-8">Loading wishlist items...</div>
        ) : error ? (
          <div className="col-span-full text-center py-8 text-red-500">{error}</div>
        ) : wishlistItems.length === 0 ? (
          <div className="col-span-full text-center py-8">
            <p className="mb-4">Your wishlist is empty.</p>
            <Link to="/" className="px-4 py-2 bg-black text-white hover:bg-red-600 transition">
              Continue Shopping
            </Link>
          </div>
        ) : (
          wishlistItems.map(item => (
            <div key={item.product_id} className="relative border p-4">
              <button 
                onClick={() => handleRemoveFromWishlist(item)}
                className="absolute top-2 right-2 text-gray-500 hover:text-red-500 transition"
              >
                <Trash2 size={16} />
              </button>
              <Link to={`/product/${item.product_id}`}>
                <img 
                  src={item.image_url} 
                  alt={item.name} 
                  className="mx-auto h-36 object-contain" 
                  onError={(e) => {
                    e.target.src = '/images/placeholder.png';
                    e.target.onerror = null;
                  }}
                />
              </Link>
              <h3 className="mt-4 font-medium">{item.name}</h3>
              <div className="text-red-600 font-semibold">KES{item.price}</div>
              <button 
                className="w-full mt-3 bg-black text-white py-2 hover:bg-red-600 transition"
                onClick={() => handleMoveToCart(item)}
              >
                Move To Cart
              </button>
            </div>
          ))
        )}
      </div>

      {/* Just For You - Only show if wishlist has items */}
      {wishlistItems.length > 0 && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-red-600">Just For You</h2>
            <Link to="/" className="px-4 py-2 border border-black hover:bg-black hover:text-white transition">
              See All
            </Link>
          </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {recommendedItems.map(item => (
            <div key={item.id} className="relative border p-4 group">
              {item.discount && (
                <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                  {item.discount}
                </div>
              )}
              {item.isNew && (
                <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                  NEW
                </div>
              )}
              <button className="absolute top-2 right-2 text-gray-500 hover:text-black transition">
                <Eye size={16} />
              </button>
              <img src={item.image} alt={item.name} className="mx-auto h-36 object-contain" />
              <h3 className="mt-4 font-medium">{item.name}</h3>
              <div className="text-red-600 font-semibold">KES{item.price}</div>
              {item.oldPrice && (
                <div className="text-gray-500 line-through text-sm">KES{item.oldPrice}</div>
              )}
              <div className="flex items-center gap-1 text-yellow-500 mt-1">
                {'★'.repeat(item.rating)} <span className="text-gray-600 text-sm">({item.rating})</span>
              </div>
              <button 
                onClick={() => addToCart(item.id)}
                className="w-full mt-3 bg-black text-white py-2 hover:bg-red-600 transition"
              >
                Add To Cart
              </button>
            </div>
          ))}
        </div>
      </div>
      )}
    </div>
  );
};

export default Wishlist;
