// pages/Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="home-page">
      <div className="hero-section">
        <div className="hero-content">
          <h1>欢迎来到 Urban Coffee</h1>
          <p>发现精品咖啡的独特风味</p>
          <Link to="/menu" className="cta-button">查看菜单</Link>
        </div>
      </div>
      
      <div className="container">
        <div className="featured-products">
          <h2 className="section-title">特色咖啡</h2>
          {/* 这里可以添加特色产品展示 */}
        </div>
      </div>
    </div>
  );
};

export default Home;