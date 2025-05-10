import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';
import { AuthContext } from './AuthContext';

export const CartContext = createContext();

const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cartTotal, setCartTotal] = useState(0);
  const { isAuthenticated, user } = useContext(AuthContext);

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
    if (!isAuthenticated) {
      console.log('User not authenticated, returning empty cart');
      return [];
    }
    
    try {      
      const response = await fetch('http://localhost:5000/cart', {
        method: 'GET',
        credentials: 'include', // Important for cookies to be sent
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          console.log('Authentication failed - session may be invalid or expired');
          // Try to refresh the token before giving up
          try {
            const authContext = useContext(AuthContext);
            await authContext.refreshToken();
            
            // Try the request again after refreshing the token
            const retryResponse = await fetch('http://localhost:5000/cart', {
              method: 'GET',
              credentials: 'include',
              headers: {
                'Content-Type': 'application/json'
              }
            });
            
            if (retryResponse.ok) {
              const data = await retryResponse.json();
              return data;
            }
          } catch (refreshError) {
            console.error('Token refresh failed:', refreshError);
          }
          return [];
        }
        throw new Error('Failed to fetch cart items');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching cart items:', error);
      return [];
    }
  };

  // Update cart item quantity with optimistic update
  const updateCartItemQuantity = async (itemId, quantity) => {
    try {
      const response = await fetch(`http://localhost:5000/cart/${itemId}`, {
        method: 'POST',
        credentials: 'include', // Important for cookies to be sent
        headers: {
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
      const response = await fetch('http://localhost:5000/cart', {
        method: 'POST',
        credentials: 'include', // Important for cookies to be sent
        headers: {
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
      if (!isAuthenticated) {
        console.error('User not authenticated');
        throw new Error('Authentication required');
      }
      
      const response = await fetch(`http://localhost:5000/cart/${itemId}`, {
        method: 'DELETE',
        credentials: 'include', // Important for cookies to be sent
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          console.error('Authentication failed - session may be invalid or expired');
          throw new Error('Authentication required. Please log in again.');
        }
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
          if (isAuthenticated) {
            const data = await fetchCartItems();
            setCartItems(data);
            calculateTotal(data);
          } else {
            // Clear cart if not authenticated
            setCartItems([]);
            setCartTotal(0);
          }
        } catch (error) {
          setError(error.message);
        }
      }
    };

    initializeCart();
    
    return () => {
      isMounted = false;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, calculateTotal]);

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