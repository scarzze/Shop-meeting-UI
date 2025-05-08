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

// Reusable Product Card component
const ProductCard = ({ item, isWishlistItem = false, onAction, actionText, actionIcon }) => {
  const { addToCart } = useContext(CartContext);
  
  // Handle image error
  const handleImageError = (e) => {
    e.target.src = '/images/placeholder.png';
    e.target.onerror = null;
  };

  return (
    <div key={item.id || item.product_id} className="relative border p-4 group">
      {/* Badge displays (discount or new) */}
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
      
      {/* Action button (trash for wishlist items, eye for recommended) */}
      <button 
        onClick={() => isWishlistItem && onAction(item)}
        className={`absolute top-2 right-2 text-gray-500 ${isWishlistItem ? 'hover:text-red-500' : 'hover:text-black'} transition`}
      >
        {actionIcon}
      </button>
      
      {/* Product image */}
      <Link to={`/product/${item.product_id || item.id}`}>
        <img 
          src={item.image_url || item.image} 
          alt={item.name} 
          className="mx-auto h-36 object-contain" 
          onError={handleImageError}
        />
      </Link>
      
      {/* Product details */}
      <h3 className="mt-4 font-medium">{item.name}</h3>
      <div className="text-red-600 font-semibold">KES{item.price}</div>
      
      {/* Optional old price */}
      {item.oldPrice && (
        <div className="text-gray-500 line-through text-sm">KES{item.oldPrice}</div>
      )}
      
      {/* Optional rating */}
      {item.rating && (
        <div className="flex items-center gap-1 text-yellow-500 mt-1">
          {'★'.repeat(item.rating)} <span className="text-gray-600 text-sm">({item.rating})</span>
        </div>
      )}
      
      {/* Action button */}
      <button 
        onClick={() => isWishlistItem ? onAction(item) : addToCart(item.id)}
        className="w-full mt-3 bg-black text-white py-2 hover:bg-red-600 transition"
      >
        {actionText}
      </button>
    </div>
  );
};

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

  // Render empty wishlist message
  const renderEmptyWishlist = () => (
    <div className="col-span-full text-center py-8">
      <p className="mb-4">Your wishlist is empty.</p>
      <Link to="/" className="px-4 py-2 bg-black text-white hover:bg-red-600 transition">
        Continue Shopping
      </Link>
    </div>
  );

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
          renderEmptyWishlist()
        ) : (
          wishlistItems.map(item => (
            <ProductCard 
              key={item.product_id}
              item={item} 
              isWishlistItem={true}
              onAction={handleMoveToCart}
              actionText="Move To Cart"
              actionIcon={<Trash2 size={16} onClick={(e) => {
                e.stopPropagation();
                handleRemoveFromWishlist(item);
              }} />}
            />
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
              <ProductCard 
                key={item.id}
                item={item} 
                actionText="Add To Cart"
                actionIcon={<Eye size={16} />}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Wishlist;
