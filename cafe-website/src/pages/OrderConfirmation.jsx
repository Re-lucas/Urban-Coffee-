// pages/OrderConfirmation.jsx
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import '../styles/order-confirmation.css';

const OrderConfirmation = () => {
  const { orderId } = useParams();

  return (
    <div className="order-confirmation-page">
      <div className="container">
        <div className="confirmation-card">
          <div className="checkmark">✓</div>
          <h1>订单已确认!</h1>
          <p className="order-id">订单号: #{orderId}</p>
          <p className="message">
            感谢您的购买！您的订单正在处理中，我们将尽快准备您的咖啡。
          </p>
          <div className="next-steps">
            <p>您可以:</p>
            <div className="action-buttons">
              <Link to="/" className="btn home-btn">
                返回首页
              </Link>
              <Link to="/menu" className="btn menu-btn">
                继续购物
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;