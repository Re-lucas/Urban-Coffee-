// src/pages/admin/AdminLogin.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';
import '../../styles/admin-login.css';

const AdminLogin = () => {
  const { adminUser, loading, error: authError, loginAdmin } = useAdminAuth();
  const navigate = useNavigate();

  // 已登录则跳后台首页
  useEffect(() => {
    if (adminUser) {
      navigate('/admin', { replace: true });
    }
  }, [adminUser, navigate]);

  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const { success, message } = await loginAdmin(email.trim(), password);
    if (!success) {
      setError(message);
    }
  };

  return (
    <div className="admin-login-page">
      <h2>管理员登录</h2>
      <form className="admin-login-form" onSubmit={handleSubmit}>
        {error && <p className="error">{error}</p>}
        {authError && <p className="error">{authError}</p>}

        <label>
          管理员邮箱：
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@yourshop.com"
            required
          />
        </label>

        <label>
          密码：
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="请输入密码"
            required
          />
        </label>

        <button type="submit" className="btn login-btn" disabled={loading}>
          {loading ? '登录中...' : '登录'}
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;
