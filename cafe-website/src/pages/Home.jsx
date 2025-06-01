// pages/Home.jsx
import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import '../styles/home.css';

const Home = () => {
  const sectionsRef = useRef([]);

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
      <div 
        ref={el => sectionsRef.current[0] = el} 
        className="featured-section fade-in"
      >
        <div className="container">
          <h2 className="section-title">特色咖啡</h2>
          <div className="featured-grid">
            <div className="featured-item">
              <div className="featured-image ethiopian"></div>
              <h3>埃塞俄比亚耶加雪菲</h3>
              <p>柑橘与茉莉花香调，浅烘焙的经典之作，带有明亮的酸度和花香尾韵</p>
              <Link to="/menu" className="featured-link">了解更多</Link>
            </div>
            
            <div className="featured-item">
              <div className="featured-image colombian"></div>
              <h3>哥伦比亚苏帕摩</h3>
              <p>坚果与巧克力风味的完美平衡，中烘焙带来顺滑口感和可可香气</p>
              <Link to="/menu" className="featured-link">了解更多</Link>
            </div>
            
            <div className="featured-item">
              <div className="featured-image brazilian"></div>
              <h3>巴西山度士</h3>
              <p>浓郁的焦糖与巧克力风味，深烘焙带来醇厚口感和悠长余韵</p>
              <Link to="/menu" className="featured-link">了解更多</Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* 咖啡故事区域 */}
      <div 
        ref={el => sectionsRef.current[1] = el} 
        className="story-section fade-in"
      >
        <div className="container">
          <div className="story-content">
            <div className="story-text">
              <h2 className="section-title">我们的咖啡故事</h2>
              <p>
                自2010年创立以来，Urban Coffee 一直致力于为咖啡爱好者提供最优质的咖啡体验。
                我们精选世界各地最优质的咖啡豆，由专业烘焙师精心烘焙，确保每一杯咖啡都能带给您独特的味蕾享受。
              </p>
              <p>
                我们的咖啡师团队经过严格培训，精通各种冲泡技术，从经典意式浓缩到手冲精品咖啡，
                都能为您完美呈现。每一杯咖啡都是我们对品质的承诺。
              </p>
              <Link to="/about" className="cta-button secondary">了解更多</Link>
            </div>
            <div className="story-image"></div>
          </div>
        </div>
      </div>
      
      {/* 咖啡制作过程 */}
      <div 
        ref={el => sectionsRef.current[2] = el} 
        className="process-section fade-in"
      >
        <div className="container">
          <h2 className="section-title">我们的咖啡制作过程</h2>
          <div className="process-steps">
            <div className="process-step">
              <div className="step-number">1</div>
              <h3>精选咖啡豆</h3>
              <p>直接从产地挑选最优质的咖啡豆，确保源头品质</p>
            </div>
            
            <div className="process-step">
              <div className="step-number">2</div>
              <h3>专业烘焙</h3>
              <p>根据每种豆子的特性定制烘焙曲线，释放最佳风味</p>
            </div>
            
            <div className="process-step">
              <div className="step-number">3</div>
              <h3>精心研磨</h3>
              <p>现点现磨，保证咖啡新鲜度和最佳萃取效果</p>
            </div>
            
            <div className="process-step">
              <div className="step-number">4</div>
              <h3>完美冲泡</h3>
              <p>由专业咖啡师精心制作，确保每杯品质一致</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* 特色饮品推荐 */}
      <div 
        ref={el => sectionsRef.current[3] = el} 
        className="featured-drinks fade-in"
      >
        <div className="container">
          <h2 className="section-title">特色饮品推荐</h2>
          <div className="drinks-grid">
            <div className="drink-item">
              <div className="drink-image latte"></div>
              <div className="drink-info">
                <h3>海盐焦糖拿铁</h3>
                <p>浓缩咖啡与丝滑牛奶的完美结合，顶部撒上海盐焦糖碎片</p>
                <span className="price">¥38</span>
              </div>
            </div>
            
            <div className="drink-item">
              <div className="drink-image coldbrew"></div>
              <div className="drink-info">
                <h3>氮气冷萃咖啡</h3>
                <p>16小时慢速冷萃，注入氮气带来奶油般绵密口感</p>
                <span className="price">¥42</span>
              </div>
            </div>
            
            <div className="drink-item">
              <div className="drink-image matcha"></div>
              <div className="drink-info">
                <h3>宇治抹茶拿铁</h3>
                <p>日本进口宇治抹茶粉，搭配丝滑牛奶，清新回甘</p>
                <span className="price">¥36</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* 客户评价 */}
      <div 
        ref={el => sectionsRef.current[4] = el} 
        className="testimonials-section fade-in"
      >
        <div className="container">
          <h2 className="section-title">顾客评价</h2>
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="rating">★★★★★</div>
              <p>"Urban Coffee 的耶加雪菲是我喝过最好的，柑橘香气令人难忘！每次来都有新的发现。"</p>
              <div className="customer">
                <div className="avatar"></div>
                <div className="customer-info">
                  <strong>张明</strong>
                  <span>老顾客</span>
                </div>
              </div>
            </div>
            
            <div className="testimonial-card">
              <div className="rating">★★★★★</div>
              <p>"温馨的环境，专业的咖啡师，咖啡品质一流。已经成为我每天必来的地方！"</p>
              <div className="customer">
                <div className="avatar"></div>
                <div className="customer-info">
                  <strong>李华</strong>
                  <span>咖啡爱好者</span>
                </div>
              </div>
            </div>
            
            <div className="testimonial-card">
              <div className="rating">★★★★☆</div>
              <p>"巴西山度士的巧克力风味很突出，搭配甜点绝配！服务也很周到。"</p>
              <div className="customer">
                <div className="avatar"></div>
                <div className="customer-info">
                  <strong>王芳</strong>
                  <span>美食博主</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* 咖啡知识博客 */}
      <div 
        ref={el => sectionsRef.current[5] = el} 
        className="blog-preview-section fade-in"
      >
        <div className="container">
          <div className="blog-preview-header">
            <h2 className="section-title">咖啡知识</h2>
            <Link to="/blog" className="view-all">查看全部</Link>
          </div>
          
          <div className="blog-posts">
            <div className="blog-post">
              <div className="post-image coffee-roasting"></div>
              <div className="post-content">
                <h3>咖啡烘焙的艺术</h3>
                <p className="post-date">2025年5月15日</p>
                <p>探索从浅焙到深焙如何影响咖啡的风味特征，以及烘焙过程中的化学变化...</p>
                <Link to="/blog" className="read-more">阅读更多</Link>
              </div>
            </div>
            
            <div className="blog-post">
              <div className="post-image brewing-tips"></div>
              <div className="post-content">
                <h3>手冲咖啡技巧指南</h3>
                <p className="post-date">2025年4月28日</p>
                <p>掌握完美手冲咖啡的五个关键步骤，包括水温控制、注水技巧和研磨度选择...</p>
                <Link to="/blog" className="read-more">阅读更多</Link>
              </div>
            </div>
            
            <div className="blog-post">
              <div className="post-image origin"></div>
              <div className="post-content">
                <h3>探索咖啡的起源地</h3>
                <p className="post-date">2025年4月18日</p>
                <p>从埃塞俄比亚高原到哥伦比亚安第斯山脉，了解世界著名咖啡产区的特色...</p>
                <Link to="/blog" className="read-more">阅读更多</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* 咖啡订阅服务 */}
      <div 
        ref={el => sectionsRef.current[6] = el} 
        className="subscription-section fade-in"
      >
        <div className="container">
          <div className="subscription-content">
            <div className="subscription-image"></div>
            <div className="subscription-info">
              <h2>咖啡订阅服务</h2>
              <p>每月品尝不同产地的精品咖啡豆，足不出户享受全球咖啡之旅</p>
              <ul className="benefits">
                <li>每月2款精选咖啡豆（共500g）</li>
                <li>专业烘焙，新鲜直达</li>
                <li>冲泡指南和风味笔记</li>
                <li>专属会员折扣</li>
              </ul>
              <div className="pricing">
                <span className="price">¥198/月</span>
                <Link to="/subscribe" className="cta-button">立即订阅</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* 店铺环境展示 */}
      <div 
        ref={el => sectionsRef.current[7] = el} 
        className="gallery-section fade-in"
      >
        <div className="container">
          <h2 className="section-title">店铺环境</h2>
          <div className="gallery-grid">
            <div className="gallery-item shop1"></div>
            <div className="gallery-item shop2"></div>
            <div className="gallery-item shop3"></div>
            <div className="gallery-item shop4"></div>
          </div>
        </div>
      </div>
      
      {/* 联系区域 */}
      <div 
        ref={el => sectionsRef.current[8] = el} 
        className="contact-section fade-in"
      >
        <div className="container">
          <div className="contact-content">
            <div className="contact-info">
              <h2>来店体验</h2>
              <p>我们期待您的光临，品尝我们精心制作的咖啡</p>
              
              <div className="contact-details">
                <p><strong>地址：</strong>温哥华市中心咖啡街123号</p>
                <p><strong>电话：</strong>(604) 123-4567</p>
                <p><strong>营业时间：</strong></p>
                <p>周一至周五：7:00 - 20:00</p>
                <p>周末及节假日：8:00 - 22:00</p>
              </div>
              
              <Link to="/contact" className="cta-button">联系我们</Link>
            </div>
            
            <div className="map-placeholder">
              <div className="map-overlay">
                <p>点击查看地图位置</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;