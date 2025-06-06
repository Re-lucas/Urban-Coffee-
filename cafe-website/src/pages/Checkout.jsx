// pages/Checkout.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useOrder } from '../context/OrderContext';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import '../styles/checkout.css';

// 使用环境变量中的Stripe公钥
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

// Stripe支付表单组件
const StripePaymentForm = ({ orderId, grandTotal, onPaymentSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [paymentError, setPaymentError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setPaymentError(null);

    try {
      // 1. 获取支付凭证
      const response = await fetch(`/orders/${orderId}/payintent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('无法获取支付凭证');
      }
      
      const { clientSecret } = await response.json();

      // 2. 确认支付
      const cardElement = elements.getElement(CardElement);
      const { error } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            // 可以添加账单信息
          }
        }
      });

      if (error) {
        setPaymentError(error.message);
      } else {
        // 支付成功
        onPaymentSuccess();
      }
    } catch (err) {
      setPaymentError(err.message || '支付处理失败');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="payment-container">
      <h3>信用卡支付</h3>
      <p>订单总金额: ${grandTotal.toFixed(2)}</p>
      
      <form onSubmit={handleSubmit} className="stripe-form">
        <div className="card-element-container">
          <CardElement 
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
                invalid: {
                  color: '#9e2146',
                },
              },
            }}
          />
        </div>
        
        {paymentError && <div className="payment-error">{paymentError}</div>}
        
        <button 
          type="submit" 
          className="submit-payment"
          disabled={isProcessing || !stripe}
        >
          {isProcessing ? '支付处理中...' : `支付 $${grandTotal.toFixed(2)}`}
        </button>
      </form>
    </div>
  );
};

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
  const [createdOrder, setCreatedOrder] = useState(null); // 存储已创建的订单
  const [orderError, setOrderError] = useState(null);
  
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
  
  // 第一步：提交订单
  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setOrderError(null);
    
    try {
      // 创建订单
      const orderId = await addOrder({
        customerInfo: formData,
        items: [...cartItems],
        totalPrice: totalPrice,
        shippingFee: shippingFee,
        tax: tax,
        total: grandTotal,
        paymentMethod: paymentMethod,
        orderDate: new Date().toISOString(),
        status: 'pending' // 初始状态为待支付
      });
      
      // 保存订单信息，进入支付步骤
      setCreatedOrder({
        id: orderId,
        grandTotal
      });
      
    } catch (error) {
      console.error('订单提交失败:', error);
      setOrderError('订单提交失败，请重试');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // 支付成功后的处理
  const handlePaymentSuccess = () => {
    // 清空购物车
    clearCart();
    // 导航到订单确认页面
    navigate(`/order-confirmation/${createdOrder.id}`);
  };

  // 第二步：支付页面（如果订单已创建）
  if (createdOrder) {
    return (
      <div className="checkout-page">
        <h1 className="page-title">支付订单</h1>
        <div className="container">
          <Elements stripe={stripePromise}>
            <StripePaymentForm 
              orderId={createdOrder.id} 
              grandTotal={createdOrder.grandTotal}
              onPaymentSuccess={handlePaymentSuccess} 
            />
          </Elements>
          
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
            
            <div className="order-total">
              <span>运费:</span>
              <span>
                {shippingFee === 0 
                  ? <span className="free-shipping">免费</span>
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
          </div>
        </div>
      </div>
    );
  }

  // 第一步：填写订单信息
  return (
    <div className="checkout-page">
      <h1 className="page-title">结算</h1>
      <div className="container">
        <form className="checkout-form" onSubmit={handleOrderSubmit}>
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
            
            <div className="form-group-row">
              <div className="form-group">
                <label htmlFor="city">城市</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="postalCode">邮编</label>
                <input
                  type="text"
                  id="postalCode"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
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
                required
              />
            </div>
          </div>
          
          <div className="payment-section">
            <h2>支付方式</h2>
            <div className="payment-methods">
              <label className={paymentMethod === 'creditCard' ? 'active' : ''}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="creditCard"
                  checked={paymentMethod === 'creditCard'}
                  onChange={() => setPaymentMethod('creditCard')}
                />
                信用卡支付
              </label>
              
              <label className={paymentMethod === 'cash' ? 'active' : ''}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cash"
                  checked={paymentMethod === 'cash'}
                  onChange={() => setPaymentMethod('cash')}
                />
                现金到付
              </label>
            </div>
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
            
            {orderError && <div className="order-error">{orderError}</div>}
            
            <button 
              type="submit" 
              className="submit-order"
              disabled={isSubmitting || cartItems.length === 0}
            >
              {isSubmitting ? '提交订单中...' : '提交订单'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;