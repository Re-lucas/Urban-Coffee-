// src/pages/admin/ProductList.jsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/axiosConfig';
import '../../styles/admin-productlist.css';

const ProductList = () => {
  // const { user } = useAuth(); // 不再需要内部权限校验
  const navigate = useNavigate();
  const location = useLocation();

  // 从 URL 参数中获取搜索关键字和页码
  const query = new URLSearchParams(location.search);
  const keyword = query.get('keyword') || '';
  const pageNumber = Number(query.get('pageNumber')) || 1;
  
  const [products, setProducts] = useState([]);
  const [searchText, setSearchText] = useState(keyword);
  const [page, setPage] = useState(pageNumber);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 获取商品列表数据
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(
          `/products?keyword=${keyword}&pageNumber=${pageNumber}`
        );
        setProducts(data.products);
        setPage(data.page);
        setPages(data.pages);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || '获取商品列表失败');
        setLoading(false);
      }
    };
    fetchProducts();
  }, [keyword, pageNumber]);

  // 处理搜索
  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/admin/productlist?keyword=${searchText}&pageNumber=1`);
  };

  // 处理删除商品
  const handleDelete = async (productId) => {
    if (window.confirm('确定要删除此商品吗？')) {
      try {
        setLoading(true);
        await api.delete(`/products/${productId}`);
        // 删除成功后刷新列表
        const { data } = await api.get(
          `/products?keyword=${keyword}&pageNumber=${pageNumber}`
        );
        setProducts(data.products);
        setPage(data.page);
        setPages(data.pages);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || '删除商品失败');
        setLoading(false);
      }
    }
  };

  return (
    <div className="admin-productlist">
      <h2>商品库存管理</h2>

      <div className="admin-actions">
        <Link to="/admin/products/create" className="btn-add">
          添加新商品
        </Link>
        <form onSubmit={handleSearch} className="search-bar">
          <input
            type="text"
            placeholder="搜索商品名称..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <button type="submit">搜索</button>
        </form>
      </div>

      {loading && <div className="loading">加载中...</div>}
      {error && <div className="error">{error}</div>}

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>名称</th>
            <th>价格（¥）</th>
            <th>库存</th>
            <th>在售</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {products.length === 0 ? (
            <tr>
              <td colSpan="6" style={{ textAlign: 'center' }}>
                {loading ? '加载中...' : '无匹配商品'}
              </td>
            </tr>
          ) : (
            products.map((p) => (
              <tr key={p._id}>
                <td>{p._id.slice(0, 8)}</td>
                <td>{p.name}</td>
                <td>{p.price.toFixed(2)}</td>
                <td className={p.countInStock <= 0 ? 'out-of-stock' : ''}>
                  {p.countInStock}
                </td>
                <td>
                  <span className={p.isAvailable ? 'available' : 'unavailable'}>
                    {p.isAvailable ? '是' : '否'}
                  </span>
                </td>
                <td className="actions">
                  <Link to={`/admin/products/${p._id}/edit`} className="btn-edit">
                    编辑
                  </Link>
                  <button 
                    onClick={() => handleDelete(p._id)} 
                    className="btn-delete"
                  >
                    删除
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* 分页控件 */}
      {pages > 1 && (
        <div className="pagination">
          {[...Array(pages).keys()].map((x) => (
            <Link
              key={x + 1}
              to={`/admin/productlist?keyword=${keyword}&pageNumber=${x + 1}`}
              className={`page-item ${x + 1 === page ? 'active' : ''}`}
            >
              {x + 1}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductList;
