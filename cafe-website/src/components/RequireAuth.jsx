// src/components/RequireAuth.jsx
import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const RequireAuth = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  // 如果 AuthContext 里有一个 loading 标志，表示正在异步获取登录状态
  // 这里可根据你自己的 AuthContext 实现调整：如果没有 loading，可删掉下面这段
  if (loading) {
    // 你可以换成任何加载组件
    return <div style={{ textAlign: 'center', padding: '2rem' }}>验证中…</div>;
  }

  // 如果 user 不存在，说明未登录，跳转到 /login，并把当前页面路径存在 state
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 已登录，直接渲染子组件
  return children;
};

export default RequireAuth;
