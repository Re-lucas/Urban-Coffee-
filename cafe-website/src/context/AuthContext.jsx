// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import api from '../utils/axiosConfig';
import { useNavigate } from 'react-router-dom';

/**
 * 1. 创建 Context 对象
 */
export const AuthContext = createContext();

/**
 * 2. 自定义 Hook：统一由它来获取 AuthContext 的值
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
  token: null,
  isAdmin: false,
};

/**
 * 4. AuthProvider：包裹全局，管理当前已登录用户
 */
export function AuthProvider({ children }) {
  const navigate = useNavigate();
  
  // 当前登录用户
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  // 用户积分和等级
  const [points, setPoints] = useState(() => user?.points || 0);
  const [level, setLevel] = useState(user?.level || 'regular');
  
  // 加载和错误状态
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
   * —— 当 points 变化时，自动更新用户等级（level）并同步到 user —— 
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
  }, [points]);

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
        login,
        logout,
        registerUser,
        resetPassword,
        points,
        level,
        // 保留其他方法...
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}