// components/ProductCard.jsx
import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useCart } from '../context/CartContext';
import '../styles/product-card.css';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const [stock, setStock] = useState(product.stock || 10);
  const [isAdding, setIsAdding] = useState(false);
  
  useEffect(() => {
    const interval = setInterval(() => {
      if (stock > 0 && Math.random() > 0.7) {
        setStock(prev => prev - 1);
      }
    }, 10000);
    
    return () => clearInterval(interval);
  }, [stock]);
  
  const handleAddToCart = () => {
    if (stock > 0) {
      setIsAdding(true);
      addToCart(product);
      setStock(prev => prev - 1);
      toast.success(`${product.name} 已加入购物车`);
      
      setTimeout(() => setIsAdding(false), 1000);
    }
  };

  return (
    <div className={`product-card ${stock === 0 ? 'out-of-stock' : ''}`}>
      <div className="product-image">
        {stock < 5 && stock > 0 && (
          <span className="stock-badge">仅剩 {stock} 份</span>
        )}
        {stock === 0 && (
          <span className="stock-badge">补货中</span>
        )}
        <div className="image-placeholder"></div>
      </div>
      
      <div className="product-info">
        <h3>{product.name}</h3>
        <p>{product.description}</p>
        <div className="price-row">
          <span className="price">¥{product.price}</span>
          <button 
            onClick={handleAddToCart}
            disabled={stock === 0 || isAdding}
            className={`add-to-cart-btn ${isAdding ? 'adding' : ''}`}
          >
            {stock === 0 ? '已售罄' : (isAdding ? '加入中...' : '加入购物车')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;