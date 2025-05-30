// components/Cart.jsx
import React, { useState } from 'react';
import { FiShoppingCart, FiX } from 'react-icons/fi';
import '../styles/cart.css';

const Cart = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);

  // 添加到购物车函数
  const addToCart = (product) => {
    setCartItems([...cartItems, product]);
    setIsOpen(true);
  };

  // 从购物车移除
  const removeFromCart = (index) => {
    const newItems = [...cartItems];
    newItems.splice(index, 1);
    setCartItems(newItems);
  };

  // 计算总价
  const totalPrice = cartItems.reduce((sum, item) => sum + item.price, 0);

  return (
    <>
      <div className="cart-icon" onClick={() => setIsOpen(!isOpen)}>
        <FiShoppingCart size={24} />
        {cartItems.length > 0 && <span className="cart-count">{cartItems.length}</span>}
      </div>

      <div className={`cart-panel ${isOpen ? 'open' : ''}`}>
        <div className="cart-header">
          <h3>购物车</h3>
          <button onClick={() => setIsOpen(false)}>
            <FiX size={20} />
          </button>
        </div>
        
        {cartItems.length === 0 ? (
          <p className="empty-cart">购物车是空的</p>
        ) : (
          <>
            <div className="cart-items">
              {cartItems.map((item, index) => (
                <div key={index} className="cart-item">
                  <div>
                    <h4>{item.name}</h4>
                    <p>${item.price}</p>
                  </div>
                  <button onClick={() => removeFromCart(index)}>移除</button>
                </div>
              ))}
            </div>
            <div className="cart-footer">
              <p>总计: <strong>${totalPrice.toFixed(2)}</strong></p>
              <button className="checkout-btn">结算</button>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Cart;