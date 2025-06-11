// src/pages/OrderDetail.jsx
import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/axiosConfig';
import '../styles/order-detail.css';

const OrderDetail = () => {
  const { id } = useParams(); // 订单ID
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // 调用后端API获取订单详情
        const response = await api.get(`/orders/${id}`);
        setOrder(response.data);
      } catch (err) {
        setError(err.response?.data.message || '获取订单详情失败');
      } finally {
        setLoading(false);
      }
    };

    // 如果用户未登录，重定向到登录页
    if (!user) {
      navigate('/login');
    } else {
      fetchOrder();
    }
  }, [id, user, navigate]);

  // 处理支付按钮点击
  const handlePayNow = () => {
    navigate(`/payment/${id}`);
  };

  if (!user) {
    return null; // 导航中，不需要渲染
  }

  return (
    <div className="order-detail-page">
      <Link to="/order-history" className="back-link">
        &larr; 返回订单历史
      </Link>
      
      <h1>订单详情</h1>
      
      {loading ? (
        <div className="loading-indicator">加载中...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : order ? (
        <div className="order-container">
          <div className="order-section">
            <h2>订单信息</h2>
            <div className="order-info">
              <div>
                <strong>订单号：</strong> {order._id}
              </div>
              <div>
                <strong>下单时间：</strong> 
                {new Date(order.createdAt).toLocaleString()}
              </div>
              <div>
                <strong>订单状态：</strong>
                <span className={`status-badge ${order.status}`}>
                  {order.status}
                </span>
              </div>
              {order.isPaid && (
                <div>
                  <strong>支付时间：</strong> 
                  {new Date(order.paidAt).toLocaleString()}
                </div>
              )}
            </div>
          </div>
          
          <div className="order-section">
            <h2>收货信息</h2>
            <div className="shipping-info">
              <div><strong>姓名：</strong> {order.customerInfo.name}</div>
              <div><strong>邮箱：</strong> {order.customerInfo.email}</div>
              <div><strong>地址：</strong> {order.customerInfo.address}</div>
              <div><strong>城市：</strong> {order.customerInfo.city}</div>
              <div><strong>邮编：</strong> {order.customerInfo.postalCode}</div>
              <div><strong>电话：</strong> {order.customerInfo.phone}</div>
            </div>
          </div>
          
          <div className="order-section">
            <h2>支付信息</h2>
            <div className="payment-info">
              <div>
                <strong>支付方式：</strong> {order.paymentMethod}
              </div>
              <div>
                <strong>支付状态：</strong> 
                {order.isPaid ? (
                  <span className="paid-status">已支付</span>
                ) : (
                  <span className="unpaid-status">未支付</span>
                )}
              </div>
            </div>
          </div>
          
          <div className="order-section">
            <h2>商品清单</h2>
            <div className="order-items">
              {order.items.map((item) => (
                <div key={item._id} className="order-item">
                  <div className="item-info">
                    <div className="item-name">{item.name}</div>
                    <div className="item-quantity">x {item.quantity}</div>
                  </div>
                  <div className="item-price">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="order-section">
            <h2>价格明细</h2>
            <div className="price-summary">
              <div className="price-row">
                <span>商品小计:</span>
                <span>${order.totalPrice.toFixed(2)}</span>
              </div>
              
              <div className="price-row">
                <span>运费:</span>
                <span>
                  {order.shippingFee === 0 
                    ? <span className="free-shipping">免费</span>
                    : `$${order.shippingFee.toFixed(2)}`
                  }
                </span>
              </div>
              
              <div className="price-row">
                <span>税费 (12%):</span>
                <span>${order.tax.toFixed(2)}</span>
              </div>
              
              <div className="price-row grand-total">
                <span>总计:</span>
                <span>${order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
          
          {!order.isPaid && (
            <div className="payment-action">
              <button 
                onClick={handlePayNow}
                className="pay-now-btn"
              >
                立即支付
              </button>
              <p className="payment-notice">
                此订单尚未支付，请点击"立即支付"完成付款
              </p>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
};

export default OrderDetail;