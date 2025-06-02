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
    setOrder(o || null);
  }, [orderId, getOrderById]);

  if (!order) {
    return <p>正在加载订单详情…</p>;
  }

  // 安全处理：确保所有金额值都是数字类型
  const safeTotalPrice = typeof order.totalPrice === 'number' ? order.totalPrice : 0;
  const safeShippingFee = typeof order.shippingFee === 'number' ? order.shippingFee : 0;
  const safeFinalPrice = 
    typeof order.finalPrice === 'number' 
      ? order.finalPrice 
      : safeTotalPrice + safeShippingFee;

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
              : `¥${safeShippingFee.toFixed(2)}`
            }
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