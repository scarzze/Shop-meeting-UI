import React, { createContext, useState, useEffect, useCallback } from 'react';

export const CartContext = createContext();

const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cartTotal, setCartTotal] = useState(0);

  // Check if user is authenticated
  const isAuthenticated = () => {
    return localStorage.getItem('token') !== null;
  };

  // Calculate cart total
  const calculateTotal = useCallback((items) => {
    const total = items.reduce((sum, item) => {
      const price = parseFloat(item.price);
      const quantity = parseInt(item.quantity, 10);
      return sum + (price * quantity);
    }, 0);
    setCartTotal(total);
  }, []);

  // Fetch cart items
  const fetchCartItems = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/cart', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch cart items');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching cart items:', error);
      throw error;
    }
  };

  // Update cart item quantity with optimistic update
  const updateCartItemQuantity = async (itemId, quantity) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/cart/${itemId}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ quantity })
      });

      if (!response.ok) {
        throw new Error('Failed to update cart item');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error updating cart item:', error);
      throw error;
    }
  };

  // Add to cart with optimistic update
  const addToCart = async (productId, quantity = 1) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/cart', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ product_id: productId, quantity })
      });

      if (!response.ok) {
        throw new Error('Failed to add item to cart');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  };

  // Remove cart item with optimistic update
  const removeFromCart = async (itemId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/cart/${itemId}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to remove item from cart');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error removing from cart:', error);
      throw error;
    }
  };

  // Clear cart
  const clearCart = useCallback(() => {
    setCartItems([]);
    setCartTotal(0);
  }, []);

  useEffect(() => {
    let isMounted = true;

    const initializeCart = async () => {
      if (isMounted) {
        try {
          const data = await fetchCartItems();
          setCartItems(data);
          calculateTotal(data);
        } catch (error) {
          setError(error.message);
        }
      }
    };

    initializeCart();

    return () => {
      isMounted = false;
    };
  }, [fetchCartItems, calculateTotal]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartTotal,
        loading,
        error,
        addToCart,
        updateCartItemQuantity,
        removeFromCart,
        clearCart,
        fetchCartItems
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;