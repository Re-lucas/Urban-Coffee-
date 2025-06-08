// src/pages/admin/ProductEdit.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/axiosConfig';
import '../../styles/admin-productedit.css';

const ProductEdit = () => {
  // const { user } = useAuth(); // 不再需要权限校验
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [countInStock, setCountInStock] = useState(0);
  const [isAvailable, setIsAvailable] = useState(true);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 获取商品数据
  useEffect(() => {
    if (isEditMode) {
      const fetchProduct = async () => {
        try {
          setLoading(true);
          const { data } = await api.get(`/products/${id}`);
          setName(data.name);
          setPrice(data.price);
          setBrand(data.brand);
          setCategory(data.category);
          setDescription(data.description);
          setImage(data.image);
          setCountInStock(data.countInStock);
          setIsAvailable(data.isAvailable);
          setLoading(false);
        } catch (err) {
          setError(err.response?.data?.message || '获取商品信息失败');
          setLoading(false);
        }
      };
      fetchProduct();
    }
  }, [id, isEditMode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const productData = {
        name,
        price: Number(price),
        brand,
        category,
        description,
        image,
        countInStock: Number(countInStock),
        isAvailable
      };

      if (isEditMode) {
        await api.put(`/products/${id}`, productData);
      } else {
        await api.post('/products', productData);
      }
      navigate('/admin/products');
    } catch (err) {
      setError(err.response?.data?.message || '保存失败，请重试');
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="admin-productedit loading">加载商品信息中...</div>;
  }

  return (
    <div className="admin-productedit">
      <Link to="/admin/products" className="back-link">
        &larr; 返回商品列表
      </Link>
      <h2>{isEditMode ? '编辑商品' : '添加新商品'}</h2>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit} className="product-form">
        <div className="form-group">
          <label htmlFor="name">商品名称 *</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="price">价格 (¥) *</label>
          <input
            id="price"
            type="number"
            min="0"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="brand">品牌 *</label>
          <input
            id="brand"
            type="text"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="category">分类 *</label>
          <input
            id="category"
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="image">图片 URL *</label>
          <input
            id="image"
            type="text"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="stock">库存数量 *</label>
          <input
            id="stock"
            type="number"
            min="0"
            value={countInStock}
            onChange={(e) => setCountInStock(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="available">在售状态 *</label>
          <select
            id="available"
            value={isAvailable}
            onChange={(e) => setIsAvailable(e.target.value === 'true')}
          >
            <option value={true}>在售</option>
            <option value={false}>下架</option>
          </select>
        </div>
        <div className="form-group full-width">
          <label htmlFor="description">商品描述 *</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="5"
            required
          ></textarea>
        </div>
        <div className="form-actions">
          <button 
            type="submit" 
            className="submit-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? '处理中...' : (isEditMode ? '更新商品' : '创建商品')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductEdit;
