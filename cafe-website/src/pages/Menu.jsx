// src/pages/Menu.jsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import api from '../utils/axiosConfig'; // 导入 API 实例
import '../styles/menu.css';
import '../styles/main.css';

const Menu = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  
  // 从 URL 获取查询参数
  const initialSearch = queryParams.get('search') || '';
  const initialRoast = queryParams.get('roast') || 'All';
  const initialMinPrice = queryParams.get('minPrice') || '';
  const initialMaxPrice = queryParams.get('maxPrice') || '';
  const initialPage = queryParams.get('page') || 1;
  
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedRoast, setSelectedRoast] = useState(initialRoast);
  const [minPrice, setMinPrice] = useState(initialMinPrice);
  const [maxPrice, setMaxPrice] = useState(initialMaxPrice);
  const [currentPage, setCurrentPage] = useState(Number(initialPage));
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  // 获取商品数据
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        
        // 构建查询参数
        const params = {
          search: searchQuery,
          roast: selectedRoast !== 'All' ? selectedRoast : undefined,
          minPrice: minPrice || undefined,
          maxPrice: maxPrice || undefined,
          page: currentPage,
          pageSize: 12 // 每页显示12个商品
        };
        
        // 发送请求
        const { data } = await api.get('/api/products', { params });
        
        setProducts(data.products);
        setTotalPages(data.totalPages);
        setTotalProducts(data.totalProducts);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || '获取商品失败');
        setLoading(false);
      }
    };
    
    fetchProducts();
    
    // 更新 URL
    const newQueryParams = new URLSearchParams();
    if (searchQuery) newQueryParams.set('search', searchQuery);
    if (selectedRoast !== 'All') newQueryParams.set('roast', selectedRoast);
    if (minPrice) newQueryParams.set('minPrice', minPrice);
    if (maxPrice) newQueryParams.set('maxPrice', maxPrice);
    if (currentPage > 1) newQueryParams.set('page', currentPage);
    
    navigate(`?${newQueryParams.toString()}`, { replace: true });
  }, [searchQuery, selectedRoast, minPrice, maxPrice, currentPage, navigate]);

  const handleSearchChange = (e) => setSearchQuery(e.target.value);
  const handleRoastChange = (e) => {
    setSelectedRoast(e.target.value);
    setCurrentPage(1); // 重置到第一页
  };
  const handleMinPriceChange = (e) => setMinPrice(e.target.value);
  const handleMaxPriceChange = (e) => setMaxPrice(e.target.value);

  const handleReset = () => {
    setSearchQuery('');
    setSelectedRoast('All');
    setMinPrice('');
    setMaxPrice('');
    setCurrentPage(1);
  };

  return (
    <div className="menu-page">
      <h1 className="page-title">咖啡菜单</h1>
      
      <div className="filter-summary">
        {totalProducts > 0 && (
          <p>找到 {totalProducts} 个商品</p>
        )}
      </div>

      <div className="filter-controls">
        <input
          type="text"
          placeholder="🔍  搜索咖啡名称或描述..."
          value={searchQuery}
          onChange={handleSearchChange}
        />

        <select value={selectedRoast} onChange={handleRoastChange}>
          <option value="All">全部烘焙程度</option>
          <option value="浅焙">浅焙</option>
          <option value="中焙">中焙</option>
          <option value="深焙">深焙</option>
        </select>

        <input
          type="number"
          placeholder="最低价 (¥)"
          value={minPrice}
          onChange={handleMinPriceChange}
          min="0"
          step="0.01"
        />

        <input
          type="number"
          placeholder="最高价 (¥)"
          value={maxPrice}
          onChange={handleMaxPriceChange}
          min="0"
          step="0.01"
        />

        <button onClick={handleReset}>重置筛选</button>
      </div>

      <div className="container">
        {loading ? (
          <div className="loading">加载中...</div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : products.length === 0 ? (
          <p className="no-results">没有符合条件的商品。</p>
        ) : (
          <>
            <div className="products-grid">
              {products.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  searchQuery={searchQuery}
                />
              ))}
            </div>
            
            {/* 分页控件 */}
            {totalPages > 1 && (
              <div className="pagination">
                <button 
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  上一页
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={currentPage === page ? 'active' : ''}
                  >
                    {page}
                  </button>
                ))}
                
                <button 
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  下一页
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Menu;