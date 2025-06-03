// src/pages/ForgotPassword.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/forgot-password.css';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const { users, resetPassword } = useAuth();

  // step = 1（输入邮箱） 或 step = 2（输入新密码）
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const [newPwd, setNewPwd] = useState('');
  const [confirmNewPwd, setConfirmNewPwd] = useState('');

  // 第一步：检查邮箱是否存在
  const handleCheckEmail = (e) => {
    e.preventDefault();
    setError('');
    if (!email.trim()) {
      setError('请输入您的注册邮箱。');
      return;
    }
    const exists = users.find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase()
    );
    if (!exists) {
      setError('该邮箱尚未注册，请检查输入或先去注册。');
      return;
    }
    // 邮箱存在，进入步骤 2
    setStep(2);
  };

  // 第二步：提交新密码
  const handleResetPwd = (e) => {
    e.preventDefault();
    setError('');
    if (!newPwd) {
      setError('请输入新密码。');
      return;
    }
    if (newPwd.length < 6) {
      setError('新密码长度至少 6 位。');
      return;
    }
    if (newPwd !== confirmNewPwd) {
      setError('两次输入密码不一致。');
      return;
    }
    const { success, message } = resetPassword({
      email: email.trim().toLowerCase(),
      newPassword: newPwd,
    });
    if (!success) {
      setError(message);
    } else {
      alert(message); // “密码已重置，请使用新密码登录。”
      navigate('/login');
    }
  };

  return (
    <div className="forgot-password-page">
      <h2>忘记密码</h2>

      {step === 1 && (
        <form className="forgot-form" onSubmit={handleCheckEmail}>
          {error && <p className="error">{error}</p>}
          <label>
            注册邮箱：
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="请输入您的注册邮箱"
              required
            />
          </label>
          <button type="submit" className="btn next-btn">
            下一步
          </button>
          <p className="redirect">
            记得密码了？<Link to="/login">去登录</Link>
          </p>
        </form>
      )}

      {step === 2 && (
        <form className="forgot-form" onSubmit={handleResetPwd}>
          {error && <p className="error">{error}</p>}
          <label>
            新密码：
            <input
              type="password"
              value={newPwd}
              onChange={(e) => setNewPwd(e.target.value)}
              placeholder="请输入新密码（至少6位）"
              required
            />
          </label>
          <label>
            确认新密码：
            <input
              type="password"
              value={confirmNewPwd}
              onChange={(e) => setConfirmNewPwd(e.target.value)}
              placeholder="请再次输入新密码"
              required
            />
          </label>
          <button type="submit" className="btn reset-btn">
            提交新密码
          </button>
          <p className="redirect">
            忘了邮箱？<Link to="/register">去注册新账号</Link>
          </p>
        </form>
      )}
    </div>
  );
};

export default ForgotPassword;
