// src/pages/ProductDetail.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useReview } from '../context/ReviewContext';
import { useCart } from '../context/CartContext';
import api from '../utils/axiosConfig'; // 导入 API 实例
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import '../styles/product-detail.css';

const ProductDetail = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { getReviewsByProduct } = useReview();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState(null);
  const [allReviews, setAllReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [qty, setQty] = useState(1);

  // 获取商品详情
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/api/products/${productId}`);
        setProduct(data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || '获取商品详情失败');
        setLoading(false);
      }
    };
    
    fetchProduct();
  }, [productId]);

  // 获取商品评价
  useEffect(() => {
    if (product) {
      const reviews = getReviewsByProduct(product._id);
      setAllReviews(reviews);
    }
  }, [product, getReviewsByProduct]);

  if (loading) {
    return <div className="loading">加载中...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

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

  // 处理加入购物车
  const handleAddToCart = () => {
    addToCart(product, qty);
    navigate('/cart');
  };

  return (
    <div className="product-detail-page">
      <h1 className="product-name">{product.name}</h1>
      <div className="detail-top">
        <img 
          src={product.image} 
          alt={product.name} 
          className="product-img" 
          loading="lazy"
        />
        <div className="product-info">
          <p className="price">¥{product.price.toFixed(2)}</p>
          <p className="roast">烘焙：{product.roast}</p>
          <p className="desc">{product.description}</p>
          
          {/* 商品状态显示 */}
          <div className="product-status">
            <p>库存: <span className={product.countInStock <= 0 ? 'out-of-stock' : ''}>
              {product.countInStock <= 0 ? '无库存' : `${product.countInStock}件`}
            </span></p>
            <p>状态: <span className={product.isAvailable ? 'available' : 'unavailable'}>
              {product.isAvailable ? '在售中' : '已下架'}
            </span></p>
          </div>

          {/* 数量选择器 */}
          {product.countInStock > 0 && (
            <div className="quantity-selector">
              <label>数量：</label>
              <select
                value={qty}
                onChange={(e) => setQty(Number(e.target.value))}
                disabled={product.countInStock === 0}
              >
                {[...Array(Math.min(10, product.countInStock)).keys()].map((x) => (
                  <option key={x + 1} value={x + 1}>
                    {x + 1}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* 加入购物车按钮 */}
          <button
            className="btn add-cart-btn"
            disabled={!product.isAvailable || product.countInStock === 0}
            onClick={handleAddToCart}
          >
            {product.isAvailable && product.countInStock > 0
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