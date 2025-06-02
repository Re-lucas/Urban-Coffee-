/* src/context/WishlistContext.jsx */
import React, { createContext, useContext, useState, useEffect } from 'react';

// 创建 Context
const WishlistContext = createContext();

// 自定义 Hook，方便在组件中直接 useWishlist()
export const useWishlist = () => useContext(WishlistContext);

// Provider 组件
export function WishlistProvider({ children }) {
  // 1. 从 localStorage 读取已有的心愿单（以 product.id 数组形式存储）
  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem('wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  // 2. 当 wishlist 改变时，同步到 localStorage
  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // 3. 添加到心愿单（如果已存在，就不要重复添加）
  const addToWishlist = (product) => {
    setWishlist((prev) => {
      // 看看 product.id 是否已在列表里
      if (prev.find((p) => p.id === product.id)) {
        return prev; // 不做重复添加
      }
      return [...prev, product];
    });
  };

  // 4. 从心愿单移除
  const removeFromWishlist = (productId) => {
    setWishlist((prev) => prev.filter((p) => p.id !== productId));
  };

  // 5. 判断某个商品是否已在心愿单里
  const isInWishlist = (productId) => {
    return wishlist.some((p) => p.id === productId);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}
