// src/context/AdminAuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

/**
 * 管理员上下文：仅用于后台管理员登录/登出，不跟普通用户混在一起
 */
export const AdminAuthContext = createContext();
export const useAdminAuth = () => useContext(AdminAuthContext);

/**
 * 在 localStorage 用 "adminUsers" 存储所有管理员账号（示例中仅保留一个或两三个硬编码示例）
 * 格式如下：
 * [
 *   { id: 'uuid-1', email: 'admin@yourshop.com', password: 'admin123' },
 *   { id: 'uuid-2', email: 'manager@yourshop.com', password: 'mgr456' }
 * ]
 */
const defaultAdmins = [
  {
    id: uuidv4(), 
    email: 'admin@yourshop.com',
    password: 'admin123'
  },
  // 你可以再加更多管理员
];

export function AdminAuthProvider({ children }) {
  /**
   * 1. admins：所有可用管理员账号（从 localStorage 恢复或初始化为 defaultAdmins）
   */
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

  /**
   * 2. 当前已登录的管理员信息
   */
  const [adminUser, setAdminUser] = useState(() => {
    const saved = localStorage.getItem('adminUser');
    return saved ? JSON.parse(saved) : null;
  });

  /**
   * 同步 admins 到 localStorage
   */
  useEffect(() => {
    localStorage.setItem('adminUsers', JSON.stringify(admins));
  }, [admins]);

  /**
   * 同步当前 adminUser 到 localStorage
   */
  useEffect(() => {
    if (adminUser) {
      localStorage.setItem('adminUser', JSON.stringify(adminUser));
    } else {
      localStorage.removeItem('adminUser');
    }
  }, [adminUser]);

  /**
   * —— 管理员登录函数 —— 
   * @param {string} email 
   * @param {string} password 
   * @returns { success: boolean, message: string }
   */
  const loginAdmin = (email, password) => {
    if (!email || !password) {
      return { success: false, message: '请输入管理员邮箱和密码。' };
    }
    // 在 admins 列表里查找
    const matched = admins.find(
      (a) => a.email.toLowerCase() === email.trim().toLowerCase()
    );
    if (!matched) {
      return { success: false, message: '该管理员邮箱不存在。' };
    }
    if (matched.password !== password) {
      return { success: false, message: '密码错误，请重试。' };
    }
    // 登录成功
    setAdminUser(matched);
    return { success: true, message: '管理员登录成功。' };
  };

  /**
   * —— 管理员登出 —— 
   */
  const logoutAdmin = () => {
    setAdminUser(null);
  };

  /**
   * —— （可选）新增一个管理员账号 —— 
   * 真实项目里，前端不会这样做，请通过后端接口
   */
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
        admins,           // 所有管理员账号（仅调试用）
        adminUser,        // 当前登录的管理员对象，或 null
        loginAdmin,       // 管理员登录方法
        logoutAdmin,      // 管理员登出
        registerAdmin,    // 新增管理员账号（可选）
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}
