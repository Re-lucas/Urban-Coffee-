// pages/Checkout.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useOrder } from '../context/OrderContext'; // 新增OrderContext导入
import '../styles/checkout.css';

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, totalPrice, clearCart } = useCart();
  const { addOrder } = useOrder(); // 获取addOrder函数
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    city: '温哥华',
    postalCode: '',
    phone: ''
  });
  
  const [paymentMethod, setPaymentMethod] = useState('creditCard');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // 新增：运费计算函数
  const calculateShipping = (subtotal) => {
    if (subtotal >= 200) return 0;
    if (subtotal >= 50) return 2;
    return 5;
  };
  
  const shippingFee = calculateShipping(totalPrice);
  const tax = totalPrice * 0.12;
  const grandTotal = totalPrice + tax + shippingFee;
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // 模拟API请求
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // 生成订单并保存到OrderContext
      const orderId = addOrder({
        customerInfo: formData,
        items: cartItems,
        subtotal: totalPrice,
        shippingFee,
        tax,
        total: grandTotal,
        paymentMethod
      });
      
      // 清空购物车
      clearCart();
      
      // 导航到确认页面，使用实际生成的orderId
      navigate(`/order-confirmation/${orderId}`);
    } catch (error) {
      console.error('订单提交失败:', error);
      alert('订单提交失败，请重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="checkout-page">
      <h1 className="page-title">结算</h1>
      <div className="container">
        <form className="checkout-form" onSubmit={handleSubmit}>
          <div className="form-section">
            <h2>收货信息</h2>
            <div className="form-group">
              <label htmlFor="name">姓名</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="email">邮箱</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="address">地址</label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="city">城市</label>
                <select
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                >
                  <option value="温哥华">温哥华</option>
                  <option value="本拿比">本拿比</option>
                  <option value="列治文">列治文</option>
                  <option value="素里">素里</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="postalCode">邮编</label>
                <input
                  type="text"
                  id="postalCode"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                  pattern="[A-Za-z][0-9][A-Za-z] [0-9][A-Za-z][0-9]"
                  placeholder="例如: V6B 1A1"
                  required
                />
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="phone">电话</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                placeholder="例如: 604-123-4567"
                required
              />
            </div>
          </div>
          
          <div className="payment-section">
            <h2>支付方式</h2>
            <div className="payment-methods">
              <label className={`payment-option ${paymentMethod === 'creditCard' ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="creditCard"
                  checked={paymentMethod === 'creditCard'}
                  onChange={() => setPaymentMethod('creditCard')}
                />
                <div className="payment-content">
                  <span>信用卡/借记卡</span>
                  <div className="card-icons">
                    <span>VISA</span>
                    <span>MasterCard</span>
                  </div>
                </div>
              </label>
              
              <label className={`payment-option ${paymentMethod === 'paypal' ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="paypal"
                  checked={paymentMethod === 'paypal'}
                  onChange={() => setPaymentMethod('paypal')}
                />
                <div className="payment-content">
                  <span>PayPal</span>
                </div>
              </label>
              
              <label className={`payment-option ${paymentMethod === 'cash' ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cash"
                  checked={paymentMethod === 'cash'}
                  onChange={() => setPaymentMethod('cash')}
                />
                <div className="payment-content">
                  <span>到店付款</span>
                </div>
              </label>
            </div>
            
            {paymentMethod === 'creditCard' && (
              <div className="card-details">
                <div className="form-group">
                  <label htmlFor="cardNumber">卡号</label>
                  <input
                    type="text"
                    id="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    pattern="[0-9]{4} [0-9]{4} [0-9]{4} [0-9]{4}"
                    required
                  />
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="expiryDate">有效期</label>
                    <input
                      type="text"
                      id="expiryDate"
                      placeholder="MM/YY"
                      pattern="(0[1-9]|1[0-2])\/[0-9]{2}"
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="cvv">CVV</label>
                    <input
                      type="text"
                      id="cvv"
                      placeholder="123"
                      pattern="[0-9]{3}"
                      required
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="order-summary">
            <h2>订单摘要</h2>
            <div className="order-items">
              {cartItems.map(item => (
                <div key={item.id} className="order-item">
                  <div className="item-info">
                    <span>{item.name}</span>
                    <span>x {item.quantity}</span>
                  </div>
                  <span className="item-price">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            
            <div className="order-total">
              <span>小计:</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
            
            {/* 新增运费显示 */}
            <div className="order-total">
              <span>运费:</span>
              <span>
                {shippingFee === 0 
                  ? '免费' 
                  : `$${shippingFee.toFixed(2)}`
                }
              </span>
            </div>
            
            <div className="order-total">
              <span>税费 (12%):</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            
            <div className="order-total grand-total">
              <span>总计:</span>
              <span>${grandTotal.toFixed(2)}</span>
            </div>
            
            <button 
              type="submit" 
              className="submit-order"
              disabled={isSubmitting || cartItems.length === 0}
            >
              {isSubmitting ? '处理中...' : '提交订单'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;