// src/context/AdminAuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/axiosConfig';

export const AdminAuthContext = createContext();
export const useAdminAuth = () => useContext(AdminAuthContext);

export function AdminAuthProvider({ children }) {
  // 从 localStorage 初始化 adminUser 和 token
  const [adminUser, setAdminUser] = useState(() => {
    const saved = localStorage.getItem('adminUser');
    const token = localStorage.getItem('adminToken');
    if (saved && token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      return JSON.parse(saved);
    }
    return null;
  });

  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  // 当 adminUser 变动时，同步 localStorage & axios header
  useEffect(() => {
    if (adminUser) {
      localStorage.setItem('adminUser', JSON.stringify(adminUser));
      // token 已经在 loginAdmin 中写入
    } else {
      localStorage.removeItem('adminUser');
      localStorage.removeItem('adminToken');
      delete api.defaults.headers.common['Authorization'];
    }
  }, [adminUser]);

  // 结束初始化 loading
  useEffect(() => setLoading(false), []);

  /**
   * 调用后端 /api/admin/login，获取 JWT 并存储
   */
  const loginAdmin = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.post('/admin/login', { email, password });
      // 存 token & admin info
      localStorage.setItem('adminToken', data.token);
      localStorage.setItem('adminUser', JSON.stringify(data.admin));
      api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      setAdminUser(data.admin);
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || '登录失败';
      setError(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  /**
   * 注销：清空状态 & localStorage & header
   */
  const logoutAdmin = () => {
    setAdminUser(null);
  };

  return (
    <AdminAuthContext.Provider
      value={{
        adminUser,
        loading,
        error,
        loginAdmin,
        logoutAdmin,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}
