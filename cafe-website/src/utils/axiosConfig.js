// src/utils/axiosConfig.js
import axios from 'axios';

console.log("[DEBUG] VITE_API_BASE_URL:", import.meta.env.VITE_API_BASE_URL); // 新增此行

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL + '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器：如果 localStorage 里有 userInfo.token，就自动带上 Authorization 头
api.interceptors.request.use(
  (config) => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (userInfo && userInfo.token) {
      config.headers.Authorization = `Bearer ${userInfo.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
