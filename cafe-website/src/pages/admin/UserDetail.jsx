// src/pages/admin/UserDetail.jsx
import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/axiosConfig';
import '../../styles/admin-userdetail.css';

const UserDetail = () => {
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    isAdmin: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 管理员权限验证
  useEffect(() => {
    if (!currentUser || !currentUser.isAdmin) {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  // 获取用户数据
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/users/${id}`);
        setUser(data);
        setFormData({
          name: data.name,
          email: data.email,
          isAdmin: data.isAdmin
        });
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || '获取用户信息失败');
        setLoading(false);
      }
    };

    if (currentUser?.isAdmin) {
      fetchUser();
    }
  }, [id, currentUser]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.put(`/users/${id}`, formData);
      navigate('/admin/users');
    } catch (err) {
      setError(err.response?.data?.message || '更新用户信息失败');
      setLoading(false);
    }
  };

  if (loading && !user) {
    return <div className="admin-userdetail loading">加载用户信息中...</div>;
  }

  if (!user) {
    return <div className="admin-userdetail error">无法加载用户信息</div>;
  }

  return (
    <div className="admin-userdetail">
      <Link to="/admin/users" className="back-btn">
        ← 返回用户列表
      </Link>
      
      <h2>编辑用户 - {user.name}</h2>
      
      {error && <div className="error">{error}</div>}
      
      <form onSubmit={handleSubmit} className="user-form">
        <div className="form-group">
          <label htmlFor="name">用户名 *</label>
          <input
            id="name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="email">邮箱 *</label>
          <input
            id="email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group checkbox-group">
          <input
            id="isAdmin"
            type="checkbox"
            name="isAdmin"
            checked={formData.isAdmin}
            onChange={handleChange}
          />
          <label htmlFor="isAdmin">管理员权限</label>
        </div>
        
        <div className="form-actions">
          <button 
            type="submit" 
            className="submit-btn"
            disabled={loading}
          >
            {loading ? '更新中...' : '更新用户信息'}
          </button>
        </div>
      </form>
      
      <section className="user-meta">
        <h3>用户信息</h3>
        <p><strong>注册时间：</strong> {new Date(user.createdAt).toLocaleString()}</p>
        <p><strong>最后登录：</strong> {user.lastLogin ? new Date(user.lastLogin).toLocaleString() : '从未登录'}</p>
        <p><strong>用户ID：</strong> {user._id}</p>
      </section>
    </div>
  );
};

export default UserDetail;