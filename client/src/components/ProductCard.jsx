import React, { useState, useContext, useEffect } from 'react';
import { FaHeart } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { WishlistContext } from '../context/WishlistContext';
import { CartContext } from '../context/CartContext';
import { Cloudinary } from '@cloudinary/url-gen';
import { fill } from '@cloudinary/url-gen/actions/resize';

const cld = new Cloudinary({
  cloud: {
    cloudName: 'dyzqn2sju',
  },
});

const getCloudinaryImageUrl = (publicId, width, height) => {
  // Check if the publicId is already a full URL
  if (publicId && publicId.startsWith('http')) {
    return publicId;
  }
  
  // Otherwise, generate a new URL using Cloudinary
  const image = cld.image(publicId);
  image.resize(fill().width(width).height(height));
  return image.toURL();
};

const ProductCard = ({ product, showPrice = true, showRatings = true }) => {
  const navigate = useNavigate();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useContext(WishlistContext);
  const { addToCart } = useContext(CartContext);
  const [isWishlisted, setIsWishlisted] = useState(false);
  
  // Check if product is in wishlist when component mounts or product changes
  useEffect(() => {
    if (product && product.id) {
      setIsWishlisted(isInWishlist(product.id));
    }
  }, [product, isInWishlist]);

  const handleProductClick = () => {
    navigate(`/product/${product.id}`);
  };

  const handleWishlistClick = async (e) => {
    e.stopPropagation(); // Prevent triggering the card click
    
    try {
      if (isWishlisted) {
        await removeFromWishlist(product.id);
      } else {
        await addToWishlist(product.id);
      }
      // State will be updated via the useEffect when isInWishlist changes
    } catch (error) {
      console.error('Error updating wishlist:', error);
    }
  };

  // Use image_url if available, fallback to image
  const productImage = product.image_url || product.image;
  
  // Calculate discount if both prices are available
  const discount = product.oldPrice && product.currentPrice 
    ? Math.round(((product.oldPrice - product.currentPrice) / product.oldPrice) * 100) 
    : null;

  return (
    <div 
      className="relative border p-4 rounded-lg shadow-sm hover:shadow-md transition cursor-pointer" 
      onClick={handleProductClick}
    >
      {/* Discount Badge */}
      {(product.discount || discount) && (
        <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
          -{product.discount || discount}%
        </span>
      )}

      {/* Wishlist Icon */}
      <button 
        className={`absolute top-2 right-2 ${isWishlisted ? 'text-red-500' : 'text-gray-500'} hover:text-red-500`}
        onClick={handleWishlistClick}
      >
        <FaHeart size={18} />
      </button>

      {/* Image */}
      <img
        src={productImage}
        alt={product.name}
        className="w-full h-40 object-contain mb-3"
        onError={(e) => {
          e.target.src = '/images/placeholder.png'; // Fallback image
          e.target.onerror = null; // Prevent infinite loop
        }}
      />

      {/* Product Info */}
      <div className="text-sm">
        <h3 className="font-medium text-gray-900 mb-1">{product.name}</h3>
        {showPrice && (
          <div className="flex items-center gap-2 mb-1">
            <span className="text-red-500 font-semibold">
              KES{product.currentPrice || product.price}
            </span>
            {product.oldPrice && (
              <span className="line-through text-gray-400 text-xs">KES{product.oldPrice}</span>
            )}
          </div>
        )}
        {showRatings && (
          <div className="text-yellow-400 text-xs mb-2">
            {'★'.repeat(Math.round(product.rating || 4))} 
            ({product.reviews || 0})
          </div>
        )}
        {/* Add to Cart */}
        <button 
          className="w-full bg-black text-white text-sm py-1 rounded hover:bg-red-600 transition"
          onClick={(e) => {
            e.stopPropagation(); // Prevent navigating to product page
            addToCart(product.id);
          }}
        >
          {product.inCart ? 'In Cart' : 'Add To Cart'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
