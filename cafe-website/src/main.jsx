// src/main.jsx  （或 index.jsx）
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { ProductProvider } from './context/ProductContext';
import { CartProvider } from './context/CartContext';
import { OrderProvider } from './context/OrderContext';
import { ReviewProvider } from './context/ReviewContext';

/** 
 * 关键：在所有这些普通“用户”Context 之上，再包裹一个 AdminAuthProvider 
 * 这样 App 下使用 useAdminAuth() 时才会生效 
 */
import { AdminAuthProvider } from './context/AdminAuthContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AdminAuthProvider>
        <ThemeProvider>
          <AuthProvider>
            <ProductProvider>
              <CartProvider>
                <OrderProvider>
                  <ReviewProvider>
                    <App />
                  </ReviewProvider>
                </OrderProvider>
              </CartProvider>
            </ProductProvider>
          </AuthProvider>
        </ThemeProvider>
      </AdminAuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
