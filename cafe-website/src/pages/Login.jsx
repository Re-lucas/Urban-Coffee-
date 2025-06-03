// src/pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/login.css';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  // 如果用户被重定向过来，可拿到原本想去的页面
  const from = location.state?.from || '/account';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('请输入邮箱和密码。');
      return;
    }

    const { success, message } = login(email.trim(), password);
    if (!success) {
      setError(message);
    } else {
      // 登录成功，跳回原页面或 /account
      navigate(from, { replace: true });
    }
  };

  return (
    <div className="login-page">
      <h1>登录</h1>
      <form className="login-form" onSubmit={handleSubmit}>
        {error && <p className="error">{error}</p>}
        <div className="form-group">
          <label htmlFor="email">邮箱：</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="请输入邮箱"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">密码：</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="请输入密码"
            required
          />
        </div>
        <button type="submit" className="btn login-btn">
          登录
        </button>
      </form>

      <div className="login-links">
        <p>
          没有账号？<Link to="/register">注册新账号</Link>
        </p>
        <p>
          <Link to="/forgot-password">忘记密码？</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
