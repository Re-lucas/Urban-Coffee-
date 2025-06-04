// src/components/RequireAdmin.jsx
import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AdminAuthContext } from '../context/AdminAuthContext';

const RequireAdmin = ({ children }) => {
  const { adminUser, loading } = useContext(AdminAuthContext);
  const location = useLocation();

  // 如果 AdminAuthContext 里有 loading 标志
  if (loading) {
    return <div style={{ textAlign: 'center', padding: '2rem' }}>正在验证管理员权限…</div>;
  }

  // adminUser 不存在或没有管理员权限，就重定向到 /admin/login
  if (!adminUser) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // 是管理员，渲染子组件
  return children;
};

export default RequireAdmin;
