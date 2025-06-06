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
  // 如果需要，可以继续写更多管理员账户
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

  // 当前登录的管理员
  const [adminUser, setAdminUser] = useState(() => {
    const saved = localStorage.getItem('adminUser');
    return saved ? JSON.parse(saved) : null;
  });

  // 用一个 loading 状态模拟异步校验
  const [loading, setLoading] = useState(true);

  // 每次 admins 改变，都同步到 localStorage
  useEffect(() => {
    localStorage.setItem('adminUsers', JSON.stringify(admins));
  }, [admins]);

  // 每次 adminUser 改变，都同步到 localStorage 或移除
  useEffect(() => {
    if (adminUser) {
      localStorage.setItem('adminUser', JSON.stringify(adminUser));
    } else {
      localStorage.removeItem('adminUser');
    }
  }, [adminUser]);

  // 模拟初始化时异步检查管理员登录态
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500); // 假设 500ms 后初始化完毕
    return () => clearTimeout(timer);
  }, []);

  // 登录管理员：校验邮箱 / 密码
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

  // 注销管理员
  const logoutAdmin = () => {
    setAdminUser(null);
  };

  // 注册新管理员
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
