import React, { createContext, useState, useEffect } from 'react';

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

  // Fetch cart items from API
  const fetchCartItems = async () => {
    if (!isAuthenticated()) return;

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/cart', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch cart items');
      }

      const data = await response.json();
      setCartItems(data);
      calculateTotal(data);
    } catch (error) {
      console.error('Error fetching cart items:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Calculate cart total
  const calculateTotal = (items) => {
    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    setCartTotal(total);
  };

  // Add item to cart
  const addToCart = async (item, quantity = 1) => {
    if (!isAuthenticated()) {
      // For non-authenticated users, update local state only
      setCartItems((prevItems) => {
        const existingItem = prevItems.find((cartItem) => cartItem.product_id === item.id);
        if (existingItem) {
          const updatedItems = prevItems.map((cartItem) =>
            cartItem.product_id === item.id
              ? { ...cartItem, quantity: cartItem.quantity + quantity }
              : cartItem
          );
          calculateTotal(updatedItems);
          return updatedItems;
        }
        const newItems = [...prevItems, { 
          item_id: Date.now(), // Temporary ID
          product_id: item.id, 
          name: item.name,
          price: item.price,
          quantity: quantity 
        }];
        calculateTotal(newItems);
        return newItems;
      });
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          product_id: item.id,
          quantity: quantity
        })
      });

      if (!response.ok) {
        throw new Error('Failed to add item to cart');
      }

      // Refresh cart after adding item
      fetchCartItems();
    } catch (error) {
      console.error('Error adding item to cart:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Update cart item quantity
  const updateCartItemQuantity = async (id, quantity) => {
    if (!isAuthenticated()) {
      // For non-authenticated users, update local state only
      setCartItems((prevItems) => {
        const updatedItems = prevItems.map((item) =>
          item.item_id === id ? { ...item, quantity } : item
        );
        calculateTotal(updatedItems);
        return updatedItems;
      });
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/cart/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ quantity })
      });

      if (!response.ok) {
        throw new Error('Failed to update cart item');
      }

      // Refresh cart after updating item
      fetchCartItems();
    } catch (error) {
      console.error('Error updating cart item:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Remove item from cart
  const removeCartItem = async (id) => {
    if (!isAuthenticated()) {
      // For non-authenticated users, update local state only
      setCartItems((prevItems) => {
        const filteredItems = prevItems.filter((item) => item.item_id !== id);
        calculateTotal(filteredItems);
        return filteredItems;
      });
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/cart/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to remove cart item');
      }

      // Refresh cart after removing item
      fetchCartItems();
    } catch (error) {
      console.error('Error removing cart item:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Clear cart
  const clearCart = () => {
    setCartItems([]);
    setCartTotal(0);
  };

  // Fetch cart items when component mounts and when authentication state changes
  useEffect(() => {
    fetchCartItems();
    
    // Listen for login/logout events
    const handleStorageChange = () => {
      fetchCartItems();
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <CartContext.Provider
      value={{ 
        cartItems, 
        cartTotal,
        loading,
        error,
        addToCart, 
        updateCartItemQuantity, 
        removeCartItem,
        clearCart,
        fetchCartItems
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;