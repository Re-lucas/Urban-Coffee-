// src/components/RequireAdmin.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RequireAdmin = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // 验证登录和管理员权限
  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        正在验证管理员权限…
      </div>
    );
  }

  // 没有登录 or 不是管理员
  if (!user || !user.isAdmin) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 是管理员，渲染子组件
  return children;
};

export default RequireAdmin;
