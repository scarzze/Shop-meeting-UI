import React from 'react';
import { FaHeart } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  const handleProductClick = () => {
    navigate(`/product/${product.id}`);
  };

  return (
    <div 
      className="relative border p-4 rounded-lg shadow-sm hover:shadow-md transition cursor-pointer" 
      onClick={handleProductClick}
    >
      {/* Discount Badge */}
      {product.discount && (
        <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
          -{product.discount}%
        </span>
      )}

      {/* Wishlist Icon */}
      <button className="absolute top-2 right-2 text-gray-500 hover:text-red-500">
        <FaHeart size={18} />
      </button>

      {/* Image */}
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-40 object-contain mb-3"
      />

      {/* Product Info */}
      <div className="text-sm">
        <h3 className="font-medium text-gray-900 mb-1">{product.name}</h3>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-red-500 font-semibold">${product.currentPrice}</span>
          {product.oldPrice && (
            <span className="line-through text-gray-400 text-xs">${product.oldPrice}</span>
          )}
        </div>
        {/* Ratings */}
        <div className="text-yellow-400 text-xs mb-2">
          {'★'.repeat(Math.round(product.rating))} ({product.reviews})
        </div>
        {/* Add to Cart */}
        <button className="w-full bg-black text-white text-sm py-1 rounded hover:bg-red-600 transition">
          {product.inCart ? 'In Cart' : 'Add To Cart'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
