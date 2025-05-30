// 在 Home.jsx 中添加
<div className="featured-products">
  <h2 className="section-title">特色咖啡</h2>
  
  {/* 添加多个产品项 */}
  <div className="products-grid">
    {Array.from({ length: 20 }).map((_, index) => (
      <div key={index} className="product-card">
        <div className="product-image">
          <div className="image-placeholder"></div>
        </div>
        <div className="product-details">
          <h3 className="product-name">特色咖啡 {index + 1}</h3>
          <p>描述内容...</p>
          <div className="product-footer">
            <span className="roast-type">中焙</span>
            <span className="product-price">$12.99</span>
          </div>
        </div>
      </div>
    ))}
  </div>
</div>