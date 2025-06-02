// pages/Checkout.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useOrder } from '../context/OrderContext';
import '../styles/checkout.css';

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, totalPrice, clearCart } = useCart();
  const { addOrder } = useOrder();
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
  
  // 分级运费计算函数
  const calculateShipping = (subtotal) => {
    if (subtotal >= 200) return 0;     // 满 $200 包邮
    if (subtotal >= 50) return 2;      // $50-$199.99 运费 $2
    return 5;                          // 小于 $50 运费 $5
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
      
      // 生成订单并保存到OrderContext - 已修复参数传递
      const orderId = addOrder({
        customerInfo: formData,
        items: [...cartItems], // ✅ 正确展开购物车数组
        totalPrice: totalPrice, // ✅ 确保传递商品小计
        shippingFee: shippingFee, // ✅ 确保传递运费
        tax: tax,
        total: grandTotal,
        paymentMethod: paymentMethod,
        orderDate: new Date().toISOString()
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
            {/* 表单字段保持不变 */}
          </div>
          
          <div className="payment-section">
            <h2>支付方式</h2>
            {/* 支付方式选择保持不变 */}
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
              <span>商品小计:</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
            
            {/* 运费显示 - 根据金额显示不同文案 */}
            <div className="order-total">
              <span>运费:</span>
              <span>
                {shippingFee === 0 
                  ? <span className="free-shipping">免费</span>
                  : `$${shippingFee.toFixed(2)}`
                }
                {shippingFee > 0 && totalPrice < 50 && (
                  <span className="shipping-note"> (购物满$50运费仅$2)</span>
                )}
                {shippingFee > 0 && totalPrice < 200 && totalPrice >= 50 && (
                  <span className="shipping-note"> (购物满$200免运费)</span>
                )}
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