// src/utils/axiosConfig.js
import axios from 'axios';

console.log("[DEBUG] VITE_API_BASE_URL:", import.meta.env.VITE_API_BASE_URL); // 新增此行

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL + '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器：如果 localStorage 里有 user.token，就自动带上 Authorization 头
api.interceptors.request.use(
  (config) => {
    // 修改这里：从 'user' 而不是 'userInfo' 读取
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        if (user && user.token) {
          config.headers.Authorization = `Bearer ${user.token}`;
          console.log('[AXIOS] 添加了 Authorization 头'); // 调试信息
        }
      } catch (e) {
        console.error('解析 localStorage 中的 user 失败', e);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
