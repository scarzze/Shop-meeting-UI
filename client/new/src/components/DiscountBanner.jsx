import { useState } from 'react';
import { FaTimes, FaGift } from 'react-icons/fa';

const DiscountBanner = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-primary text-white py-3 relative">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center">
          <FaGift className="mr-2" />
          <p className="text-sm md:text-base font-medium">
            Special Offer! Get 10% off on orders above $100 - Use code{' '}
            <span className="font-bold">WELCOME10</span>
          </p>
          <button
            onClick={() => setIsVisible(false)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-200"
            aria-label="Close banner"
          >
            <FaTimes />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DiscountBanner;