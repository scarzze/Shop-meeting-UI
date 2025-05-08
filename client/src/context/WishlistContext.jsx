import React, { createContext, useState, useEffect, useCallback } from 'react';

export const WishlistContext = createContext();

const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Check if user is authenticated
  const isAuthenticated = () => {
    return localStorage.getItem('token') !== null;
  };

  // Fetch wishlist items
  const fetchWishlistItems = useCallback(async () => {
    if (!isAuthenticated()) {
      return [];
    }
    
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/wishlist', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
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
  }, []);

  // Add to wishlist
  const addToWishlist = async (productId) => {
    if (!isAuthenticated()) {
      alert('Please login to add items to your wishlist');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/wishlist', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
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
    if (!isAuthenticated()) {
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/wishlist/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
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
    if (!isAuthenticated()) {
      return;
    }

    setLoading(true);
    try {
      // First add to cart
      const token = localStorage.getItem('token');
      const addToCartResponse = await fetch('http://localhost:5000/cart', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
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
    if (!isAuthenticated() || wishlistItems.length === 0) {
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      // Add all items to cart one by one
      for (const item of wishlistItems) {
        await fetch('http://localhost:5000/cart', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
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
      if (isMounted && isAuthenticated()) {
        await fetchWishlistItems();
      }
    };

    initializeWishlist();

    return () => {
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
