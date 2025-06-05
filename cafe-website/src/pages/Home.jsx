// pages/Home.jsx
import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/axiosConfig'; // 导入 API 实例
import ProductCard from '../components/ProductCard'; // 导入商品卡片组件
import '../styles/home.css';

const Home = () => {
  const sectionsRef = useRef([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 获取特色商品数据（自动适配后端返回格式）
  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true);
        const { data } = await api.get('/api/products/featured');
        
        // 关键逻辑：兼容两种后端返回格式
        const products = 
          Array.isArray(data) ? data :          // 如果后端直接返回数组
          Array.isArray(data?.products) ? data.products :  // 如果返回 { products: [...] }
          [];                                   // 兜底空数组
        
        setFeaturedProducts(products);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || '获取特色商品失败');
        setLoading(false);
      }
    };
    
    fetchFeaturedProducts();
  }, []);

  // 滚动动画逻辑（保持不变）
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    sectionsRef.current.forEach(section => {
      if (section) observer.observe(section);
    });

    return () => {
      sectionsRef.current.forEach(section => {
        if (section) observer.unobserve(section);
      });
    };
  }, []);

  return (
    <div className="home-page">
      {/* 英雄区域 */}
      <div className="hero-section">
        <div className="hero-content">
          <h1>欢迎来到 Urban Coffee</h1>
          <p>发现精品咖啡的独特风味</p>
          <Link to="/menu" className="cta-button">查看菜单</Link>
        </div>
      </div>
      
      {/* 特色咖啡区域 */}
      <div ref={el => sectionsRef.current[0] = el} className="featured-section fade-in">
        <div className="container">
          <h2 className="section-title">特色咖啡</h2>
          
          {loading ? (
            <div className="loading">加载中...</div>
          ) : error ? (
            <div className="error">{error}</div>
          ) : (
            <div className="featured-grid">
              {featuredProducts.map(product => (
                <div key={product._id} className="featured-item">
                  <div 
                    className="featured-image" 
                    style={{ backgroundImage: `url(${product.image})` }}
                  ></div>
                  <h3>{product.name}</h3>
                  <p>{product.description}</p>
                  <Link to={`/product/${product._id}`} className="featured-link">了解更多</Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* 其他部分保持不变 */}
      {/* 咖啡故事区域 */}
      <div 
        ref={el => sectionsRef.current[1] = el} 
        className="story-section fade-in"
      >
        {/* ... */}
      </div>
      
      {/* 咖啡制作过程 */}
      <div 
        ref={el => sectionsRef.current[2] = el} 
        className="process-section fade-in"
      >
        {/* ... */}
      </div>
      
      {/* 特色饮品推荐 */}
      <div 
        ref={el => sectionsRef.current[3] = el} 
        className="featured-drinks fade-in"
      >
        {/* ... */}
      </div>
      
      {/* 客户评价 */}
      <div 
        ref={el => sectionsRef.current[4] = el} 
        className="testimonials-section fade-in"
      >
        {/* ... */}
      </div>
      
      {/* 咖啡知识博客 */}
      <div 
        ref={el => sectionsRef.current[5] = el} 
        className="blog-preview-section fade-in"
      >
        {/* ... */}
      </div>
      
      {/* 咖啡订阅服务 */}
      <div 
        ref={el => sectionsRef.current[6] = el} 
        className="subscription-section fade-in"
      >
        {/* ... */}
      </div>
      
      {/* 店铺环境展示 */}
      <div 
        ref={el => sectionsRef.current[7] = el} 
        className="gallery-section fade-in"
      >
        {/* ... */}
      </div>
      
      {/* 联系区域 */}
      <div 
        ref={el => sectionsRef.current[8] = el} 
        className="contact-section fade-in"
      >
        {/* ... */}
      </div>
    </div>
  );
};

export default Home;