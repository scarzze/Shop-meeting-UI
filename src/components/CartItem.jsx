import React from 'react';
import { FaTrash } from 'react-icons/fa';

const CartItem = ({ item, onQuantityChange, onRemove }) => {
  const handleQuantityChange = (change) => {
    const newQuantity = item.quantity + change;
    if (newQuantity >= 1) {
      onQuantityChange(item.id, newQuantity);
    }
  };

  return (
    <div className="flex items-center py-4 border-b">
      {/* Remove Button (X) */}
      <button 
        onClick={() => onRemove(item.id)} 
        className="text-red-500 mr-2"
      >
        <FaTrash size={16} />
      </button>
      
      {/* Product Image */}
      <div className="w-20 h-20 flex-shrink-0">
        <img 
          src={item.image} 
          alt={item.name} 
          className="w-full h-full object-contain border rounded p-1"
        />
      </div>
      
      {/* Product Name */}
      <div className="flex-grow mx-4">
        <h3 className="font-medium">{item.name}</h3>
      </div>
      
      {/* Price */}
      <div className="w-24 text-right font-medium">
        KES{item.price.toFixed(2)}
      </div>
      
      {/* Quantity Selector */}
      <div className="w-32 mx-4">
        <div className="flex items-center border rounded overflow-hidden">
          <button 
            className="px-3 py-1 text-lg bg-gray-100 hover:bg-gray-200"
            onClick={() => handleQuantityChange(-1)}
          >
            -
          </button>
          <span className="px-4 py-1 border-l border-r flex-grow text-center">
            {item.quantity}
          </span>
          <button 
            className="px-3 py-1 text-lg bg-gray-100 hover:bg-gray-200"
            onClick={() => handleQuantityChange(1)}
          >
            +
          </button>
        </div>
      </div>
      
      {/* Subtotal */}
      <div className="w-24 text-right font-medium">
        KES{(item.price * item.quantity).toFixed(2)}
      </div>
    </div>
  );
};

export default CartItem;
