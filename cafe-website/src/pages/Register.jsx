// src/pages/Register.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/register.css';

const Register = () => {
  const navigate = useNavigate();
  const { user, registerUser, loading, error: authError } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
    confirmPwd: '',
  });

  // 如果用户已登录，直接跳转到个人中心
  useEffect(() => {
    if (user) {
      navigate('/account');
    }
  }, [user, navigate]);

  const handleInputChange = (field, value) => {
    // 清除该字段的错误
    setErrors(prev => ({ ...prev, [field]: '' }));
    
    switch(field) {
      case 'name': setName(value); break;
      case 'email': setEmail(value); break;
      case 'password': setPassword(value); break;
      case 'confirmPwd': setConfirmPwd(value); break;
    }
  };

  const validateForm = () => {
    const newErrors = {
      name: '',
      email: '',
      password: '',
      confirmPwd: ''
    };
    let isValid = true;

    // 姓名校验
    if (!name.trim()) {
      newErrors.name = '请输入姓名';
      isValid = false;
    }

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
    } else if (password.length < 6) {
      newErrors.password = '密码长度至少为6位';
      isValid = false;
    }

    // 确认密码校验
    if (!confirmPwd) {
      newErrors.confirmPwd = '请再次输入密码';
      isValid = false;
    } else if (password !== confirmPwd) {
      newErrors.confirmPwd = '两次输入的密码不一致';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      await registerUser({
        name: name.trim(),
        email: email.trim(),
        password: password
      });
      // 注册成功后，useEffect会自动处理跳转
    } catch (error) {
      // 错误信息已在 AuthContext 中处理
      console.error('注册失败:', error);
    }
  };

  return (
    <div className="register-page">
      <h2>注册账号</h2>
      <form className="register-form" onSubmit={handleSubmit}>
        {authError && <p className="error">{authError}</p>}
        
        <label>
          姓名：
          <input
            type="text"
            value={name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="请输入您的姓名"
            required
            className={errors.name ? 'error-input' : ''}
          />
          {errors.name && <span className="field-error">{errors.name}</span>}
        </label>

        <label>
          邮箱：
          <input
            type="email"
            value={email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            placeholder="请输入您的邮箱"
            required
            className={errors.email ? 'error-input' : ''}
          />
          {errors.email && <span className="field-error">{errors.email}</span>}
        </label>

        <label>
          密码：
          <input
            type="password"
            value={password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            placeholder="请输入密码（至少6位）"
            required
            className={errors.password ? 'error-input' : ''}
          />
          {errors.password && <span className="field-error">{errors.password}</span>}
        </label>

        <label>
          确认密码：
          <input
            type="password"
            value={confirmPwd}
            onChange={(e) => handleInputChange('confirmPwd', e.target.value)}
            placeholder="请再次输入密码"
            required
            className={errors.confirmPwd ? 'error-input' : ''}
          />
          {errors.confirmPwd && <span className="field-error">{errors.confirmPwd}</span>}
        </label>

        <button 
          type="submit" 
          className="btn register-btn"
          disabled={loading}
        >
          {loading ? '注册中...' : '注册并登录'}
        </button>
      </form>

      <p className="redirect">
        已有账号？<Link to="/login">去登录</Link>
      </p>
    </div>
  );
};

export default Register;