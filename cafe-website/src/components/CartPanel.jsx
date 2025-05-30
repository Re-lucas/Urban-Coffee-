// components/CartPanel.jsx
import React from 'react';
import { FiX } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import '../styles/cart-panel.css';

const CartPanel = ({ isOpen, onClose }) => {
  const { 
    cartItems, 
    removeFromCart, 
    updateQuantity, 
    totalPrice 
  } = useCart();

  return (
    <div className={`cart-panel ${isOpen ? 'open' : ''}`}>
      <div className="cart-header">
        <h3>购物车</h3>
        <button onClick={onClose}>
          <FiX size={20} />
        </button>
      </div>
      
      {cartItems.length === 0 ? (
        <p className="empty-cart">购物车是空的</p>
      ) : (
        <>
          <div className="cart-items">
            {cartItems.map(item => (
              <div key={item.id} className="cart-item">
                <div className="item-info">
                  <h4>{item.name}</h4>
                  <p>${item.price} x {item.quantity}</p>
                </div>
                <div className="item-actions">
                  <div className="quantity-controls">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                  </div>
                  <button className="remove-btn" onClick={() => removeFromCart(item.id)}>移除</button>
                </div>
              </div>
            ))}
          </div>
          <div className="cart-footer">
            <p className="total-price">总计: <strong>${totalPrice.toFixed(2)}</strong></p>
            <Link to="/checkout" className="checkout-btn" onClick={onClose}>
              结算
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPanel;