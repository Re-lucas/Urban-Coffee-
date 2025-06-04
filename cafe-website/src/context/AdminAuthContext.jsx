// src/context/AdminAuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

export const AdminAuthContext = createContext();
export const useAdminAuth = () => useContext(AdminAuthContext);

const defaultAdmins = [
  {
    id: uuidv4(), 
    email: 'admin@yourshop.com',
    password: 'admin123'
  },
  // 你可以再加更多管理员
];

export function AdminAuthProvider({ children }) {
  const [admins, setAdmins] = useState(() => {
    const saved = localStorage.getItem('adminUsers');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return defaultAdmins;
      }
    }
    return defaultAdmins;
  });

  const [adminUser, setAdminUser] = useState(() => {
    const saved = localStorage.getItem('adminUser');
    return saved ? JSON.parse(saved) : null;
  });

  const [loading, setLoading] = useState(true);

  // 同步 admins 到 localStorage
  useEffect(() => {
    localStorage.setItem('adminUsers', JSON.stringify(admins));
  }, [admins]);

  // 同步当前 adminUser 到 localStorage
  useEffect(() => {
    if (adminUser) {
      localStorage.setItem('adminUser', JSON.stringify(adminUser));
    } else {
      localStorage.removeItem('adminUser');
    }
  }, [adminUser]);

  // 初始化加载时设置 loading 状态
  useEffect(() => {
    // 模拟异步检查过程
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  const loginAdmin = (email, password) => {
    if (!email || !password) {
      return { success: false, message: '请输入管理员邮箱和密码。' };
    }
    const matched = admins.find(
      (a) => a.email.toLowerCase() === email.trim().toLowerCase()
    );
    if (!matched) {
      return { success: false, message: '该管理员邮箱不存在。' };
    }
    if (matched.password !== password) {
      return { success: false, message: '密码错误，请重试。' };
    }
    setAdminUser(matched);
    return { success: true, message: '管理员登录成功。' };
  };

  const logoutAdmin = () => {
    setAdminUser(null);
  };

  const registerAdmin = ({ email, password }) => {
    if (!email.trim() || !password) {
      return { success: false, message: '请输入邮箱和密码。' };
    }
    const exists = admins.find(
      (a) => a.email.toLowerCase() === email.trim().toLowerCase()
    );
    if (exists) {
      return { success: false, message: '该管理员邮箱已存在。' };
    }
    const newAdmin = {
      id: uuidv4(),
      email: email.trim().toLowerCase(),
      password
    };
    setAdmins((prev) => [newAdmin, ...prev]);
    return { success: true, message: '管理员账号创建成功。' };
  };

  return (
    <AdminAuthContext.Provider
      value={{
        admins,
        adminUser,
        loading,
        loginAdmin,
        logoutAdmin,
        registerAdmin,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}