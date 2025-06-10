// src/pages/Menu.jsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import api from '../utils/axiosConfig';
import '../styles/menu.css';
import '../styles/main.css';

const Menu = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  // 从 URL 获取查询参数
  const initialSearch = queryParams.get('search') || '';
  const initialCategory = queryParams.get('category') || 'All';
  const initialMinPrice = queryParams.get('minPrice') || '';
  const initialMaxPrice = queryParams.get('maxPrice') || '';
  const initialPage = queryParams.get('page') || 1;

  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [minPrice, setMinPrice] = useState(initialMinPrice);
  const [maxPrice, setMaxPrice] = useState(initialMaxPrice);
  const [currentPage, setCurrentPage] = useState(Number(initialPage));

  // 关乎商品列表、加载状态、分页信息
  const [products, setProducts] = useState([]);     // 一定默认是数组
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        // 构建查询参数
        const params = {
          search: searchQuery,
          category: selectedCategory !== 'All' ? selectedCategory : undefined,
          minPrice: minPrice || undefined,
          maxPrice: maxPrice || undefined,
          page: currentPage,
          pageSize: 12
        };

      // 修复这里：移除了多余的 "/api" 前缀
      const { data } = await api.get('/products', { params });
      console.log('Menu 接口返回 data =', data);

      // 第一次拿完 data 之后，也提取一下所有分类，保持下拉完整
        if (Array.isArray(data.products)) {
          const cats = Array.from(new Set(data.products.map(p => p.category)));
          setCategories(cats);
        }

        // —— 兼容三种后端返回格式 —— 
        // 1. data 本身就是一个数组：setProducts(data)
        // 2. data = { products: […] }
        // 3. data = { docs: […] }（分页插件常用形式）

        let fetchedProducts = [];
        let fetchedTotalPages = 1;
        let fetchedTotalProducts = 0;

        if (Array.isArray(data)) {
          // 后端直接返回数组
          fetchedProducts = data;
          fetchedTotalProducts = data.length;
        } else if (Array.isArray(data.products)) {
          // 后端返回 { products: […], totalPages, totalProducts }
          fetchedProducts = data.products;
          fetchedTotalPages = data.totalPages ?? 1;
          fetchedTotalProducts = data.totalProducts ?? data.products.length;
        } else if (Array.isArray(data.docs)) {
          // 后端返回 { docs: […], totalPages, totalDocs } 这种 paginate 结构
          fetchedProducts = data.docs;
          fetchedTotalPages = data.totalPages ?? 1;
          fetchedTotalProducts = data.totalDocs ?? data.docs.length;
        } else {
          // 兼容：如果你不知道后端返回什么，先尝试从根字段里取数组
          fetchedProducts = Array.isArray(data.products)
            ? data.products
            : Array.isArray(data.docs)
            ? data.docs
            : [];
        }

        setProducts(fetchedProducts);
        setTotalPages(fetchedTotalPages);
        setTotalProducts(fetchedTotalProducts);

        setLoading(false);
      } catch (err) {
        console.error('获取商品失败：', err);
        setError(err.response?.data?.message || '获取商品失败');
        setLoading(false);
      }
    };

    fetchProducts();

    // 更新 URL 查询参数
    const newQueryParams = new URLSearchParams();
    if (searchQuery) newQueryParams.set('search', searchQuery);
    if (selectedRoast !== 'All') newQueryParams.set('roast', selectedRoast);
    if (selectedCategory !== 'All') newQueryParams.set('category', selectedCategory);
    if (minPrice) newQueryParams.set('minPrice', minPrice);
    if (maxPrice) newQueryParams.set('maxPrice', maxPrice);
    if (currentPage > 1) newQueryParams.set('page', currentPage);
    navigate(`?${newQueryParams.toString()}`, { replace: true });
  }, [searchQuery, selectedRoast, minPrice, maxPrice, currentPage, navigate]);

  // 下面是渲染部分
  return (
    <div className="menu-page">
      <h1 className="page-title">咖啡菜单</h1>

      <div className="filter-summary">
        {totalProducts > 0 && <p>找到 {totalProducts} 个商品</p>}
      </div>

      <div className="filter-controls">
        <input
          type="text"
          placeholder="🔍  搜索咖啡名称或描述..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />

        <select
          value={selectedCategory}
          onChange={e => {
            setSelectedCategory(e.target.value);
            setCurrentPage(1);
          }}
        >
          <option value="All">全部分类</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        <input
          type="number"
          placeholder="最低价 (¥)"
          value={minPrice}
          onChange={e => setMinPrice(e.target.value)}
          min="0"
          step="0.01"
        />

        <input
          type="number"
          placeholder="最高价 (¥)"
          value={maxPrice}
          onChange={e => setMaxPrice(e.target.value)}
          min="0"
          step="0.01"
        />

        <button
          onClick={() => {
            setSearchQuery('');
            setSelectedRoast('All');
            setMinPrice('');
            setMaxPrice('');
            setCurrentPage(1);
          }}
        >
          重置筛选
        </button>
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
              {products.map(product => (
                <ProductCard
                  key={product._id}
                  product={product}
                  searchQuery={searchQuery}
                />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="pagination">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  上一页
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={currentPage === pageNum ? 'active' : ''}
                  >
                    {pageNum}
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
