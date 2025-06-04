// src/pages/ProductDetail.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import productsData from '../data/products';         // 原始商品列表
import { useReview } from '../context/ReviewContext';
import { useCart } from '../context/CartContext';  // 新增购物车上下文
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import '../styles/product-detail.css';

const ProductDetail = () => {
  const { productId } = useParams();
  const product = productsData.find((p) => p.id.toString() === productId);
  const { getReviewsByProduct } = useReview();
  const { addToCart } = useCart();  // 获取购物车方法

  const [allReviews, setAllReviews] = useState([]);

  useEffect(() => {
    if (product) {
      const reviews = getReviewsByProduct(product.id);
      setAllReviews(reviews);
    }
  }, [product, getReviewsByProduct]);

  if (!product) {
    return <p>未找到该商品。</p>;
  }

  // 计算平均分
  const avgRating =
    allReviews.length > 0
      ? allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length
      : 0;

  const renderStars = (rating) => {
    const stars = [];
    let left = rating;
    for (let i = 0; i < 5; i++) {
      if (left >= 1) {
        stars.push(<FaStar key={i} color="#ffc107" />);
        left -= 1;
      } else if (left >= 0.5) {
        stars.push(<FaStarHalfAlt key={i} color="#ffc107" />);
        left = 0;
      } else {
        stars.push(<FaRegStar key={i} color="#ccc" />);
      }
    }
    return stars;
  };

  return (
    <div className="product-detail-page">
      <h1 className="product-name">{product.name}</h1>
      <div className="detail-top">
        <img 
          src={product.image} 
          alt={product.name} 
          className="product-img" 
          loading="lazy"  // 添加懒加载属性
        />
        <div className="product-info">
          <p className="price">¥{product.price.toFixed(2)}</p>
          <p className="roast">烘焙：{product.roast}</p>
          <p className="desc">{product.description}</p>
          
          {/* 商品状态显示 */}
          <div className="product-status">
            <p>库存: <span className={product.stock <= 0 ? 'out-of-stock' : ''}>
              {product.stock <= 0 ? '无库存' : `${product.stock}件`}
            </span></p>
            <p>状态: <span className={product.isAvailable ? 'available' : 'unavailable'}>
              {product.isAvailable ? '在售中' : '已下架'}
            </span></p>
          </div>

          {/* 加入购物车按钮 */}
          <button
            className="btn add-cart-btn"
            disabled={!product.isAvailable || product.stock === 0}
            onClick={() => addToCart(product, 1)}
          >
            {product.isAvailable && product.stock > 0
              ? '加入购物车'
              : '已下架或无库存'}
          </button>

          {allReviews.length > 0 ? (
            <div className="rating-display">
              {renderStars(avgRating)} <span>({allReviews.length} 条评价)</span>
            </div>
          ) : (
            <p className="no-reviews">暂无评价</p>
          )}
        </div>
      </div>

      <div className="reviews-section">
        <h2>全部评价</h2>
        {allReviews.length === 0 ? (
          <p>暂时还没有人评价哦~</p>
        ) : (
          allReviews.map((rv, idx) => (
            <div key={idx} className="review-item">
              <div className="review-header">
                <div className="stars">{renderStars(rv.rating)}</div>
                <span className="review-date">
                  {new Date(rv.date).toLocaleString()}
                </span>
              </div>
              <p className="review-content">{rv.comment || '（用户未填写文字）'}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProductDetail;