import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { FaHeart, FaRegHeart, FaShoppingCart } from 'react-icons/fa';
import { Cloudinary } from '@cloudinary/url-gen';
import { fill } from '@cloudinary/url-gen/actions/resize';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishlistContext';
import { addToRecentlyViewed, getRecentlyViewed } from '../utils/localStorageService';
import API_URL from '../utils/apiConfig';

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

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useContext(AuthContext);
  const { addToCart, isInCart } = useContext(CartContext);
  const { addToWishlist, removeFromWishlist, isInWishlist } = useContext(WishlistContext);
  const [product, setProduct] = useState(null);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [inCart, setInCart] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [notification, setNotification] = useState({ message: '', type: '' });
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);

  // Use a ref to track if the component is mounted
  const isMounted = React.useRef(true);
  
  // Cache for related products to avoid redundant API calls
  const [relatedProductsCache, setRelatedProductsCache] = useState({
    data: null,
    timestamp: null,
    expiryTime: 5 * 60 * 1000 // 5 minutes cache validity
  });

  useEffect(() => {
    // Set isMounted to true when the component mounts
    isMounted.current = true;
    
    // Clean up function to set isMounted to false when the component unmounts
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!isMounted.current) return;
      
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/products/${id}`);
        
        if (!response.ok) {
          throw new Error('Product not found');
        }
        
        const data = await response.json();

        if (!isMounted.current) return;

        // Ensure product has an images array
        const updatedImages = data.image_url ? [data.image_url] : ['/images/placeholder.png'];
        data.images = updatedImages;
        
        // Set default rating and reviews count if not provided
        if (!data.rating) data.rating = 4;
        if (!data.reviews) data.reviews = 0;
        
        setProduct(data);
        
        // Check if product is in cart
        setInCart(isInCart(data.id));
        
        // Add to recently viewed
        addToRecentlyViewed(data);
        
        // Get recently viewed products
        const recentProducts = getRecentlyViewed();
        // Filter out the current product from recently viewed
        setRecentlyViewed(recentProducts.filter(item => item.id !== data.id));
        
        // Check if product is in wishlist
        if (isInWishlist) {
          setIsWishlisted(isInWishlist(data.id));
        }
        
        // Fetch related products (only if needed)
        fetchRelatedProducts(data.category);
        
        // Fetch reviews for this product
        fetchReviews(data.id);
      } catch (error) {
        if (!isMounted.current) return;
        console.error('Error fetching product details:', error);
        setError(error.message);
      } finally {
        if (isMounted.current) {
          setLoading(false);
        }
      }
    };

    const fetchRelatedProducts = async (category) => {
      if (!isMounted.current) return;
      
      // Return cached data if available and not expired
      const now = Date.now();
      if (relatedProductsCache.data && 
          relatedProductsCache.timestamp && 
          (now - relatedProductsCache.timestamp < relatedProductsCache.expiryTime)) {
        console.log('Using cached related products');
        return;
      }
      
      try {
        const response = await fetch(`${API_URL}/products`);
        const allProducts = await response.json();
        
        if (!isMounted.current) return;
        
        // Filter products by category and exclude current product
        const related = allProducts
          .filter(p => p.id !== parseInt(id))
          .slice(0, 4); // Limit to 4 related products
        
        // Update cache
        setRelatedProductsCache({
          data: related,
          timestamp: now,
          expiryTime: 5 * 60 * 1000
        });
        
        setRelatedProducts(related);
      } catch (error) {
        if (!isMounted.current) return;
        console.error('Error fetching related products:', error);
      }
    };
    
    const fetchReviews = async (productId) => {
      if (!isMounted.current) return;
      
      try {
        setReviewsLoading(true);
        const response = await fetch(`${API_URL}/products/${productId}/reviews`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch reviews');
        }
        
        const data = await response.json();
        
        if (!isMounted.current) return;
        
        setReviews(data);
        setReviewsLoading(false);
      } catch (error) {
        if (!isMounted.current) return;
        console.error('Error fetching reviews:', error);
        setReviewsLoading(false);
      }
    };

    fetchProduct();
    
    // Cleanup function
    return () => {
      // This will be called when the component unmounts or when dependencies change
      // We already set isMounted.current = false in the other useEffect
    };
  }, [id, isInCart, isInWishlist]); // Added isInCart to dependencies

  const handleQuantityChange = (change) => {
    const newQuantity = selectedQuantity + change;
    if (newQuantity >= 1 && newQuantity <= (product?.stock || 10)) {
      setSelectedQuantity(newQuantity);
    }
  };

  const handleAddToCart = async () => {
    try {
      // Use the CartContext addToCart function which handles both authenticated and unauthenticated users
      await addToCart(product.id, selectedQuantity, product);
      setInCart(true);
      // Show success notification instead of redirecting
      setNotification({ 
        message: `${product.name} (${selectedQuantity}) added to cart successfully!`, 
        type: 'success' 
      });
      setTimeout(() => setNotification({ message: '', type: '' }), 3000);
    } catch (error) {
      console.error('Error adding to cart:', error);
      setNotification({ 
        message: error.message || 'Failed to add item to cart', 
        type: 'error' 
      });
      setTimeout(() => setNotification({ message: '', type: '' }), 3000);
    }
  };

  const toggleWishlist = async () => {
    try {
      if (isWishlisted) {
        // Remove from wishlist
        await removeFromWishlist(product.id);
        setIsWishlisted(false);
      } else {
        // Add to wishlist
        await addToWishlist(product.id, product);
        setIsWishlisted(true);
      }
    } catch (error) {
      console.error('Error updating wishlist:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 md:p-10 text-center">
        <h2 className="text-2xl font-bold text-red-500 mb-4">Error</h2>
        <p className="mb-4">{error}</p>
        <button 
          onClick={() => navigate('/')} 
          className="bg-black text-white px-6 py-2 rounded hover:bg-red-600"
        >
          Return to Home
        </button>
      </div>
    );
  }

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <div className="p-4 md:p-10 relative">
      {/* Notification */}
      {notification.message && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded shadow-lg ${notification.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {notification.message}
        </div>
      )}
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 mb-4">
        <span className="text-gray-700 cursor-pointer" onClick={() => navigate('/')}>Home</span> / 
        <span className="text-gray-700 cursor-pointer">{product.category || 'Products'}</span> /{' '}
        <span className="text-black font-medium">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Image Gallery */}
        <div className="flex gap-4">
          <div className="flex flex-col gap-2 w-20">
            {product.images.map((img, i) => (
              <img
                key={i}
                src={img}
                alt={`Thumbnail ${i + 1}`}
                className="w-full h-16 object-contain border p-1 rounded cursor-pointer"
                onError={(e) => {
                  e.target.src = '/images/placeholder.png';
                  e.target.onerror = null;
                }}
              />
            ))}
          </div>
          <img
            src={product.images[0]}
            alt="Main product"
            className="w-full h-[400px] object-contain border p-4"
            onError={(e) => {
              e.target.src = '/images/placeholder.png';
              e.target.onerror = null;
            }}
          />
        </div>

        {/* Product Info */}
        <div>
          <div className="flex justify-between items-start">
            <h1 className="text-2xl font-bold mb-1">{product.name}</h1>
            <button 
              onClick={toggleWishlist}
              className="text-2xl"
            >
              {isWishlisted ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
            </button>
          </div>
          
          <div className="text-yellow-400 text-sm mb-2">
            {'★'.repeat(Math.round(product.rating || 0))}
            <span className="text-gray-500 ml-1">({reviews.length || 0} Reviews)</span>
          </div>
          
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg font-bold text-red-500">
              KES{product.price?.toFixed(2) || '0.00'}
            </span>
            {product.oldPrice && (
              <span className="line-through text-gray-500">
                KES{product.oldPrice?.toFixed(2)}
              </span>
            )}
            {product.oldPrice && (
              <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded">
                {Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}% OFF
              </span>
            )}
          </div>
          
          <p className="text-gray-600 mb-4">{product.description || 'No description available'}</p>

          {/* Stock Status */}
          <div className="mb-4">
            <span className="text-sm font-medium">Availability: </span>
            <span className={`text-sm ${product.stock > 0 ? 'text-green-500' : 'text-red-500'}`}>
              {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
            </span>
          </div>

          {/* Quantity and Buttons */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center border rounded overflow-hidden">
              <button 
                className="px-3 py-1 text-lg"
                onClick={() => handleQuantityChange(-1)}
                disabled={product.stock <= 0}
              >
                -
              </button>
              <span className="px-4 py-1 border-l border-r">{selectedQuantity}</span>
              <button 
                className="px-3 py-1 text-lg"
                onClick={() => handleQuantityChange(1)}
                disabled={product.stock <= 0}
              >
                +
              </button>
            </div>
            <button 
              className={`${inCart ? 'bg-green-500' : 'bg-red-500'} text-white px-6 py-2 rounded hover:opacity-90 disabled:bg-gray-400 disabled:cursor-not-allowed`}
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
            >
              {inCart ? 'Added to Cart' : 'Add to Cart'}
            </button>
            <button 
              className="bg-black text-white px-6 py-2 rounded hover:opacity-90 disabled:bg-gray-400 disabled:cursor-not-allowed"
              onClick={() => {
                handleAddToCart();
                setTimeout(() => navigate('/checkout'), 500);
              }}
              disabled={product.stock <= 0}
            >
              Buy Now
            </button>
          </div>

          {/* Delivery Info */}
          <div className="text-sm border p-4 rounded space-y-2">
            <div>
              <strong>Free Delivery</strong> – Enter your postal code for Delivery Availability
            </div>
            <div>
              <strong>Return Delivery</strong> – Free 30 Days Delivery Returns.
            </div>
          </div>
        </div>
      </div>
      
      {/* Recently Viewed Products */}
      {recentlyViewed.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Recently Viewed</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recentlyViewed.slice(0, 4).map(viewedProduct => (
              <ProductCard key={viewedProduct.id} product={viewedProduct} />
            ))}
          </div>
        </div>
      )}
      
      {/* Product Reviews */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-6">Product Reviews ({reviews.length})</h2>
        {reviewsLoading ? (
          <div className="flex justify-center items-center h-24">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-500"></div>
          </div>
        ) : reviews.length > 0 ? (
          <div className="space-y-6">
            {reviews.map((review, index) => (
              <div key={index} className="border p-4 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-medium">{review.username}</h3>
                    <div className="text-yellow-400 text-sm">
                      {'★'.repeat(review.rating)}
                    </div>
                  </div>
                  <span className="text-gray-500 text-sm">
                    {new Date(review.date).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-gray-700">{review.review}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No reviews yet for this product.</p>
        )}
      </div>
      
      {/* Related Products */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-6">Related Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {relatedProducts.map(relatedProduct => (
            <ProductCard key={relatedProduct.id} product={relatedProduct} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
