// src/context/ProductContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import defaultProducts from '../data/products';

export const ProductContext = createContext();
export const useProduct = () => useContext(ProductContext);

export function ProductProvider({ children }) {
  // 1. 初始：如果 localStorage.products 存在，就 parse 使用；否则使用 data/products.js
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('products');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return defaultProducts;
      }
    }
    return defaultProducts;
  });

  // 2. 每当 products 数组变化，就把它存回 localStorage
  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products));
  }, [products]);

  // 3. 更新单个商品：传入 productId 和一个 updates 对象（例如 { stock: 20, isAvailable: false }）
  const updateProduct = (productId, updates) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, ...updates } : p))
    );
  };

  return (
    <ProductContext.Provider value={{ products, updateProduct }}>
      {children}
    </ProductContext.Provider>
  );
}
