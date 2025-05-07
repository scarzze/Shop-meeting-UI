import React from 'react';
import { FaTrash } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const CartItem = ({ item, onQuantityChange, onRemove }) => {
  // Use item_id for API items or id for local items
  const itemId = item.item_id || item.id;
  
  const handleQuantityChange = (change) => {
    const newQuantity = item.quantity + change;
    // Ensure quantity doesn't go below 1
    if (newQuantity >= 1) {
      onQuantityChange(itemId, newQuantity);
    }
  };

  // Handle missing image
  const productImage = item.image || '/images/placeholder.png';
  
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center py-4">
      {/* Remove Button (X) */}
      <button 
        onClick={() => onRemove(itemId)} 
        className="text-red-500 mr-2 hover:text-red-700 transition"
        aria-label="Remove item"
      >
        <FaTrash size={16} />
      </button>
      
      {/* Product Image */}
      <Link to={`/product/${item.product_id}`} className="w-20 h-20 flex-shrink-0">
        <img 
          src={productImage} 
          alt={item.name} 
          className="w-full h-full object-contain border rounded p-1"
          onError={(e) => {
            e.target.src = '/images/placeholder.png';
            e.target.onerror = null; // Prevent infinite loop
          }}
        />
      </Link>
      
      {/* Product Name */}
      <div className="flex-grow mx-4">
        <Link to={`/product/${item.product_id}`} className="font-medium hover:text-red-500 transition">
          {item.name}
        </Link>
      </div>
      
      {/* Price */}
      <div className="w-24 text-right font-medium">
        KES{parseFloat(item.price).toFixed(2)}
      </div>
      
      {/* Quantity Selector */}
      <div className="w-32 mx-4">
        <div className="flex items-center border rounded overflow-hidden">
          <button 
            className="px-3 py-1 text-lg bg-gray-100 hover:bg-gray-200 transition"
            onClick={() => handleQuantityChange(-1)}
            disabled={item.quantity <= 1}
            aria-label="Decrease quantity"
          >
            -
          </button>
          <span className="px-4 py-1 border-l border-r flex-grow text-center">
            {item.quantity}
          </span>
          <button 
            className="px-3 py-1 text-lg bg-gray-100 hover:bg-gray-200 transition"
            onClick={() => handleQuantityChange(1)}
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
      </div>
      
      {/* Subtotal */}
      <div className="w-24 text-right font-medium">
        KES{(parseFloat(item.price) * item.quantity).toFixed(2)}
      </div>
    </div>
  );
};

export default CartItem;
