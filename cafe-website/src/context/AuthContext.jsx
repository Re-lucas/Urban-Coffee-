// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid'; // 用于生成地址/用户 ID，可 npm install uuid

// 1. 创建 Context
export const AuthContext = createContext();

// 2. 定义默认的空用户结构，方便初始化时赋值
const defaultUser = {
  id: null,
  email: '',
  name: '',
  avatar: '',     // 头像 URL (Base64 或 Object URL)
  level: 'regular',
  joinDate: '',

  // 扩展信息
  addresses: [],  // 地址数组
  preferences: [],// 偏好口味，如 ['果香', '花香']
  notifications: {
    orderStatus: true,   // 订单状态通知
    marketing: false,    // 营销消息通知
  },
};

export function AuthProvider({ children }) {
  // 3. 从 localStorage 读取 user 数据（包含扩展字段）
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [points, setPoints] = useState(() => {
    return parseInt(localStorage.getItem('points') || '0');
  });

  const [level, setLevel] = useState(user?.level || 'regular');

  // 4. login: 接受 email/password，构造一个新的 user 对象，并写入 localStorage
  const login = (email, password) => {
    // 这里只做演示：真实项目要去服务器验证
    if (!email || !password) return false;

    // 构造默认用户信息
    const newUser = {
      id: uuidv4(),
      email: email,
      name: email.split('@')[0],         // 默认昵称取邮箱前缀
      avatar: '',                         // 默认留空
      level: 'regular',
      joinDate: new Date().toISOString(),

      // 扩展初始化
      addresses: [],
      preferences: [],
      notifications: {
        orderStatus: true,
        marketing: false,
      },
    };

    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));

    // 初始积分为 0
    setPoints(0);
    localStorage.setItem('points', '0');

    setLevel('regular');
    return true;
  };

  // 5. logout: 清空 user 及相关字段
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');

    setPoints(0);
    localStorage.removeItem('points');

    setLevel('regular');
  };

  // 6. addPoints: 在原有基础上累加积分，并更新用户等级
  const addPoints = (amount) => {
    setPoints((prev) => {
      const newPoints = prev + amount;
      localStorage.setItem('points', String(newPoints));
      return newPoints;
    });
  };

  // 7. 当 points 变化时，自动调整等级并同步到 user 对象和 localStorage
  useEffect(() => {
    if (!user) return;
    let newLevel = 'regular';
    if (points >= 5000) newLevel = 'vip';
    else if (points >= 1000) newLevel = 'premium';

    if (newLevel !== level) {
      setLevel(newLevel);
      // 同步到 user 对象
      const updatedUser = { ...user, level: newLevel };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  }, [points]);

  // 8. 更新用户基本资料（昵称、头像）
  const updateProfile = (updates) => {
    if (!user) return;
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  // 9. 地址相关操作
  const addAddress = (addressObj) => {
    if (!user) return;
    const newAddress = { ...addressObj, id: uuidv4() };
    const updatedAddresses = [...(user.addresses || []), newAddress];
    const updatedUser = { ...user, addresses: updatedAddresses };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };
  const updateAddress = (addressObj) => {
    if (!user) return;
    const updatedAddresses = (user.addresses || []).map((addr) =>
      addr.id === addressObj.id ? { ...addressObj } : addr
    );
    const updatedUser = { ...user, addresses: updatedAddresses };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };
  const removeAddress = (addressId) => {
    if (!user) return;
    const updatedAddresses = (user.addresses || []).filter((addr) => addr.id !== addressId);
    const updatedUser = { ...user, addresses: updatedAddresses };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  // 10. 偏好设置 (口味标签)
  const updatePreferences = (newPrefs) => {
    if (!user) return;
    const updatedUser = { ...user, preferences: newPrefs };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  // 11. 通知设置
  const updateNotifications = (newSettings) => {
    if (!user) return;
    const updatedUser = { ...user, notifications: newSettings };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  // 12. 把所有方法和数据暴露给下游 Consumer
  return (
    <AuthContext.Provider
      value={{
        user,
        points,
        level,
        login,
        logout,
        addPoints,
        updateProfile,
        addAddress,
        updateAddress,
        removeAddress,
        updatePreferences,
        updateNotifications,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
