// components/ProductCard.jsx
import React from 'react';
import { toast } from 'react-hot-toast';
import { useCart } from '../context/CartContext'; // 导入购物车钩子
import '../styles/product-card.css';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart(); // 从购物车上下文中获取添加方法

  const handleAddToCart = () => {
    addToCart(product); // 添加商品到购物车
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
        <button className="add-to-cart-btn" onClick={handleAddToCart}>
          加入购物车
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
