// pages/Checkout.jsx
import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import '../styles/checkout.css';

const Checkout = () => {
  const { cartItems, totalPrice, clearCart } = useCart();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    zip: '',
    phone: ''
  });
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // 这里处理订单提交逻辑
    console.log('提交订单:', { ...formData, items: cartItems, total: totalPrice });
    // 清空购物车
    clearCart();
    // 跳转到成功页面
    alert('订单已提交！');
  };

  return (
    <div className="checkout-page">
      <h1 className="page-title">结算</h1>
      <div className="container">
        <form className="checkout-form" onSubmit={handleSubmit}>
          <div className="form-section">
            <h2>收货信息</h2>
            {/* 表单字段 */}
          </div>
          
          <div className="order-summary">
            <h2>订单摘要</h2>
            <div className="order-items">
              {cartItems.map(item => (
                <div key={item.id} className="order-item">
                  <span>{item.name} x {item.quantity}</span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="order-total">
              <span>总计:</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
          </div>
          
          <button type="submit" className="submit-order">提交订单</button>
        </form>
      </div>
    </div>
  );
};

export default Checkout;