// components/ProductCard.jsx
import React from 'react';
import { toast } from 'react-hot-toast';
import '../styles/product-card.css';

const ProductCard = ({ product }) => {
  const addToCart = () => {
    toast.success(`${product.name} 已加入购物车`);
  };

  return (
    <div className="product-card">
      <div className="product-image">
        {/* 实际项目中替换为真实图片 */}
        <div className="image-placeholder"></div>
      </div>
      <div className="product-details">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-description">{product.description}</p>
        <div className="product-footer">
          <span className="roast-type">{product.roast}</span>
          <span className="product-price">${product.price}</span>
        </div>
        <button className="add-to-cart-btn" onClick={addToCart}>
          加入购物车
        </button>
      </div>
    </div>
  );
};

export default ProductCard;