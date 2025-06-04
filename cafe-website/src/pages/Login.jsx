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
  const [errors, setErrors] = useState({
    email: '',
    password: '',
    general: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field, value) => {
    // 清除该字段的错误
    setErrors(prev => ({ ...prev, [field]: '', general: '' }));
    
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
    
    setIsSubmitting(true);
    setErrors(prev => ({ ...prev, general: '' }));

    try {
      const { success, message } = login(email.trim(), password);
      if (!success) {
        setErrors(prev => ({ ...prev, general: message }));
      } else {
        // 登录成功，跳回原页面或 /account
        navigate(from, { replace: true });
      }
    } catch (error) {
      setErrors(prev => ({ ...prev, general: '登录失败，请重试' }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-page">
      <h1>登录</h1>
      <form className="login-form" onSubmit={handleSubmit}>
        {errors.general && <p className="error">{errors.general}</p>}
        
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
          disabled={isSubmitting}
        >
          {isSubmitting ? '登录中...' : '登录'}
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