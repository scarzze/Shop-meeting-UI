import React, { useState } from 'react';
import ProductCard from '../components/ProductCard';

const dummyProduct = {
  id: 1,
  name: 'Havic HV G-92 Gamepad',
  currentPrice: 192.0,
  oldPrice: 250.0,
  discount: 23,
  description:
    'Playstation 5 Controller Skin High quality vinyl with air channel adhesive for easy bubble free install & mess free removal Pressure sensitive.',
  stockStatus: 'In Stock',
  colors: ['#000', '#d33'],
  sizes: ['XS', 'S', 'M', 'L', 'XL'],
  images: [
    '/gamepad-1.jpg',
    '/gamepad-2.jpg',
    '/gamepad-3.jpg',
    '/gamepad-4.jpg',
    '/gamepad-5.jpg',
  ],
  rating: 4,
  reviews: 150,
  inCart: false,
};

const ProductDetail = () => {
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [inCart, setInCart] = useState(false);

  const handleQuantityChange = (change) => {
    const newQuantity = selectedQuantity + change;
    if (newQuantity >= 1) {
      setSelectedQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    setInCart(true);
    // Here you would typically dispatch to your cart state management
  };

  return (
    <div className="p-4 md:p-10">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 mb-4">
        <span className="text-gray-700">Account</span> / Gaming /{' '}
        <span className="text-black font-medium">{dummyProduct.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Image Gallery */}
        <div className="flex gap-4">
          <div className="flex flex-col gap-2 w-20">
            {dummyProduct.images.map((img, i) => (
              <img
                key={i}
                src={img}
                alt={`Thumbnail ${i + 1}`}
                className="w-full h-16 object-contain border p-1 rounded"
              />
            ))}
          </div>
          <img
            src={dummyProduct.images[0]}
            alt="Main product"
            className="w-full h-[400px] object-contain border p-4"
          />
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-2xl font-bold mb-1">{dummyProduct.name}</h1>
          <div className="text-yellow-400 text-sm mb-2">
            {'★'.repeat(Math.round(dummyProduct.rating))}
            <span className="text-gray-500">({dummyProduct.reviews} Reviews)</span>
          </div>
          <div className="text-lg font-bold text-gray-800 mb-2">
            ${dummyProduct.currentPrice.toFixed(2)}
            {dummyProduct.oldPrice && (
              <span className="line-through text-gray-400 text-sm ml-2">
                ${dummyProduct.oldPrice.toFixed(2)}
              </span>
            )}
          </div>
          <p className="text-gray-600 mb-4">{dummyProduct.description}</p>

          {/* Color Selection */}
          <div className="mb-4">
            <label className="text-sm font-medium block mb-1">Colours:</label>
            <div className="flex gap-2">
              {dummyProduct.colors.map((color, i) => (
                <div
                  key={i}
                  className="w-6 h-6 rounded-full border cursor-pointer"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          {/* Size Selection */}
          <div className="mb-4">
            <label className="text-sm font-medium block mb-1">Size:</label>
            <div className="flex gap-2">
              {dummyProduct.sizes.map((size, i) => (
                <button
                  key={i}
                  className="border px-3 py-1 rounded text-sm hover:bg-black hover:text-white"
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity and Buttons */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center border rounded overflow-hidden">
              <button 
                className="px-3 py-1 text-lg"
                onClick={() => handleQuantityChange(-1)}
              >
                -
              </button>
              <span className="px-4 py-1 border-l border-r">{selectedQuantity}</span>
              <button 
                className="px-3 py-1 text-lg"
                onClick={() => handleQuantityChange(1)}
              >
                +
              </button>
            </div>
            <button 
              className={`${inCart ? 'bg-green-500' : 'bg-red-500'} text-white px-6 py-2 rounded hover:opacity-90`}
              onClick={handleAddToCart}
            >
              {inCart ? 'Added to Cart' : 'Buy Now'}
            </button>
            <button className="border px-4 py-2 rounded hover:bg-gray-100">♡</button>
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

      {/* Related Items */}
      <div className="mt-16">
        <h2 className="text-xl font-bold mb-4">Related Items</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((_, i) => (
            <ProductCard
              key={i}
              product={{
                id: i + 2,
                name: 'RGB Keyboard',
                image: '/keyboard.jpg',
                currentPrice: 60,
                oldPrice: 90,
                discount: 35,
                rating: 4,
                reviews: 75,
                inCart: false,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
