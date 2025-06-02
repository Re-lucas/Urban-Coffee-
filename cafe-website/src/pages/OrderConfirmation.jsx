// src/pages/OrderConfirmation.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useOrder } from '../context/OrderContext';
import { useReview } from '../context/ReviewContext'; // 新增导入
import '../styles/order-confirmation.css';

const OrderConfirmation = () => {
  const { orderId } = useParams();
  const { getOrderById } = useOrder();
  const { addReview, getReviewsByProduct } = useReview(); // 新增
  const [order, setOrder] = useState(null);
  
  // 评价相关状态
  const [ratings, setRatings] = useState({});   // 商品评分 {productId: rating}
  const [comments, setComments] = useState({}); // 商品评论 {productId: comment}
  const [hasReviewed, setHasReviewed] = useState(false); // 是否已评价
  const [isSubmitting, setIsSubmitting] = useState(false); // 提交状态

  useEffect(() => {
    const o = getOrderById(orderId);
    setOrder(o || null);

    // 检查订单商品是否已评价
    if (o && o.status === '已完成') {
      const allReviewed = o.items.every(item => {
        const reviews = getReviewsByProduct(item.id);
        return reviews.some(r => r.orderId === o.id);
      });
      setHasReviewed(allReviewed);
    }
  }, [orderId, getOrderById, getReviewsByProduct]);

  if (!order) {
    return <p>正在加载订单详情…</p>;
  }

  // 安全处理金额
  const safeTotalPrice = typeof order.totalPrice === 'number' ? order.totalPrice : 0;
  const safeShippingFee = typeof order.shippingFee === 'number' ? order.shippingFee : 0;
  const safeFinalPrice = 
    typeof order.finalPrice === 'number' 
      ? order.finalPrice 
      : safeTotalPrice + safeShippingFee;

  // 处理评分变化
  const handleRatingChange = (productId, value) => {
    setRatings(prev => ({ ...prev, [productId]: Number(value) }));
  };

  // 处理评论变化
  const handleCommentChange = (productId, text) => {
    setComments(prev => ({ ...prev, [productId]: text }));
  };

  // 提交评价
  const handleSubmitReviews = async () => {
    // 验证所有商品都已评分
    const missingRatingItem = order.items.find(item => !ratings[item.id]);
    if (missingRatingItem) {
      alert(`请为商品 "${missingRatingItem.name}" 选择星级`);
      return;
    }

    setIsSubmitting(true);
    
    try {
      // 为每个商品提交评价
      await Promise.all(order.items.map(item => 
        addReview({
          productId: item.id,
          orderId: order.id,
          rating: ratings[item.id],
          comment: comments[item.id] || ''
        })
      ));
      setHasReviewed(true);
      alert('评价提交成功！感谢您的反馈。');
    } catch (error) {
      alert('评价提交失败，请重试');
      console.error('评价提交错误:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 获取商品的评价信息
  const getProductReview = (productId) => {
    const reviews = getReviewsByProduct(productId);
    return reviews.find(r => r.orderId === order.id);
  };

  return (
    <div className="order-confirmation-page">
      <h1>订单已确认</h1>
      <p>感谢您的购买！您的订单号：</p>
      <h2 className="order-id">{order.id}</h2>
      <p>下单时间：{new Date(order.createTime).toLocaleString()}</p>

      <div className="summary-info">
        <h3>商品列表</h3>
        {order.items.map((item) => (
          <div key={item.id} className="summary-item">
            <span>{item.name} × {item.quantity}</span>
            <span>¥{(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
        <div className="price-detail">
          <span>商品合计：</span>
          <span>¥{safeTotalPrice.toFixed(2)}</span>
        </div>
        <div className="price-detail">
          <span>运费：</span>
          <span>
            {safeShippingFee === 0 
              ? '包邮' 
              : `¥${safeShippingFee.toFixed(2)}`}
          </span>
        </div>
        <div className="price-detail total">
          <span>支付金额：</span>
          <span>¥{safeFinalPrice.toFixed(2)}</span>
        </div>
      </div>

      <div className="order-status">
        <h3>订单状态：</h3>
        <p>{order.status}</p>
      </div>

      {/* 评价区域 */}
      {order.status === '已完成' && !hasReviewed && (
        <div className="review-section">
          <h3>请对商品进行评价</h3>
          {order.items.map((item) => (
            <div key={`review-${item.id}`} className="review-item">
              <div className="review-product">
                <span className="product-name">{item.name}</span>
                <div className="star-rating">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className={`star ${ratings[item.id] >= star ? 'selected' : ''}`}
                      onClick={() => handleRatingChange(item.id, star)}
                      aria-label={`${star}星`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>
              <textarea
                className="review-comment"
                placeholder="分享您的使用体验（可选）"
                value={comments[item.id] || ''}
                onChange={(e) => handleCommentChange(item.id, e.target.value)}
                rows="3"
              />
            </div>
          ))}
          <button 
            className="btn submit-review-btn"
            onClick={handleSubmitReviews}
            disabled={isSubmitting}
          >
            {isSubmitting ? '提交中...' : '提交评价'}
          </button>
        </div>
      )}

      {/* 已评价状态 */}
      {order.status === '已完成' && hasReviewed && (
        <div className="review-summary">
          <h3>您的评价</h3>
          {order.items.map((item) => {
            const review = getProductReview(item.id);
            return (
              <div key={`reviewed-${item.id}`} className="reviewed-item">
                <div className="reviewed-product">
                  <span className="product-name">{item.name}</span>
                  {review ? (
                    <div className="review-details">
                      <div className="review-rating">
                        {'★'.repeat(review.rating)}
                        {'☆'.repeat(5 - review.rating)}
                      </div>
                      {review.comment && (
                        <p className="review-comment">{review.comment}</p>
                      )}
                      <p className="review-date">
                        评价日期: {new Date(review.date).toLocaleDateString()}
                      </p>
                    </div>
                  ) : (
                    <p className="no-review">暂无评价内容</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="order-actions">
        <Link to="/order-history" className="btn history-btn">
          查看我的订单
        </Link>
        <Link to="/" className="btn home-btn">
          返回首页
        </Link>
      </div>
    </div>
  );
};

export default OrderConfirmation;