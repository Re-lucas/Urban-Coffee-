// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import api from '../utils/axiosConfig';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();
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
  token: null,
  isAdmin: false,
};

/**
 * 4. AuthProvider：包裹全局，管理当前已登录用户
 */
export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [points, setPoints] = useState(() => user?.points || 0);
  const [level, setLevel] = useState(user?.level || 'regular');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [allUsers, setAllUsers] = useState([]);

  // 把 user 存到 localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  // 根据积分自动更新等级等逻辑（你原来的）
  useEffect(() => {
    if (!user) return;
    let newLevel = 'regular';
    if (points >= 5000) newLevel = 'vip';
    else if (points >= 1000) newLevel = 'premium';
    if (newLevel !== level) {
      setLevel(newLevel);
    }
    const updatedUser = {
      ...user,
      points: points,
      level: newLevel,
    };
    setUser(updatedUser);
  }, [points]);

    /** —— 新增：更新“通知设置” —— */
  const updateNotifications = async (newNotifSettings) => {
    if (!user) {
      setError('请先登录');
      return { success: false, message: '请先登录' };
    }
    try {
      setLoading(true);

      // 如果你想同步到后端，可在这里调用 API，比如：
      // await api.put(`/users/${user.id}/notifications`, { notifications: newNotifSettings });
      // （前提：后端要有对应接口，这里假设暂时只在前端 localStorage 保存即可）

      // 只是在本地更新 user 对象：
      const updatedUser = {
        ...user,
        notifications: newNotifSettings,
      };
      setUser(updatedUser);
      setError(null);
      return { success: true, message: '通知设置已更新' };
    } catch (err) {
      const errorMsg = err.response?.data?.message || '更新通知设置失败';
      setError(errorMsg);
      return { success: false, message: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  /** —— 原有的：更新“口味偏好” —— */
  const updatePreferences = async (newPreferences) => {
    if (!user) {
      setError('请先登录');
      return { success: false, message: '请先登录' };
    }
    try {
      setLoading(true);
      // 可以同步到后端，也可以只保存在 user 对象里
      // const { data } = await api.put(`/users/${user.id}/preferences`, { preferences: newPreferences });
      const updatedUser = {
        ...user,
        preferences: newPreferences,
      };
      setUser(updatedUser);
      setError(null);
      return { success: true, message: '偏好已更新' };
    } catch (err) {
      const errorMsg = err.response?.data?.message || '更新偏好失败';
      setError(errorMsg);
      return { success: false, message: errorMsg };
    } finally {
      setLoading(false);
    }
  };

    // 新增：获取所有用户（仅管理员可用）
  const fetchAllUsers = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/users');
      setAllUsers(data);
      return data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || '获取用户列表失败';
      setError(errorMsg);
      return [];
    } finally {
      setLoading(false);
    }
  };

  /**
   * —— login(email, password)：校验并登录 —— 
   * 返回 { success: boolean, message: string }
   */
  const login = async (email, password) => {
    if (!email || !password) {
      return { success: false, message: '请输入邮箱和密码。' };
    }

    try {
      setLoading(true);
      const { data } = await api.post('/auth/login', { email, password });
      
      // 将后端数据与前端默认结构合并
      const loggedInUser = {
        ...defaultUser,
        ...data,
        id: data._id,
        token: data.token,
      };
      
      setUser(loggedInUser);
      setPoints(data.points || 0);
      setLevel(data.level || 'regular');
      setError(null);
      
      return { success: true, message: '登录成功！' };
    } catch (err) {
      const errorMsg = err.response?.data?.message || '登录失败，请重试';
      setError(errorMsg);
      return { success: false, message: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  /**
   * —— logout()：登出当前用户 —— 
   */
  const logout = () => {
    setUser(null);
    setPoints(0);
    setLevel('regular');
    localStorage.removeItem('user');
    navigate('/login');
  };

  /**
   * —— registerUser({ name, email, password })：注册并直接登录 —— 
   *  返回 { success: boolean, message: string }
   */
  const registerUser = async ({ name, email, password }) => {
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

    try {
      setLoading(true);
      const { data } = await api.post('/auth/register', { name, email, password });
      
      // 将后端数据与前端默认结构合并
      const newUser = {
        ...defaultUser,
        ...data,
        id: data._id,
        token: data.token,
      };
      
      setUser(newUser);
      setPoints(0);
      setLevel('regular');
      setError(null);
      
      return { success: true, message: '注册成功！已自动登录。' };
    } catch (err) {
      const errorMsg = err.response?.data?.message || '注册失败，请重试';
      setError(errorMsg);
      return { success: false, message: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  /**
   * —— resetPassword({ email, newPassword })：重置密码 —— 
   * 返回 { success: boolean, message: string }
   */
  const resetPassword = async ({ email, newPassword }) => {
    if (!email.trim() || !newPassword) {
      return { success: false, message: '请输入邮箱和新密码。' };
    }
    
    if (newPassword.length < 6) {
      return { success: false, message: '新密码长度至少 6 位。' };
    }

    try {
      setLoading(true);
      await api.post('/auth/reset-password', { email, newPassword });
      setError(null);
      
      // 如果当前登录用户是重置密码的用户，更新本地状态
      if (user && user.email === email) {
        const updatedUser = { ...user };
        setUser(updatedUser);
      }
      
      return { success: true, message: '密码已重置，请使用新密码登录。' };
    } catch (err) {
      const errorMsg = err.response?.data?.message || '密码重置失败';
      setError(errorMsg);
      return { success: false, message: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  // 其他用户相关操作保持不变（积分、地址、偏好等）...

  /**
   * —— 将所有状态和方法通过 Context 暴露给子组件 —— 
   */
  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        points,
        level,
        // … 这里把所有方法都暴露出来
        login: async (email, password) => { /* 你的登录逻辑 */ },
        logout: () => {
          setUser(null);
          setPoints(0);
          setLevel('regular');
          localStorage.removeItem('user');
          navigate('/login');
        },
        registerUser: async ({ name, email, password }) => { /* 你的注册逻辑 */ },
        resetPassword: async ({ email, newPassword }) => { /* 你的重置密码逻辑 */ },
        updatePreferences,      // 暴露“更新偏好”功能
        updateNotifications,    // 暴露“更新通知”功能
        fetchAllUsers: async () => { /* 获取所有用户 */ },
        // 如果你有 updateProfile、addAddress、updateAddress、removeAddress 这些，也一并暴露：
        updateProfile: async (profileData) => { /* 更新头像、昵称等 */ },
        addAddress: (addr) => { /* … */ },
        updateAddress: (addr) => { /* … */ },
        removeAddress: (id) => { /* … */ },
        allUsers,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}