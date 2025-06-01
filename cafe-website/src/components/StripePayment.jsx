// components/StripePayment.jsx (新建)
import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import '../styles/stripe-payment.css';

const StripePayment = ({ total, onSubmit }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }
    
    setProcessing(true);
    
    try {
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: elements.getElement(CardElement),
      });
      
      if (error) {
        setError(error.message);
        setProcessing(false);
        return;
      }
      
      // 发送支付信息到后端
      const response = await fetch('/api/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          payment_method_id: paymentMethod.id,
          amount: total * 100, // 转换为分
          currency: 'cny',
        }),
      });
      
      const data = await response.json();
      
      if (data.error) {
        setError(data.error);
        setProcessing(false);
        return;
      }
      
      // 支付成功
      onSubmit(data);
    } catch (err) {
      setError('支付处理失败，请重试');
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="stripe-form">
      <div className="form-group">
        <label>信用卡信息</label>
        <CardElement className="stripe-card-element" />
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      <button 
        type="submit" 
        disabled={!stripe || processing}
        className="submit-btn"
      >
        {processing ? '处理中...' : `支付 ¥${total.toFixed(2)}`}
      </button>
    </form>
  );
};

export default StripePayment;