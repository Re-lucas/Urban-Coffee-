// context/AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  
  const [points, setPoints] = useState(() => {
    return parseInt(localStorage.getItem('points') || '0');
  });
  
  const [level, setLevel] = useState('regular');

  useEffect(() => {
    // 更新会员等级
    let newLevel = 'regular';
    if (points >= 5000) newLevel = 'vip';
    else if (points >= 1000) newLevel = 'premium';
    
    setLevel(newLevel);
    
    if (user) {
      const updatedUser = { ...user, level: newLevel };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  }, [points]);

  const login = (email, password) => {
    // 模拟登录
    const userData = {
      id: `user_${Date.now()}`,
      email,
      name: email.split('@')[0],
      level,
      joinDate: new Date().toISOString()
    };
    
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const addPoints = (amount) => {
    const newPoints = points + amount;
    setPoints(newPoints);
    localStorage.setItem('points', newPoints.toString());
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      points, 
      level, 
      login, 
      logout, 
      addPoints 
    }}>
      {children}
    </AuthContext.Provider>
  );
}