import { useState, useEffect } from 'react';
import { STORAGE_KEYS } from '../utils/constants';

export const useCart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [appliedDiscount, setAppliedDiscount] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedCart = localStorage.getItem(STORAGE_KEYS.CART_ITEMS);
    const savedDiscount = localStorage.getItem(STORAGE_KEYS.APPLIED_DISCOUNT);
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
    if (savedDiscount) {
      setAppliedDiscount(JSON.parse(savedDiscount));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!loading) {
      localStorage.setItem(STORAGE_KEYS.CART_ITEMS, JSON.stringify(cartItems));
      if (appliedDiscount) {
        localStorage.setItem(STORAGE_KEYS.APPLIED_DISCOUNT, JSON.stringify(appliedDiscount));
      } else {
        localStorage.removeItem(STORAGE_KEYS.APPLIED_DISCOUNT);
      }
    }
  }, [cartItems, appliedDiscount, loading]);

  const addToCart = (product, quantity = 1) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.id === product.id);
      if (existingItem) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { ...product, quantity }];
    });
  };

  const removeFromCart = (productId) => {
    setCartItems(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity < 1) return;
    setCartItems(prev =>
      prev.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
    setAppliedDiscount(null);
  };

  const getCartTotal = () => {
    const subtotal = cartItems.reduce((total, item) => {
      const price = item.discountPercentage
        ? item.price * (1 - item.discountPercentage / 100)
        : item.price;
      return total + price * item.quantity;
    }, 0);

    if (appliedDiscount) {
      return subtotal * (1 - appliedDiscount.percentage / 100);
    }
    return subtotal;
  };

  const setDiscount = (discount) => {
    setAppliedDiscount(discount);
  };

  return {
    cartItems,
    loading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    appliedDiscount,
    setDiscount,
  };
};