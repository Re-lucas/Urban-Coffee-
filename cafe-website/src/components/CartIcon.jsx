// components/CartIcon.jsx
import React, { useState } from 'react';
import { FiShoppingCart } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import CartPanel from './CartPanel'; // 接下来创建
import '../styles/cart-icon.css';

const CartIcon = () => {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const { totalItems } = useCart();

  return (
    <>
      <div className="cart-icon" onClick={() => setIsPanelOpen(!isPanelOpen)}>
        <FiShoppingCart size={24} />
        {totalItems > 0 && <span className="cart-count">{totalItems}</span>}
      </div>
      <CartPanel isOpen={isPanelOpen} onClose={() => setIsPanelOpen(false)} />
    </>
  );
};

export default CartIcon;