import React, { useContext } from 'react';
import { Trash2, Eye } from 'lucide-react';
import { CartContext } from '../context/CartContext';

const wishlistItems = [
  {
    id: 1,
    name: 'Gucci duffle bag',
    price: 9600,
    oldPrice: 11600,
    discount: '-35%',
    image: '/images/gucci-bag.png'
  },
  {
    id: 2,
    name: 'RGB liquid CPU Cooler',
    price: 19600,
    image: '/images/cpu-cooler.png'
  },
  {
    id: 3,
    name: 'GP11 Shooter USB Gamepad',
    price: 5500,
    image: '/images/gamepad-black.png'
  },
  {
    id: 4,
    name: 'Quilted Satin Jacket',
    price: 7500,
    image: '/images/satin-jacket.png'
  },
];

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

  const handleMoveToCart = (item) => {
    addToCart(item);
    alert(`${item.name} has been moved to the cart.`);
  };

  return (
    <div className="px-6 md:px-12 py-10 space-y-12">
      {/* Wishlist Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Wishlist ({wishlistItems.length})</h2>
        <button className="px-4 py-2 border border-black hover:bg-black hover:text-white transition">
          Move All To Bag
        </button>
      </div>

      {/* Wishlist Items */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {wishlistItems.map(item => (
          <div key={item.id} className="relative border p-4">
            {item.discount && (
              <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                {item.discount}
              </div>
            )}
            <button className="absolute top-2 right-2 text-gray-500 hover:text-red-500 transition">
              <Trash2 size={16} />
            </button>
            <img src={item.image} alt={item.name} className="mx-auto h-36 object-contain" />
            <h3 className="mt-4 font-medium">{item.name}</h3>
            <div className="text-red-600 font-semibold">KES{item.price}</div>
            {item.oldPrice && (
              <div className="text-gray-500 line-through text-sm">KES{item.oldPrice}</div>
            )}
            <button 
              className="w-full mt-3 bg-black text-white py-2 hover:bg-red-600 transition"
              onClick={() => handleMoveToCart(item)}
            >
              Move To Cart
            </button>
          </div>
        ))}
      </div>

      {/* Just For You */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-red-600">Just For You</h2>
          <button className="px-4 py-2 border border-black hover:bg-black hover:text-white transition">
            See All
          </button>
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
              <button className="w-full mt-3 bg-black text-white py-2 hover:bg-red-600 transition">
                Add To Cart
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
