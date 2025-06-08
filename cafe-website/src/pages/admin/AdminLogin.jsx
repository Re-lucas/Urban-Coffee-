// src/pages/admin/AdminLogin.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../../styles/admin-login.css';

const AdminLogin = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.isAdmin) {
      navigate('/admin', { replace: true });
    }
  }, [user, navigate]);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const { success, message } = await login(email.trim(), password);
    if (!success) {
      setError(message);
    }
  };

  return (
    <div className="admin-login-page">
      <h2>管理员登录</h2>
      <form className="admin-login-form" onSubmit={handleSubmit}>
        {error && <p className="error">{error}</p>}
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
        <button type="submit" className="btn login-btn">
          登录
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;
