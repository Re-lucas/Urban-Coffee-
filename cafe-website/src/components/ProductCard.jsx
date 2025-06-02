// src/components/ProductCard.jsx
import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext'; // 新增
import { FaHeart, FaRegHeart } from 'react-icons/fa';       // 心形图标
import '../styles/product-card.css';

const highlightText = (text, query) => {
  if (!query) return text;
  const lowerText = text.toLowerCase();
  const lowerQuery = query.toLowerCase();
  const parts = [];
  let lastIndex = 0;
  let index;
  while ((index = lowerText.indexOf(lowerQuery, lastIndex)) !== -1) {
    parts.push(text.substring(lastIndex, index));
    parts.push(
      <span key={index} className="highlight">
        {text.substring(index, index + query.length)}
      </span>
    );
    lastIndex = index + query.length;
  }
  parts.push(text.substring(lastIndex));
  return parts;
};

const ProductCard = ({ product, searchQuery }) => {
  const { addToCart } = useCart();
  // 1. 从心愿单 Context 中拿到相关方法与数据
  const { wishlist, addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [inWishlist, setInWishlist] = useState(isInWishlist(product.id));

  const [stock, setStock] = useState(product.stock || 10);
  const [isAdding, setIsAdding] = useState(false);

  // 2. 当全局 wishlist 发生变化时，本地同步 inWishlist 状态
  useEffect(() => {
    setInWishlist(isInWishlist(product.id));
  }, [wishlist]);

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

  // 3. 点击心形图标时触发加入/移除心愿单
  const handleWishlistToggle = () => {
    if (inWishlist) {
      removeFromWishlist(product.id);
      toast('已从心愿单移除');
    } else {
      addToWishlist(product);
      toast('已加入心愿单');
    }
  };

  return (
    <div className="product-card">
      <div className="product-info">
        <h3 className="product-name">
          {highlightText(product.name, searchQuery)}
        </h3>
        <p className="description">
          {highlightText(product.description, searchQuery)}
        </p>
        <p className="roast-level">烘焙：{product.roast}</p>
      </div>
      <div className="product-footer">
        <span className="price">¥{product.price.toFixed(2)}</span>
        <div className="action-buttons">
          {/* 收藏/取消收藏 图标 */}
          <button
            className="wishlist-btn"
            onClick={handleWishlistToggle}
            aria-label={inWishlist ? '移除心愿单' : '加入心愿单'}
          >
            {inWishlist ? (
              <FaHeart color="crimson" size={18} />
            ) : (
              <FaRegHeart color="crimson" size={18} />
            )}
          </button>
          {/* 加入购物车 */}
          <button
            onClick={handleAddToCart}
            disabled={stock === 0 || isAdding}
            className={`add-to-cart-btn ${isAdding ? 'adding' : ''}`}
          >
            {stock === 0 ? '已售罄' : isAdding ? '加入中...' : '加入购物车'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
