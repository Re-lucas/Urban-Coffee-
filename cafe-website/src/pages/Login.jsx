// src/pages/Login.jsx
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../styles/login.css'; // 如果你想单独写样式，可以 later 新建这个文件

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  // 本例只是演示，用 state 保存输入框里的值
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // 登录按钮点击时调用 AuthContext.login，然后跳转
  const handleSubmit = (e) => {
    e.preventDefault();
    // login 会把 user 存到 Context 里并写入 localStorage
    const success = login(email, password);
    if (success) {
      // 登录成功后，跳转到 /account
      navigate('/account');
    } else {
      // 若你想演示失败逻辑，这里可以做提示
      alert('登录失败');
    }
  };

  return (
    <div className="login-page">
      <h1>登录</h1>
      <form className="login-form" onSubmit={handleSubmit}>
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
    </div>
  );
};

export default Login;
