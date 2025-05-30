// pages/Menu.jsx
import React from 'react';
import ProductCard from '../components/ProductCard';
import products from '../data/products';

const Menu = () => {
  return (
    <div className="menu-page">
      <h1 className="page-title">咖啡菜单</h1>
      <div className="container">
        <div className="products-grid">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Menu;