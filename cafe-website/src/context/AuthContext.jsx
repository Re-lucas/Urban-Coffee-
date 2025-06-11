// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/axiosConfig';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

// 默认空用户结构
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

export function AuthProvider({ children }) {
  const navigate = useNavigate();

  // 从 localStorage 读取已登录用户
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [points, setPoints] = useState(() => user?.points || 0);
  const [level, setLevel] = useState(user?.level || 'regular');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [allUsers, setAllUsers] = useState([]);

  // 把 user 保持到 localStorage
  useEffect(() => {
    if (user) localStorage.setItem('user', JSON.stringify(user));
    else localStorage.removeItem('user');
  }, [user]);

  // 根据 points 自动调整 level 并同步到 user
  useEffect(() => {
    if (!user) return;
    let newLevel = 'regular';
    if (points >= 5000) newLevel = 'vip';
    else if (points >= 1000) newLevel = 'premium';
    if (newLevel !== level) setLevel(newLevel);
    setUser(prev => ({ ...prev, points, level: newLevel }));
  }, [points]);

  // —— 实现：更新用户个人资料（头像、昵称等） —— 
  const updateProfile = async (profileData) => {
    if (!user) {
      setError('请先登录');
      return { success: false, message: '请先登录' };
    }
    try {
      setLoading(true);
      const { data } = await api.put(`/auth/profile`, profileData);
      setUser(prev => ({ ...prev, ...profileData }));
      setError(null);
      return { success: true, message: '个人信息已更新' };
    } catch (err) {
      const msg = err.response?.data?.message || '更新个人信息失败';
      setError(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  // —— 实现：新增地址 —— 
  const addAddress = (addr) => {
    setUser(prev => ({
      ...prev,
      addresses: [...(prev.addresses || []), addr]
    }));
  };

  // —— 实现：编辑地址 —— 
  const updateAddress = (addr) => {
    setUser(prev => ({
      ...prev,
      addresses: prev.addresses.map(a =>
        a.id === addr.id ? addr : a
      )
    }));
  };

  // —— 实现：删除地址 —— 
  const removeAddress = (id) => {
    setUser(prev => ({
      ...prev,
      addresses: prev.addresses.filter(a => a.id !== id)
    }));
  };

  // —— 已有：更新通知设置 —— 
  const updateNotifications = async (newNotifications) => {
    if (!user) {
      setError('请先登录');
      return { success: false, message: '请先登录' };
    }
    try {
      setLoading(true);
      // 同步到后端
      const { data } = await api.put(
        `/users/${user.id}/preferences`,
        { notifications: newNotifications }
      );
      setUser(prev => ({ ...prev, notifications: data.notifications }));
      setError(null);
      return { success: true, message: '通知设置已更新' };
    } catch (err) {
      const msg = err.response?.data?.message || '更新通知失败';
      setError(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  // —— 已有：更新口味偏好 —— 
  const updatePreferences = async (newPreferences) => {
    if (!user) {
      setError('请先登录');
      return { success: false, message: '请先登录' };
    }
    try {
      setLoading(true);
      // 同步到后端
      const { data } = await api.put(
        `/users/${user._id}/preferences`,
        { preferences: newPreferences }      );
      // 后端返回 { success, message, preferences, notifications }
      setUser(prev => ({ ...prev, preferences: data.preferences }));
      setError(null);
      return { success: true, message: '偏好已更新' };
    } catch (err) {
      const msg = err.response?.data?.message || '更新偏好失败';
      setError(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  // —— 已有：获取所有用户（仅管理员能用） —— 
  const fetchAllUsers = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/users');
      setAllUsers(data);
      return data;
    } catch (err) {
      const msg = err.response?.data?.message || '获取用户列表失败';
      setError(msg);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // —— 登录 —— 
  const login = async (email, password) => {
    if (!email || !password) {
      return { success: false, message: '请输入邮箱和密码。' };
    }
    try {
      setLoading(true);
      const { data } = await api.post('/auth/login', { email, password });
      const logged = {
        ...defaultUser,
        ...data,
        id: data._id,
        token: data.token,
      };
      setUser(logged);
      setPoints(data.points || 0);
      setLevel(data.level || 'regular');
      setError(null);
      return { success: true, message: '登录成功' };
    } catch (err) {
      const msg = err.response?.data?.message || '登录失败';
      setError(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  // —— 登出 —— 
  const logout = () => {
    setUser(null);
    setPoints(0);
    setLevel('regular');
    localStorage.removeItem('user');
    navigate('/login');
  };

  // —— 注册并登录 —— 
  const registerUser = async ({ name, email, password }) => {
    // 基本校验
    if (!name.trim() || !email.trim() || !password) {
      return { success: false, message: '请填写姓名、邮箱和密码。' };
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email.trim())) {
      return { success: false, message: '请输入有效邮箱。' };
    }
    if (password.length < 6) {
      return { success: false, message: '密码长度至少 6 位。' };
    }
    try {
      setLoading(true);
      const { data } = await api.post('/auth/register', {
        name, email, password
      });
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
      return { success: true, message: '注册成功，已登录！' };
    } catch (err) {
      const msg = err.response?.data?.message || '注册失败';
      setError(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  // —— 重置密码 —— 
  const resetPassword = async ({ email, newPassword }) => {
    if (!email.trim() || !newPassword) {
      return { success: false, message: '请输入邮箱和新密码。' };
    }
    if (newPassword.length < 6) {
      return { success: false, message: '新密码至少 6 位。' };
    }
    try {
      setLoading(true);
      await api.post('/auth/reset-password', { email, newPassword });
      setError(null);
      return { success: true, message: '密码已重置，请登录。' };
    } catch (err) {
      const msg = err.response?.data?.message || '重置密码失败';
      setError(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        points,
        level,
        login,
        logout,
        registerUser,
        resetPassword,
        updatePreferences,
        updateNotifications,
        fetchAllUsers,
        updateProfile,
        addAddress,
        updateAddress,
        removeAddress,
        allUsers,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
