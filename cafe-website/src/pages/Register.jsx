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

  // 注册成功后 user 会被设值，这里跳转到 /account
  useEffect(() => {
    if (user) {
      navigate('/account', { replace: true });
    }
  }, [user, navigate]);

  const handleInputChange = (field, value) => {
    setErrors(prev => ({ ...prev, [field]: '' }));
    switch (field) {
      case 'name': setName(value); break;
      case 'email': setEmail(value); break;
      case 'password': setPassword(value); break;
      case 'confirmPwd': setConfirmPwd(value); break;
      default: break;
    }
  };

  const validateForm = () => {
    const newErrors = { name: '', email: '', password: '', confirmPwd: '' };
    let valid = true;

    if (!name.trim()) {
      newErrors.name = '请输入姓名';
      valid = false;
    }
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      newErrors.email = '请输入邮箱';
      valid = false;
    } else if (!emailRe.test(email.trim())) {
      newErrors.email = '邮箱格式不正确';
      valid = false;
    }
    if (!password) {
      newErrors.password = '请输入密码';
      valid = false;
    } else if (password.length < 6) {
      newErrors.password = '密码长度至少为6位';
      valid = false;
    }
    if (!confirmPwd) {
      newErrors.confirmPwd = '请再次输入密码';
      valid = false;
    } else if (password !== confirmPwd) {
      newErrors.confirmPwd = '两次输入的密码不一致';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  // ← 一定要加 async
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    // ← 一定要加 await
    const { success, message } = await registerUser({
      name: name.trim(),
      email: email.trim(),
      password,
    });

    if (!success) {
      // registerUser 已经在 AuthContext 里把错误存到 `error` 里，
      // 这里不需要二次 alert，页面顶部会显示 authError
      console.warn('注册失败：', message);
    }
    // 成功时，useEffect 会检测到 user 被设置，自动跳转
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
            onChange={e => handleInputChange('name', e.target.value)}
            placeholder="请输入您的姓名"
            className={errors.name ? 'error-input' : ''}
          />
          {errors.name && <span className="field-error">{errors.name}</span>}
        </label>

        <label>
          邮箱：
          <input
            type="email"
            value={email}
            onChange={e => handleInputChange('email', e.target.value)}
            placeholder="请输入您的邮箱"
            className={errors.email ? 'error-input' : ''}
          />
          {errors.email && <span className="field-error">{errors.email}</span>}
        </label>

        <label>
          密码：
          <input
            type="password"
            value={password}
            onChange={e => handleInputChange('password', e.target.value)}
            placeholder="请输入密码（至少6位）"
            className={errors.password ? 'error-input' : ''}
          />
          {errors.password && <span className="field-error">{errors.password}</span>}
        </label>

        <label>
          确认密码：
          <input
            type="password"
            value={confirmPwd}
            onChange={e => handleInputChange('confirmPwd', e.target.value)}
            placeholder="请再次输入密码"
            className={errors.confirmPwd ? 'error-input' : ''}
          />
          {errors.confirmPwd && <span className="field-error">{errors.confirmPwd}</span>}
        </label>

        <button type="submit" className="btn register-btn" disabled={loading}>
          {loading ? '注册中…' : '注册并登录'}
        </button>
      </form>

      <p className="redirect">
        已有账号？<Link to="/login">去登录</Link>
      </p>
    </div>
  );
};

export default Register;
