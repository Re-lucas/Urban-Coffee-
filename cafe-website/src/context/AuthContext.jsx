// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid'; // 用于生成用户 ID、地址 ID

/**
 * 1. 创建 Context 对象
 */
export const AuthContext = createContext();

/**
 * 2. 自定义 Hook：统一由它来获取 AuthContext 的值
 *    这样在页面里只需写 `const { login, registerUser, ... } = useAuth();`
 */
export const useAuth = () => useContext(AuthContext);

/**
 * 3. 默认空用户结构，仅在未登录时使用
 */
const defaultUser = {
  id: null,
  email: '',
  name: '',
  avatar: '',
  level: 'regular',
  joinDate: '',
  addresses: [],
  preferences: [],
  notifications: {
    orderStatus: true,
    marketing: false,
  },
};

/**
 * 4. AuthProvider：包裹全局，管理 "所有用户列表" （users）和 "当前已登录用户" （user）
 */
export function AuthProvider({ children }) {
  //
  // —— users 列表 —— 
  // 从 localStorage.users 读取所有注册过的用户；如果没有则初始化为空数组
  //
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('users');
    return saved ? JSON.parse(saved) : [];
  });

  //
  // —— 当前登录用户 —— 
  // 从 localStorage.user 恢复；如果没有则认为未登录
  //
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  //
  // —— 用户积分 和 等级 —— 
  // 分别从 localStorage.points 和 user.level 恢复
  //
  const [points, setPoints] = useState(() => {
    if (user && typeof user.points === 'number') {
      return user.points;
    }
    return 0;
  });
  const [level, setLevel] = useState(user?.level || 'regular');

  /**
   * —— 把 users 同步回 localStorage —— 
   */
  useEffect(() => {
    localStorage.setItem('users', JSON.stringify(users));
  }, [users]);

  /**
   * —— 把当前登录 user 同步回 localStorage —— 
   */
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  /**
   * —— 当 points 变化时，自动更新用户等级（level）并同步到 user & users 列表 —— 
   */
  useEffect(() => {
    if (!user) return;

    // 1. 根据积分阈值决定新等级
    let newLevel = 'regular';
    if (points >= 5000) newLevel = 'vip';
    else if (points >= 1000) newLevel = 'premium';

    // 2. 如果等级有变，则更新 state
    if (newLevel !== level) {
      setLevel(newLevel);
    }

    // 3. 构造 updatedUser，将最新积分（points）和等级（newLevel）写入
    const updatedUser = {
      ...user,
      points: points,
      level: newLevel,
    };

    // 4. 更新当前 user
    setUser(updatedUser);

    // 5. 将 updatedUser 同步回 users 列表对应条目
    setUsers((prev) =>
      prev.map((u) => (u.id === updatedUser.id ? updatedUser : u))
    );
  }, [points]);

  /**
   * —— login(email, password)：校验并登录 —— 
   * 返回 { success: boolean, message: string }
   */
  const login = (email, password) => {
    if (!email || !password) {
      return { success: false, message: '请输入邮箱和密码。' };
    }
    const matched = users.find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase()
    );
    if (!matched) {
      return { success: false, message: '该邮箱尚未注册，请先注册。' };
    }
    if (matched.password !== password) {
      return { success: false, message: '密码错误，请重试。' };
    }
    // 登录成功：初始化 user/points/level
    setUser(matched);
    setPoints(matched.points || 0);
    setLevel(matched.level || 'regular');
    return { success: true, message: '登录成功！' };
  };

  /**
   * —— logout()：登出当前用户 —— 
   */
  const logout = () => {
    setUser(null);
    setPoints(0);
    setLevel('regular');
    // localStorage.user 会在上层 useEffect 里被移除
  };

  /**
   * —— registerUser({ name, email, password })：注册并直接登录 —— 
   *  返回 { success: boolean, message: string }
   */
  const registerUser = ({ name, email, password }) => {
    // 1. 基本校验
    if (!name.trim() || !email.trim() || !password) {
      return { success: false, message: '请填写姓名、邮箱和密码。' };
    }
    // 简单邮箱正则
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email.trim())) {
      return { success: false, message: '请输入有效邮箱。' };
    }
    if (password.length < 6) {
      return { success: false, message: '密码长度至少 6 位。' };
    }
    // 2. 检查邮箱是否已被注册
    const exists = users.find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase()
    );
    if (exists) {
      return { success: false, message: '该邮箱已注册，请直接登录或换一个邮箱。' };
    }
    // 3. 构造新用户对象
    const newUser = {
      id: uuidv4(),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      avatar: '',
      level: 'regular',
      joinDate: new Date().toISOString(),
      points: 0,
      password: password, // 仅演示。生产环境应先哈希后存储
      addresses: [],
      preferences: [],
      notifications: {
        orderStatus: true,
        marketing: false,
      },
    };
    // 4. 将新用户写入 users 列表
    setUsers((prev) => [newUser, ...prev]);
    // 5. 立即登录该用户
    setUser(newUser);
    setPoints(0);
    setLevel('regular');
    return { success: true, message: '注册成功！已自动登录。' };
  };

  /**
   * —— resetPassword({ email, newPassword })：前端模拟"忘记密码" —— 
   * 返回 { success: boolean, message: string }
   */
  const resetPassword = ({ email, newPassword }) => {
    if (!email.trim() || !newPassword) {
      return { success: false, message: '请输入邮箱和新密码。' };
    }
    if (newPassword.length < 6) {
      return { success: false, message: '新密码长度至少 6 位。' };
    }
    const matched = users.find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase()
    );
    if (!matched) {
      return { success: false, message: '该邮箱尚未注册，无法重置。' };
    }
    // 更新该用户的密码字段
    const updatedUser = { ...matched, password: newPassword };
    setUsers((prev) =>
      prev.map((u) => (u.id === updatedUser.id ? updatedUser : u))
    );
    // 如果已登录的是同一用户，也同步更新 user
    if (user && user.id === updatedUser.id) {
      setUser(updatedUser);
    }
    return { success: true, message: '密码已重置，请使用新密码登录。' };
  };

  /**
   * —— 以下是"积分"、"更新资料"、"地址"、"偏好"、"通知" 等原逻辑 —— 
   *     都是针对当前登录 user 做更新，并同步回 users 列表
   */

  // 给当前登录用户累加积分
  const addPoints = (amount) => {
    if (!user) return;
    setPoints((prev) => prev + amount);
    // useEffect 会自动同步回 user & users
  };

  // 更新当前用户基本资料（昵称、头像等）
  const updateProfile = (updates) => {
    if (!user) return;
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    setUsers((prev) =>
      prev.map((u) => (u.id === updatedUser.id ? updatedUser : u))
    );
  };

  // 地址相关操作：增/改/删
  const addAddress = (addressObj) => {
    if (!user) return;
    const newAddr = { ...addressObj, id: uuidv4() };
    const updatedAddresses = [...(user.addresses || []), newAddr];
    const updatedUser = { ...user, addresses: updatedAddresses };
    setUser(updatedUser);
    setUsers((prev) =>
      prev.map((u) => (u.id === updatedUser.id ? updatedUser : u))
    );
  };
  const updateAddress = (addressObj) => {
    if (!user) return;
    const updatedAddresses = (user.addresses || []).map((addr) =>
      addr.id === addressObj.id ? { ...addressObj } : addr
    );
    const updatedUser = { ...user, addresses: updatedAddresses };
    setUser(updatedUser);
    setUsers((prev) =>
      prev.map((u) => (u.id === updatedUser.id ? updatedUser : u))
    );
  };
  const removeAddress = (addrId) => {
    if (!user) return;
    const updatedAddresses = (user.addresses || []).filter(
      (addr) => addr.id !== addrId
    );
    const updatedUser = { ...user, addresses: updatedAddresses };
    setUser(updatedUser);
    setUsers((prev) =>
      prev.map((u) => (u.id === updatedUser.id ? updatedUser : u))
    );
  };

  // 更新口味偏好
  const updatePreferences = (newPrefs) => {
    if (!user) return;
    const updatedUser = { ...user, preferences: newPrefs };
    setUser(updatedUser);
    setUsers((prev) =>
      prev.map((u) => (u.id === updatedUser.id ? updatedUser : u))
    );
  };

  // 更新通知设置
  const updateNotifications = (newSettings) => {
    if (!user) return;
    const updatedUser = { ...user, notifications: newSettings };
    setUser(updatedUser);
    setUsers((prev) =>
      prev.map((u) => (u.id === updatedUser.id ? updatedUser : u))
    );
  };

  /**
   * —— 将所有状态和方法通过 Context 暴露给子组件 —— 
   */
  return (
    <AuthContext.Provider
      value={{
        user,                 // 当前登录用户对象，或 null
        users,                // 全局所有注册用户列表（仅供调试查看）
        login,                // 登录
        logout,               // 登出
        registerUser,         // 注册并直接登录
        resetPassword,        // 重置密码
        points,               // 当前用户积分
        level,                // 当前用户等级
        addPoints,            // 累加积分
        updateProfile,        // 更新用户资料
        addAddress,           // 新增地址
        updateAddress,        // 修改地址
        removeAddress,        // 删除地址
        updatePreferences,    // 更新口味偏好
        updateNotifications,  // 更新通知设置
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}