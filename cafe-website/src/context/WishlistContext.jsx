// src/context/WishlistContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

/**
 * WishlistContext 用来管理"心愿单"的所有操作：
 * - wishlist：当前所有的心愿单商品数组（每个商品对象至少要包含 id、name、price、image 等字段）
 * - addToWishlist(product)：将某个 product 放入心愿单
 * - removeFromWishlist(productId)：从心愿单中移除指定商品
 * - isInWishlist(productId)：检查商品是否已在心愿单中
 */

const WishlistContext = createContext(null);

export const useWishlist = () => {
  const ctx = useContext(WishlistContext);
  if (!ctx) {
    throw new Error('useWishlist 必须在 <WishlistProvider> 组件中使用。');
  }
  return ctx;
};

export function WishlistProvider({ children }) {
  // 1. 从 localStorage 尝试读取已有的心愿单（如果没有则设为空数组）
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('wishlistItems');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('解析 localStorage 中的 wishlistItems 失败:', error);
      return [];
    }
  });

  // 2. 当 wishlist 变化时，同步写回 localStorage
  useEffect(() => {
    try {
      localStorage.setItem('wishlistItems', JSON.stringify(wishlist));
    } catch (error) {
      console.error('写入 localStorage wishlistItems 失败:', error);
    }
  }, [wishlist]);

  /**
   * addToWishlist：把 product 加入心愿单
   * 如果已经存在同 ID 的商品，就不重复添加；否则 push 到数组开头
   */
  const addToWishlist = (product) => {
    setWishlist((prev) => {
      const exists = prev.find((item) => item._id === product._id);
      if (exists) {
        // 如果已经在心愿单里，就直接返回原数组
        return prev;
      }
      // 新商品插在最前面
      return [product, ...prev];
    });
  };

  /**
   * removeFromWishlist：根据 productId 把商品移除
   */
  const removeFromWishlist = (productId) => {
    setWishlist((prev) => prev.filter((item) => item._id !== productId));
  };

  /**
   * isInWishlist：检查某个商品是否已在心愿单中
   * @param {string} productId 商品ID
   * @returns {boolean} 是否在心愿单中
   */
  const isInWishlist = (productId) => {
    return wishlist.some((item) => item._id === productId);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,            // 当前心愿单里的所有商品
        addToWishlist,       // 加入心愿单
        removeFromWishlist,  // 从心愿单移除
        isInWishlist,        // 检查商品是否已在心愿单中
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}