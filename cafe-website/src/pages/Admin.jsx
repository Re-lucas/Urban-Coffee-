// pages/Admin.jsx
import React, { useState } from 'react';
import '../styles/admin.css';

const Admin = () => {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: 0,
    description: '',
    roast: '浅焙'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
  };

  const addProduct = () => {
    setProducts([...products, { ...newProduct, id: Date.now() }]);
    setNewProduct({ name: '', price: 0, description: '', roast: '浅焙' });
  };

  return (
    <div className="admin-page">
      <h1 className="page-title">产品管理</h1>
      <div className="container">
        <div className="product-form">
          <h2>添加新产品</h2>
          <div className="form-group">
            <label>产品名称</label>
            <input 
              type="text" 
              name="name"
              value={newProduct.name}
              onChange={handleInputChange}
            />
          </div>
          {/* 其他字段 */}
          <button onClick={addProduct}>添加产品</button>
        </div>

        <div className="product-list">
          <h2>现有产品</h2>
          {products.map(product => (
            <div key={product.id} className="admin-product">
              <h3>{product.name}</h3>
              <p>${product.price}</p>
              <button>编辑</button>
              <button>删除</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Admin;