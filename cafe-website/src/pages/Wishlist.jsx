// src/pages/Wishlist.jsx
import React from 'react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import '../styles/wishlist.css';

const Wishlist = () => {
  // 这时 useWishlist() 一定会拿到 { wishlist, addToWishlist, removeFromWishlist } 这样的对象
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  // 点击“加入购物车”后，同时从心愿单里移除该商品
  const handleAddAndRemove = (product) => {
    addToCart(product, 1);
    removeFromWishlist(product._id);
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
            <div key={product._id} className="wishlist-item">
              <img
                src={product.image}
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
                  onClick={() => removeFromWishlist(product._id)}
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
