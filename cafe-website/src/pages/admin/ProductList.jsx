// src/pages/admin/ProductList.jsx
import React, { useState, useMemo } from 'react';
import { useProduct } from '../../context/ProductContext';
import { Link } from 'react-router-dom';
import '../../styles/admin-productlist.css';

const ProductList = () => {
  const { products } = useProduct();
  const [searchText, setSearchText] = useState('');

  const filtered = useMemo(() => {
    if (!searchText.trim()) return products;
    return products.filter((p) =>
      p.name.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [searchText, products]);

  return (
    <div className="admin-productlist">
      <h2>商品库存管理</h2>

      <div className="search-bar">
        <input
          type="text"
          placeholder="搜索 商品名称"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>

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
          {filtered.length === 0 ? (
            <tr>
              <td colSpan="6" style={{ textAlign: 'center' }}>
                无匹配商品
              </td>
            </tr>
          ) : (
            filtered.map((p) => (
              <tr key={p.id}>
                <td>{p.id.slice(0, 8)}</td>
                <td>{p.name}</td>
                <td>{p.price.toFixed(2)}</td>
                <td className={p.stock <= 0 ? 'out-of-stock' : ''}>
                  {p.stock}
                </td>
                <td>
                  <span className={p.isAvailable ? 'available' : 'unavailable'}>
                    {p.isAvailable ? '是' : '否'}
                  </span>
                </td>
                <td>
                  <Link to={`/admin/products/${p.id}`}>编辑</Link>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ProductList;