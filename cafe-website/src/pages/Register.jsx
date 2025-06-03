// src/pages/Register.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';   // ← 改为 useAuth()
import '../styles/register.css';

const Register = () => {
  const navigate = useNavigate();
  const { registerUser } = useAuth(); // ← 通过 hook 拿到 registerUser 方法

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // 1. 基本校验
    if (!name.trim() || !email.trim() || !password) {
      setError('请填写姓名、邮箱和密码。');
      return;
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email.trim())) {
      setError('请输入有效的邮箱地址。');
      return;
    }
    if (password.length < 6) {
      setError('密码长度至少为 6 位。');
      return;
    }
    if (password !== confirmPwd) {
      setError('两次输入的密码不一致。');
      return;
    }

    // 2. 调用 registerUser({ name, email, password })
    const { success, message } = registerUser({
      name: name.trim(),
      email: email.trim(),
      password: password
    });

    if (!success) {
      // 注册失败，显示后端返回的提示
      setError(message);
    } else {
      // 注册成功且已自动登录，跳转到“我的账户”页面
      navigate('/account');
    }
  };

  return (
    <div className="register-page">
      <h2>注册账号</h2>
      <form className="register-form" onSubmit={handleSubmit}>
        {error && <p className="error">{error}</p>}
        <label>
          姓名：
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="请输入您的姓名"
            required
          />
        </label>

        <label>
          邮箱：
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="请输入您的邮箱"
            required
          />
        </label>

        <label>
          密码：
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="请输入密码（至少6位）"
            required
          />
        </label>

        <label>
          确认密码：
          <input
            type="password"
            value={confirmPwd}
            onChange={(e) => setConfirmPwd(e.target.value)}
            placeholder="请再次输入密码"
            required
          />
        </label>

        <button type="submit" className="btn register-btn">
          注册并登录
        </button>
      </form>

      <p className="redirect">
        已有账号？<Link to="/login">去登录</Link>
      </p>
    </div>
  );
};

export default Register;
