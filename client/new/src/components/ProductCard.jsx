import { Link } from 'react-router-dom';
import { FaHeart, FaShoppingCart } from 'react-icons/fa';
import { useCartContext } from '../context/CartContext';
import { imageDefaults } from '../utils/constants';

const ProductCard = ({ product }) => {
  const { addToCart } = useCartContext();
  const {
    id,
    name,
    price,
    image,
    description,
    discountPercentage,
  } = product;

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(product, 1);
  };

  const handleAddToWishlist = (e) => {
    e.preventDefault();
    // TODO: Implement wishlist functionality
  };

  return (
    <Link 
      to={`/product/${id}`}
      className="group block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
    >
      <div className="relative">
        <img
          src={image || imageDefaults.PLACEHOLDER_IMAGE}
          alt={name}
          className="w-full h-48 object-cover"
        />
        <button
          onClick={handleAddToWishlist}
          className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
        >
          <FaHeart className="text-gray-400 group-hover:text-red-500" />
        </button>
        {discountPercentage > 0 && (
          <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-md text-sm">
            {discountPercentage}% OFF
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{name}</h3>
        <p className="text-gray-600 text-sm mb-2 line-clamp-2">{description}</p>
        
        <div className="flex items-center justify-between mt-4">
          <div>
            {discountPercentage > 0 ? (
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-primary">
                  ${(price * (1 - discountPercentage / 100)).toFixed(2)}
                </span>
                <span className="text-sm text-gray-400 line-through">
                  ${price.toFixed(2)}
                </span>
              </div>
            ) : (
              <span className="text-lg font-bold text-primary">
                ${price.toFixed(2)}
              </span>
            )}
          </div>
          
          <button
            onClick={handleAddToCart}
            className="p-2 bg-primary text-white rounded-full hover:bg-primary-dark transition-colors"
          >
            <FaShoppingCart className="text-lg" />
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;