// components/ProductCard.jsx
import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useCart } from '../context/CartContext';
import '../styles/product-card.css';

/**
 * highlightText:
 *  接受一段字符串 text 和搜索关键词 query，
 *  如果 query 为空，则直接返回原 text（字符串）。
 *  否则，会把 text 按照 query 切分成若干段 React 节点，并用 <span className="highlight">包裹匹配到的文字</span>。
 */
const highlightText = (text, query) => {
  if (!query) return text;       // query 为空、直接返回原始字符串
  const lowerText = text.toLowerCase();
  const lowerQuery = query.toLowerCase();
  const parts = [];
  let lastIndex = 0;
  let index;

  // 循环查找 query 在 text 中的位置
  while ((index = lowerText.indexOf(lowerQuery, lastIndex)) !== -1) {
    // 1) text 中 [lastIndex, index) 这一段没有匹配 query，直接 push 纯文本
    parts.push(text.substring(lastIndex, index));
    // 2) text 中 [index, index + query.length) 就是匹配到的关键词，包裹成 <span className="highlight">
    parts.push(
      <span key={index} className="highlight">
        {text.substring(index, index + query.length)}
      </span>
    );
    lastIndex = index + query.length;
  }
  // 把剩下的尾部文本也 push 进去
  parts.push(text.substring(lastIndex));
  return parts;
};

const ProductCard = ({ product, searchQuery }) => {
  const { addToCart } = useCart();
  const [stock, setStock] = useState(product.stock || 10);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (stock > 0 && Math.random() > 0.7) {
        setStock((prev) => prev - 1);
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [stock]);

  const handleAddToCart = () => {
    setIsAdding(true);
    addToCart(product, 1);
    setTimeout(() => {
      setIsAdding(false);
      toast.success('已加入购物车');
    }, 800);
  };

  return (
    <div className="product-card">
      <div className="product-info">
        {/* 关键：把 product.name 传给 highlightText，让关键词高亮显示 */}
        <h3 className="product-name">
          {highlightText(product.name, searchQuery)}
        </h3>
        <p className="description">
          {highlightText(product.description, searchQuery)}
        </p>
        {/* 例如，你还可以在卡片里展示烘焙程度 */}
        <p className="roast-level">烘焙：{product.roast}</p>
      </div>
      <div className="product-footer">
        <span className="price">¥{product.price.toFixed(2)}</span>
        <button
          onClick={handleAddToCart}
          disabled={stock === 0 || isAdding}
          className={`add-to-cart-btn ${isAdding ? 'adding' : ''}`}
        >
          {stock === 0 ? '已售罄' : isAdding ? '加入中...' : '加入购物车'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
