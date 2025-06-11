// src/pages/OrderHistory.jsx
import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/axiosConfig';
import '../styles/order-history.css';

const OrderHistory = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // 调用后端API获取用户订单
        const response = await api.get('/orders/myorders');
        setOrders(response.data);
      } catch (err) {
        setError(err.response?.data.message || '获取订单失败，请重试');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchOrders();
    }
  }, [user]);

  if (!user) {
    return (
      <div className="order-history-page">
        <h1>我的订单</h1>
        <p>请先 <Link to="/login">登录</Link> 后查看订单历史。</p>
      </div>
    );
  }

  return (
    <div className="order-history-page">
      <h1>我的订单</h1>
      
      {loading ? (
        <div className="loading-indicator">加载中...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : orders.length === 0 ? (
        <p>您还没有下过任何订单，快去逛逛吧！</p>
      ) : (
        <div className="history-list">
          {orders.map((order) => {
            // 安全处理价格数据
            const safeTotal = order.total ? order.total.toFixed(2) : '0.00';
            
            return (
              <div key={order._id} className="history-item">
                <div className="order-header">
                  <div>
                    <strong>订单号：</strong> {order._id}
                  </div>
                  <div className="order-status">
                    <span className={`status-badge ${order.status}`}>
                      {order.status}
                    </span>
                  </div>
                </div>
                
                <div className="order-details">
                  <div>
                    <strong>下单时间：</strong>
                    {new Date(order.createdAt).toLocaleString()}
                  </div>
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
                  <div>
                    <strong>总金额：</strong> ${safeTotal}
                  </div>
                </div>
                
                <Link 
                  to={`/order/${order._id}`} 
                  className="btn detail-btn"
                >
                  查看详情
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;