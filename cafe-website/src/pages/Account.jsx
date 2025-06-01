// pages/Account.jsx (新建)
import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import '../styles/account.css';

const Account = () => {
  const { user, points, level, logout } = useContext(AuthContext);
  
  const getLevelInfo = () => {
    switch(level) {
      case 'vip': 
        return { name: '黑卡会员', discount: 15, color: '#000' };
      case 'premium':
        return { name: '高级会员', discount: 10, color: '#d4af37' };
      default:
        return { name: '普通会员', discount: 5, color: '#6F4E37' };
    }
  };
  
  const levelInfo = getLevelInfo();

  return (
    <div className="account-page">
      <h1 className="page-title">我的账户</h1>
      
      <div className="container">
        <div className="profile-card">
          <div className="profile-header">
            <div className="avatar">{user?.name?.charAt(0)}</div>
            <div className="profile-info">
              <h2>{user?.name}</h2>
              <p>{user?.email}</p>
            </div>
          </div>
          
          <div className="membership-card" style={{ borderColor: levelInfo.color }}>
            <h3>{levelInfo.name}</h3>
            <p>享 {levelInfo.discount}% 折扣优惠</p>
            <div className="membership-badge" style={{ backgroundColor: levelInfo.color }}>
              {levelInfo.name}
            </div>
          </div>
          
          <div className="points-section">
            <h3>我的积分</h3>
            <div className="points-display">
              <span className="points-value">{points}</span>
              <span>积分</span>
            </div>
            <p>1000积分可兑换免费咖啡</p>
          </div>
          
          <div className="account-actions">
            <button className="btn primary">积分兑换</button>
            <button className="btn secondary" onClick={logout}>退出登录</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;