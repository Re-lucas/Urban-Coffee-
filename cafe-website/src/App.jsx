import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Navbar from './components/Navbar';
import { useAuth } from './context/AuthContext';
import { ProductProvider } from './context/ProductContext';
import { CartProvider } from './context/CartContext';
import { OrderProvider } from './context/OrderContext';
import { ReviewProvider } from './context/ReviewContext';

// 导入守卫组件
import RequireAuth from './components/RequireAuth';
import RequireAdmin from './components/RequireAdmin';

// 使用React.lazy()实现路由懒加载
const Home = lazy(() => import('./pages/Home'));
const Menu = lazy(() => import('./pages/Menu'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Reservation = lazy(() => import('./pages/Reservation'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const Blog = lazy(() => import('./pages/Blog'));
const Checkout = lazy(() => import('./pages/Checkout'));
const OrderConfirmation = lazy(() => import('./pages/OrderConfirmation'));
const OrderHistory = lazy(() => import('./pages/OrderHistory'));
const Account = lazy(() => import('./pages/Account'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const Wishlist = lazy(() => import('./pages/Wishlist'));

// 管理后台页面的懒加载
const AdminLayout = lazy(() => import('./pages/admin/AdminLayout'));
const AdminHome = lazy(() => import('./pages/admin/AdminHome'));
const UserList = lazy(() => import('./pages/admin/UserList'));
const UserDetail = lazy(() => import('./pages/admin/UserDetail'));
const ProductList = lazy(() => import('./pages/admin/ProductList'));
const ProductEdit = lazy(() => import('./pages/admin/ProductEdit'));
const OrderList = lazy(() => import('./pages/admin/OrderList'));
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));

function App() {
  return (
    <>
      <Navbar />
      
      {/* 确保 CartProvider 包裹所有需要购物车功能的组件 */}
      <CartProvider>
        <ProductProvider>
          <OrderProvider>
            <ReviewProvider>
              <Suspense fallback={
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center', 
                  height: '50vh',
                  fontSize: '1.5rem',
                  fontWeight: 'bold'
                }}>
                  页面加载中...
                </div>
              }>
                <Routes>
                  {/* —— 普通前台页面 —— */}
                  <Route path="/" element={<Home />} />
                  <Route path="/menu" element={<Menu />} />
                  <Route path="/product/:productId" element={<ProductDetail />} />
                  <Route path="/reservation" element={<Reservation />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/blog" element={<Blog />} />

                  <Route
                    path="/checkout"
                    element={
                      <RequireAuth>
                        <Checkout />
                      </RequireAuth>
                    }
                  />
                  <Route
                    path="/order-confirmation/:orderId"
                    element={
                      <RequireAuth>
                        <OrderConfirmation />
                      </RequireAuth>
                    }
                  />
                  <Route
                    path="/order-history"
                    element={
                      <RequireAuth>
                        <OrderHistory />
                      </RequireAuth>
                    }
                  />
                  <Route
                    path="/account"
                    element={
                      <RequireAuth>
                        <Account />
                      </RequireAuth>
                    }
                  />

                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route
                    path="/wishlist"
                    element={
                      <RequireAuth>
                        <Wishlist />
                      </RequireAuth>
                    }
                  />

                  {/* —— 管理后台分支 —— */}
                  <Route path="/admin/login" element={<AdminLogin />} />

                  <Route
                    path="/admin"
                    element={
                      <RequireAdmin>
                        <AdminLayout />
                      </RequireAdmin>
                    }
                  >
                    <Route index element={<AdminHome />} />
                    <Route path="users" element={<UserList />} />
                    <Route path="users/:userId" element={<UserDetail />} />
                    <Route path="products" element={<ProductList />} />
                    <Route path="products/:productId" element={<ProductEdit />} />
                    <Route path="orders" element={<OrderList />} />
                  </Route>

                  {/* 兜底 404 */}
                  <Route path="*" element={<Navigate to="/" />} />
                </Routes>
              </Suspense>
            </ReviewProvider>
          </OrderProvider>
        </ProductProvider>
      </CartProvider>
    </>
  );
}

export default App;