// src/main.jsx 或 src/index.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// React Router 的 BrowserRouter
import { BrowserRouter } from 'react-router-dom';

// 各种 Context 的 Provider
import { AdminAuthProvider } from './context/AdminAuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { OrderProvider } from './context/OrderContext';
import { ReviewProvider } from './context/ReviewContext';
import { WishlistProvider } from './context/WishlistContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* 最外层只需要一个 BrowserRouter */}
    <BrowserRouter>
      {/* 管理员登录上下文 */}
      <AdminAuthProvider>
        {/* 主题上下文 */}
        <ThemeProvider>
          {/* 普通用户登录/注册/个人信息上下文 */}
          <AuthProvider>
              {/* 购物车上下文 */}
              <CartProvider>
                {/* 订单上下文 */}
                <OrderProvider>
                  {/* 评论/打分上下文 */}
                  <ReviewProvider>
                    {/* ✨ 此处包裹 WishlistProvider ✨ */}
                    <WishlistProvider>
                      {/* App 内部就可以使用 useWishlist() 了 */}
                      <App />
                    </WishlistProvider>
                  </ReviewProvider>
                </OrderProvider>
              </CartProvider>
          </AuthProvider>
        </ThemeProvider>
      </AdminAuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
