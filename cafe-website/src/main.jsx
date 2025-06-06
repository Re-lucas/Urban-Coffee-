// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';

import { AdminAuthProvider } from './context/AdminAuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { OrderProvider } from './context/OrderContext';
import { ReviewProvider } from './context/ReviewContext';
import { WishlistProvider } from './context/WishlistContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      {/* 管理后台认证上下文 */}
      <AdminAuthProvider>
        {/* 主题上下文 */}
        <ThemeProvider>
          {/* 普通用户认证上下文 */}
          <AuthProvider>
            {/* 购物车上下文 */}
            <CartProvider>
              {/* 订单上下文 */}
              <OrderProvider>
                {/* 评论上下文 */}
                <ReviewProvider>
                  {/* 收藏列表上下文 */}
                  <WishlistProvider>
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
