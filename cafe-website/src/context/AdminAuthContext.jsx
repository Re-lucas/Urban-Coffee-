// src/context/AdminAuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

export const AdminAuthContext = createContext();
export const useAdminAuth = () => useContext(AdminAuthContext);

const defaultAdmins = [
  {
    id: uuidv4(),
    email: 'admin@yourshop.com',
    password: 'admin123',
  },
  // 如果需要，可以继续添加更多管理员
];

export function AdminAuthProvider({ children }) {
  // 管理员列表，优先从 localStorage 里读取
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

  // 当前登录的管理员
  const [adminUser, setAdminUser] = useState(() => {
    const saved = localStorage.getItem('adminUser');
    return saved ? JSON.parse(saved) : null;
  });

  // 判断是否正在初始化
  const [loading, setLoading] = useState(true);

  // 当 admins 改变时，保持到 localStorage
  useEffect(() => {
    localStorage.setItem('adminUsers', JSON.stringify(admins));
  }, [admins]);

  // 当 adminUser 改变时，保持到 localStorage 或移除
  useEffect(() => {
    if (adminUser) {
      localStorage.setItem('adminUser', JSON.stringify(adminUser));
    } else {
      localStorage.removeItem('adminUser');
    }
  }, [adminUser]);

  // 模拟异步加载管理员状态的过程
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500); // 0.5s 后初始化完成
    return () => clearTimeout(timer);
  }, []);

  // 管理员登录方法
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

  // 管理员注销
  const logoutAdmin = () => {
    setAdminUser(null);
  };

  // 新增管理员
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
      password,
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
