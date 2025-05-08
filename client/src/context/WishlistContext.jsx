import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';
import { AuthContext } from './AuthContext';

export const WishlistContext = createContext();

const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { isAuthenticated, user } = useContext(AuthContext);

  // Fetch wishlist items
  const fetchWishlistItems = useCallback(async () => {
    if (!isAuthenticated) {
      console.log('User not authenticated, returning empty wishlist');
      return [];
    }
    
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/wishlist', {
        method: 'GET',
        credentials: 'include', // Important for cookies to be sent
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          console.log('Authentication failed - session may be invalid or expired');
          return [];
        }
        throw new Error('Failed to fetch wishlist items');
      }

      const data = await response.json();
      setWishlistItems(data);
      return data;
    } catch (error) {
      console.error('Error fetching wishlist items:', error);
      setError(error.message);
      return [];
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Add to wishlist
  const addToWishlist = async (productId) => {
    if (!isAuthenticated) {
      alert('Please login to add items to your wishlist');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/wishlist', {
        method: 'POST',
        credentials: 'include', // Important for cookies to be sent
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ product_id: productId })
      });

      if (!response.ok) {
        throw new Error('Failed to add item to wishlist');
      }

      await fetchWishlistItems();
      return true;
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      setError(error.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Remove from wishlist
  const removeFromWishlist = async (productId) => {
    if (!isAuthenticated) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/wishlist/${productId}`, {
        method: 'DELETE',
        credentials: 'include', // Important for cookies to be sent
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to remove item from wishlist');
      }

      // Update local state optimistically
      setWishlistItems(wishlistItems.filter(item => item.product_id !== productId));
      return true;
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      setError(error.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Check if product is in wishlist
  const isInWishlist = useCallback((productId) => {
    return wishlistItems.some(item => item.product_id === productId);
  }, [wishlistItems]);

  // Move item from wishlist to cart
  const moveToCart = async (productId) => {
    if (!isAuthenticated) {
      return;
    }

    setLoading(true);
    try {
      // First add to cart
      const addToCartResponse = await fetch('http://localhost:5000/cart', {
        method: 'POST',
        credentials: 'include', // Important for cookies to be sent
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ product_id: productId, quantity: 1 })
      });

      if (!addToCartResponse.ok) {
        throw new Error('Failed to add item to cart');
      }

      // Then remove from wishlist
      await removeFromWishlist(productId);
      return true;
    } catch (error) {
      console.error('Error moving item to cart:', error);
      setError(error.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Move all items to cart
  const moveAllToCart = async () => {
    if (!isAuthenticated || wishlistItems.length === 0) {
      return;
    }

    setLoading(true);
    try {
      // Add all items to cart one by one
      for (const item of wishlistItems) {
        await fetch('http://localhost:5000/cart', {
          method: 'POST',
          credentials: 'include', // Important for cookies to be sent
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ product_id: item.product_id, quantity: 1 })
        });
      }

      // Clear wishlist
      setWishlistItems([]);
      return true;
    } catch (error) {
      console.error('Error moving all items to cart:', error);
      setError(error.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Initialize wishlist
  useEffect(() => {
    let isMounted = true;

    const initializeWishlist = async () => {
      if (isMounted) {
        if (isAuthenticated()) {
          await fetchWishlistItems();
        } else {
          // Clear wishlist if not authenticated
          setWishlistItems([]);
        }
      }
    };

    initializeWishlist();

    // Listen for storage events (like token changes)
    const handleStorageChange = (e) => {
      if (e.key === 'token' && isMounted) {
        initializeWishlist();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      isMounted = false;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        loading,
        error,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        moveToCart,
        moveAllToCart,
        fetchWishlistItems
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export default WishlistProvider;
