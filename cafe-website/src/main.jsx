// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';
import theme from './theme'; // 导入统一主题配置

// 保留所有上下文提供者...
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ChakraProvider theme={theme}>
        <ColorModeScript initialColorMode="light" />
        {/* 保持原有上下文嵌套结构 */}
        <ThemeProvider>
          <AuthProvider>
            <CartProvider>
              <OrderProvider>
                <ReviewProvider>
                  <WishlistProvider>
                    <App />
                  </WishlistProvider>
                </ReviewProvider>
              </OrderProvider>
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
      </ChakraProvider>
    </BrowserRouter>
  </React.StrictMode>
);