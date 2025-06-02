// src/components/ProductCard.jsx
import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useReview } from '../context/ReviewContext'; // 新增导入
import { FaHeart, FaRegHeart, FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
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
  const { wishlist, addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { getReviewsByProduct } = useReview(); // 新增
  const [inWishlist, setInWishlist] = useState(isInWishlist(product.id));
  
  const [stock, setStock] = useState(product.stock || 10);
  const [isAdding, setIsAdding] = useState(false);
  
  // 新增：评价相关状态
  const [avgRating, setAvgRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);

  // 当全局 wishlist 发生变化时，同步 inWishlist 状态
  useEffect(() => {
    setInWishlist(isInWishlist(product.id));
  }, [wishlist]);

  // 新增：计算商品的平均评分和评价数量
  useEffect(() => {
    const reviews = getReviewsByProduct(product.id);
    const count = reviews.length;
    
    if (count > 0) {
      const sum = reviews.reduce((total, review) => total + review.rating, 0);
      setAvgRating(sum / count);
    } else {
      setAvgRating(0);
    }
    
    setReviewCount(count);
  }, [getReviewsByProduct, product.id]);

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

  // 点击心形图标时触发加入/移除心愿单
  const handleWishlistToggle = () => {
    if (inWishlist) {
      removeFromWishlist(product.id);
      toast('已从心愿单移除');
    } else {
      addToWishlist(product);
      toast('已加入心愿单');
    }
  };

  // 新增：渲染星级组件
  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(avgRating);
    const hasHalfStar = avgRating % 1 >= 0.5;
    
    // 添加实心星
    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`full-${i}`} className="star full-star" />);
    }
    
    // 添加半星
    if (hasHalfStar) {
      stars.push(<FaStarHalfAlt key="half" className="star half-star" />);
    }
    
    // 添加空心星
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaRegStar key={`empty-${i}`} className="star empty-star" />);
    }
    
    return stars;
  };

  return (
    <div className="product-card">
      <div className="product-info">
        <h3 className="product-name">
          {highlightText(product.name, searchQuery)}
        </h3>
        
        {/* 新增：商品评价信息 */}
        <div className="product-rating">
          <div className="stars-container">
            {renderStars()}
            <span className="rating-value">{avgRating.toFixed(1)}</span>
          </div>
          <span className="review-count">
            {reviewCount > 0 ? `(${reviewCount}条评价)` : '暂无评价'}
          </span>
        </div>
        
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