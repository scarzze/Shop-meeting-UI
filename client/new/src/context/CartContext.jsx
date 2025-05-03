import { createContext, useContext } from 'react';
import { useCart } from '../hooks/useCart';
import toast from 'react-hot-toast';

const CartContext = createContext();

export const useCartContext = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const cart = useCart();

  const addToCartWithNotification = (product, quantity) => {
    cart.addToCart(product, quantity);
    toast.success(`Added ${quantity} ${quantity === 1 ? 'item' : 'items'} to cart`);
  };

  const removeFromCartWithNotification = (productId) => {
    cart.removeFromCart(productId);
    toast.success('Item removed from cart');
  };

  const updateQuantityWithNotification = (productId, quantity) => {
    cart.updateQuantity(productId, quantity);
    toast.success('Cart updated');
  };

  const clearCartWithNotification = () => {
    cart.clearCart();
    toast.success('Cart cleared');
  };

  return (
    <CartContext.Provider value={{
      ...cart,
      addToCart: addToCartWithNotification,
      removeFromCart: removeFromCartWithNotification,
      updateQuantity: updateQuantityWithNotification,
      clearCart: clearCartWithNotification,
    }}>
      {children}
    </CartContext.Provider>
  );
};