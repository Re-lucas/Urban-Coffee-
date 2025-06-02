// src/pages/Wishlist.jsx
import React from 'react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import '../styles/wishlist.css'; // 我们可以在这里单独写一些样式

const Wishlist = () => {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  // 点击“加入购物车”后，同时从心愿单里移除该商品
  const handleAddAndRemove = (product) => {
    addToCart(product, 1);
    removeFromWishlist(product.id);
  };

  return (
    <div className="wishlist-page">
      <h1 className="page-title">我的心愿单</h1>
      {wishlist.length === 0 ? (
        <div className="empty-wishlist">
          <p>心愿单空空如也，快去选购心仪商品吧~</p>
          <button onClick={() => navigate('/menu')} className="btn go-menu-btn">
            去逛逛
          </button>
        </div>
      ) : (
        <div className="wishlist-grid">
          {wishlist.map((product) => (
            <div key={product.id} className="wishlist-item">
              <img
                src={product.image}         /* 假设 product 对象里有 image 字段 */
                alt={product.name}
                className="product-img"
              />
              <div className="item-info">
                <h3>{product.name}</h3>
                <p>¥{product.price.toFixed(2)}</p>
              </div>
              <div className="item-actions">
                <button
                  onClick={() => handleAddAndRemove(product)}
                  className="btn add-btn"
                >
                  加入购物车
                </button>
                <button
                  onClick={() => removeFromWishlist(product.id)}
                  className="btn remove-btn"
                >
                  移除
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
