import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
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

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [inCart, setInCart] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);

  // Check if user is authenticated
  const isAuthenticated = () => {
    return localStorage.getItem('token') !== null;
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:5000/products/${id}`);
        
        if (!response.ok) {
          throw new Error('Product not found');
        }
        
        const data = await response.json();

        // Ensure product has an images array
        const updatedImages = data.image_url ? [data.image_url] : ['/images/placeholder.png'];
        data.images = updatedImages;
        
        // Set default rating and reviews if not provided
        if (!data.rating) data.rating = 4;
        if (!data.reviews) data.reviews = 0;
        
        setProduct(data);
        
        // Fetch related products
        fetchRelatedProducts(data.category);
      } catch (error) {
        console.error('Error fetching product details:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchRelatedProducts = async (category) => {
      try {
        const response = await fetch('http://localhost:5000/products');
        const allProducts = await response.json();
        
        // Filter products by category and exclude current product
        const related = allProducts
          .filter(p => p.id !== parseInt(id))
          .slice(0, 4); // Limit to 4 related products
          
        setRelatedProducts(related);
      } catch (error) {
        console.error('Error fetching related products:', error);
      }
    };

    fetchProduct();
  }, [id]);

  const handleQuantityChange = (change) => {
    const newQuantity = selectedQuantity + change;
    if (newQuantity >= 1 && newQuantity <= (product?.stock || 10)) {
      setSelectedQuantity(newQuantity);
    }
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated()) {
      // Redirect to login if not authenticated
      navigate('/login', { state: { from: `/product/${id}` } });
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          product_id: product.id,
          quantity: selectedQuantity
        })
      });
      
      if (response.ok) {
        setInCart(true);
        setTimeout(() => navigate('/cart'), 1000); // Redirect to cart after 1 second
      } else {
        const errorData = await response.json();
        console.error('Error adding to cart:', errorData);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const toggleWishlist = async () => {
    if (!isAuthenticated()) {
      navigate('/login', { state: { from: `/product/${id}` } });
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      const endpoint = isWishlisted ? 
        `http://localhost:5000/wishlist/${product.id}` : 
        'http://localhost:5000/wishlist';
      
      const response = await fetch(endpoint, {
        method: isWishlisted ? 'DELETE' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: isWishlisted ? null : JSON.stringify({ product_id: product.id })
      });
      
      if (response.ok) {
        setIsWishlisted(!isWishlisted);
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
    <div className="p-4 md:p-10">
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
            <span className="text-gray-500 ml-1">({product.reviews || 0} Reviews)</span>
          </div>
          
          <div className="text-lg font-bold text-gray-800 mb-2">
            KES{product.price?.toFixed(2) || '0.00'}
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
      
      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-16">
          <h2 className="text-xl font-bold mb-6 border-b pb-2">You might also like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <ProductCard key={relatedProduct.id} product={relatedProduct} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
