/* src/context/AuthContext.jsx */
import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/axiosConfig';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@chakra-ui/react';

export const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

const defaultUser = { id: null, email: '', name: '', avatar: '', level: 'regular', joinDate: '', addresses: [], preferences: [], notifications: { orderStatus: true, marketing: false }, token: null, isAdmin: false };

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const toast = useToast();

  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [points, setPoints] = useState(() => user?.points || 0);
  const [level, setLevel] = useState(user?.level || 'regular');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => {
    if (user) localStorage.setItem('user', JSON.stringify(user));
    else localStorage.removeItem('user');
  }, [user]);

  useEffect(() => {
    if (!user) return;
    let newLevel = 'regular';
    if (points >= 5000) newLevel = 'vip';
    else if (points >= 1000) newLevel = 'premium';
    if (newLevel !== level) setLevel(newLevel);
    setUser(prev => ({ ...prev, points, level: newLevel }));
  }, [points]);

  const updateProfile = async (profileData) => {
    if (!user) return { success: false, message: '请先登录' };
    try {
      setLoading(true);
      await api.put(`/auth/profile`, profileData);
      setUser(prev => ({ ...prev, ...profileData }));
      toast({ title: '个人信息已更新', status: 'success', duration: 2000, isClosable: true });
      setError(null);
      return { success: true, message: '个人信息已更新' };
    } catch (err) {
      const msg = err.response?.data?.message || '更新个人信息失败';
      toast({ title: '更新失败', description: msg, status: 'error', duration: 5000, isClosable: true });
      setError(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    if (!email || !password) return { success: false, message: '请输入邮箱和密码。' };
    try {
      setLoading(true);
      const { data } = await api.post('/auth/login', { email, password });
      const logged = { ...defaultUser, ...data, id: data._id, token: data.token };
      setUser(logged);
      setPoints(data.points || 0);
      setLevel(data.level || 'regular');
      toast({ title: '登录成功', status: 'success', duration: 2000, isClosable: true });
      setError(null);
      return { success: true, message: '登录成功' };
    } catch (err) {
      const msg = err.response?.data?.message || '登录失败';
      toast({ title: '登录失败', description: msg, status: 'error', duration: 5000, isClosable: true });
      setError(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setPoints(0);
    setLevel('regular');
    localStorage.removeItem('user');
    navigate('/login');
    toast({ title: '已退出登录', status: 'info', duration: 2000, isClosable: true });
  };

  const registerUser = async ({ name, email, password }) => {
    if (!name.trim() || !email.trim() || !password) return { success: false, message: '请填写姓名、邮箱和密码。' };
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email.trim())) return { success: false, message: '请输入有效邮箱。' };
    if (password.length < 6) return { success: false, message: '密码长度至少 6 位。' };
    try {
      setLoading(true);
      const { data } = await api.post('/auth/register', { name, email, password });
      const newUser = { ...defaultUser, ...data, id: data._id, token: data.token };
      setUser(newUser);
      setPoints(0);
      setLevel('regular');
      toast({ title: '注册成功，已登录！', status: 'success', duration: 2000, isClosable: true });
      setError(null);
      return { success: true, message: '注册成功，已登录！' };
    } catch (err) {
      const msg = err.response?.data?.message || '注册失败';
      toast({ title: '注册失败', description: msg, status: 'error', duration: 5000, isClosable: true });
      setError(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async ({ email, newPassword }) => {
    if (!email.trim() || !newPassword) return { success: false, message: '请输入邮箱和新密码。' };
    if (newPassword.length < 6) return { success: false, message: '新密码至少 6 位。' };
    try {
      setLoading(true);
      await api.post('/auth/reset-password', { email, newPassword });
      toast({ title: '密码已重置，请登录。', status: 'success', duration: 2000, isClosable: true });
      setError(null);
      return { success: true, message: '密码已重置，请登录。' };
    } catch (err) {
      const msg = err.response?.data?.message || '重置密码失败';
      toast({ title: '重置失败', description: msg, status: 'error', duration: 5000, isClosable: true });
      setError(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  const updatePreferences = async (newPreferences) => {/* unchanged */};
  const updateNotifications = async (newNotifications) => {/* unchanged */};
  const fetchAllUsers = async () => {/* unchanged */};
  const addAddress = addr => {/* unchanged */};
  const updateAddress = addr => {/* unchanged */};
  const removeAddress = id => {/* unchanged */};

  return (
    <AuthContext.Provider
      value={{ user, loading, error, points, level, login, logout, registerUser, resetPassword, updatePreferences, updateNotifications, fetchAllUsers, updateProfile, addAddress, updateAddress, removeAddress, allUsers }}>
      {children}
    </AuthContext.Provider>
  );
}