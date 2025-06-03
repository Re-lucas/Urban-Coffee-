// src/pages/admin/ProductEdit.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useProduct } from '../../context/ProductContext';
import '../../styles/admin-productedit.css';

const ProductEdit = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { products, updateProduct } = useProduct();

  const [product, setProduct] = useState(null);
  const [stock, setStock] = useState(0);
  const [isAvailable, setIsAvailable] = useState(true);
  const [error, setError] = useState('');

  // 根据 productId 找到对应商品，初始化本地状态
  useEffect(() => {
    const found = products.find((p) => p.id === productId);
    if (!found) {
      navigate('/admin/products');
      return;
    }
    setProduct(found);
    setStock(found.stock);
    setIsAvailable(found.isAvailable);
  }, [productId, products]);

  if (!product) {
    return <p>正在加载商品信息…</p>;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // 验证库存必须是非负整数
    const numStock = Number(stock);
    if (isNaN(numStock) || !Number.isInteger(numStock) || numStock < 0) {
      setError('请输入非负整数作为库存');
      return;
    }

    // 更新商品
    updateProduct(product.id, { stock: numStock, isAvailable });
    alert('商品信息保存成功');
    navigate('/admin/products');
  };

  return (
    <div className="admin-productedit">
      <h2>编辑商品 - {product.name}</h2>
      <form className="edit-form" onSubmit={handleSubmit}>
        {error && <p className="error">{error}</p>}

        <label>
          商品名称：
          <input
            type="text"
            value={product.name}
            disabled
          />
        </label>

        <label>
          价格 (¥)：
          <input
            type="text"
            value={product.price.toFixed(2)}
            disabled
          />
        </label>

        <label>
          库存 (stock)：
          <input
            type="number"
            min="0"
            step="1"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            required
          />
        </label>

        <label>
          是否在售：
          <select
            value={isAvailable ? 'true' : 'false'}
            onChange={(e) => setIsAvailable(e.target.value === 'true')}
          >
            <option value="true">在售</option>
            <option value="false">下架</option>
          </select>
        </label>

        <button type="submit" className="btn save-btn">
          保存
        </button>
        <Link to="/admin/products" className="btn back-btn">
          ← 返回商品列表
        </Link>
      </form>
    </div>
  );
};

export default ProductEdit;
