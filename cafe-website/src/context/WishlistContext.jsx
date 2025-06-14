/* src/context/WishlistContext.jsx */
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '@chakra-ui/react';

const WishlistContext = createContext(null);
export const useWishlist = () => {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist 必须在 <WishlistProvider> 组件中使用。');
  return ctx;
};

export function WishlistProvider({ children }) {
  const toast = useToast();
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('wishlistItems');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('解析 localStorage 中的 wishlistItems 失败:', error);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('wishlistItems', JSON.stringify(wishlist));
    } catch (error) {
      console.error('写入 localStorage wishlistItems 失败:', error);
    }
  }, [wishlist]);

  const addToWishlist = product => {
    setWishlist(prev => {
      const exists = prev.find(item => item._id === product._id);
      if (exists) {
        toast({ title: '已在心愿单中', status: 'info', duration: 2000, isClosable: true });
        return prev;
      }
      toast({ title: '已添加到心愿单', description: product.name, status: 'success', duration: 2000, isClosable: true });
      return [product, ...prev];
    });
  };

  const removeFromWishlist = productId => setWishlist(prev => prev.filter(item => item._id !== productId));
  const isInWishlist = productId => wishlist.some(item => item._id === productId);

  return (
    <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}
