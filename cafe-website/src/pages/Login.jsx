// src/pages/Login.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/login.css';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, login, loading, error: authError } = useAuth();

  // 如果用户被重定向过来，可拿到原本想去的页面
  const from = location.state?.from || '/account';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });

  // 如果用户已登录，直接跳转到目标页面
  useEffect(() => {
    if (user) {
      navigate(from, { replace: true });
    }
  }, [user, navigate, from]);

  const handleInputChange = (field, value) => {
    // 清除该字段的错误
    setErrors(prev => ({ ...prev, [field]: '' }));
    
    if (field === 'email') setEmail(value);
    if (field === 'password') setPassword(value);
  };

  const validateForm = () => {
    const newErrors = {
      email: '',
      password: ''
    };
    let isValid = true;

    // 邮箱校验
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      newErrors.email = '请输入邮箱';
      isValid = false;
    } else if (!emailPattern.test(email.trim())) {
      newErrors.email = '邮箱格式不正确';
      isValid = false;
    }

    // 密码校验
    if (!password) {
      newErrors.password = '请输入密码';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      await login(email.trim(), password);
      // 登录成功后，useEffect会自动处理跳转
    } catch (error) {
      // 错误信息已在 AuthContext 中处理
      console.error('登录失败:', error);
    }
  };

  return (
    <div className="login-page">
      <h1>登录</h1>
      <form className="login-form" onSubmit={handleSubmit}>
        {authError && <p className="error">{authError}</p>}
        
        <div className="form-group">
          <label htmlFor="email">邮箱：</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            placeholder="请输入邮箱"
            required
            className={errors.email ? 'error-input' : ''}
          />
          {errors.email && <span className="field-error">{errors.email}</span>}
        </div>
        
        <div className="form-group">
          <label htmlFor="password">密码：</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            placeholder="请输入密码"
            required
            className={errors.password ? 'error-input' : ''}
          />
          {errors.password && <span className="field-error">{errors.password}</span>}
        </div>
        
        <button 
          type="submit" 
          className="btn login-btn"
          disabled={loading}
        >
          {loading ? '登录中...' : '登录'}
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