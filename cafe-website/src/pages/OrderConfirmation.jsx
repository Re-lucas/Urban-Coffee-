// src/pages/OrderConfirmation.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useOrder } from '../context/OrderContext';
import '../styles/order-confirmation.css';

const OrderConfirmation = () => {
  const { orderId } = useParams();
  const { getOrderById } = useOrder();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const o = getOrderById(orderId);
    setOrder(o);
  }, [orderId]);

  if (!order) {
    return <p>正在加载订单详情…</p>;
  }

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
          <span>¥{order.totalPrice.toFixed(2)}</span>
        </div>
        <div className="price-detail">
          <span>运费：</span>
          <span>{order.shippingFee === 0 ? '包邮' : `¥${order.shippingFee.toFixed(2)}`}</span>
        </div>
        <div className="price-detail total">
          <span>支付金额：</span>
          <span>¥{order.finalPrice.toFixed(2)}</span>
        </div>
      </div>

      <div className="order-status">
        <h3>订单状态：</h3>
        <p>{order.status}</p>
      </div>

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
