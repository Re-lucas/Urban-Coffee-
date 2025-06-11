// src/App.jsx
import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Navbar from './components/Navbar';

import RequireAuth from './components/RequireAuth';
import RequireAdmin from './components/RequireAdmin';

// 前台页面懒加载
const Home = lazy(() => import('./pages/Home'));
const Menu = lazy(() => import('./pages/Menu'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const CartPage      = lazy(() => import('./pages/CartPage'));     // 新增
const Checkout = lazy(() => import('./pages/Checkout'));
const OrderDetail = lazy(() => import('./pages/OrderDetail'));
const OrderHistory = lazy(() => import('./pages/OrderHistory'));
const OrderConfirmation = lazy(() => import('./pages/OrderConfirmation')); // 新增
const Account = lazy(() => import('./pages/Account'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const Wishlist = lazy(() => import('./pages/Wishlist'));
const Reservation = lazy(() => import('./pages/Reservation'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const Blog = lazy(() => import('./pages/Blog'));

// 后台页面懒加载
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));
const AdminLayout = lazy(() => import('./pages/admin/AdminLayout'));
const AdminHome   = lazy(() => import('./pages/admin/AdminHome'));
const UserList    = lazy(() => import('./pages/admin/UserList'));
const UserDetail  = lazy(() => import('./pages/admin/UserDetail'));
const ProductList = lazy(() => import('./pages/admin/ProductList'));
const ProductEdit = lazy(() => import('./pages/admin/ProductEdit'));
const OrderList   = lazy(() => import('./pages/admin/OrderList'));

export default function App() {
  return (
    <>
      <Navbar />

            <Suspense
              fallback={
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '50vh',
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                  }}
                >
                  页面加载中...
                </div>
              }
            >
              <Routes>
                {/* —— 普通前台页面 —— */}
                <Route path="/" element={<Home />} />
                <Route path="/menu" element={<Menu />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/cart" element={<CartPage />} />   {/* 新增 */}

                {/* 公开访问页面 */}
                <Route path="/reservation" element={<Reservation />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/blog" element={<Blog />} />

                {/* 需要登录才能访问（RequireAuth） */}
                <Route
                  path="/checkout"
                  element={
                    <RequireAuth>
                      <Checkout />
                    </RequireAuth>
                  }
                />
                <Route
                  path="/order/:id"
                  element={
                    <RequireAuth>
                      <OrderDetail />
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
                
                {/* 订单确认页（支付成功后跳转） */}
               <Route
                 path="/order-confirmation/:orderId"
                 element={
                   <RequireAuth>
                     <OrderConfirmation />
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
                <Route
                  path="/wishlist"
                  element={
                    <RequireAuth>
                      <Wishlist />
                    </RequireAuth>
                  }
                />

                {/* 登录 / 注册 / 找回密码 */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />

                {/* —— 管理后台路由 —— */}
                <Route path="/admin/login" element={<AdminLogin />} />

                <Route
                  path="/admin/*"
                  element={
                    <RequireAdmin>
                      <AdminLayout />
                    </RequireAdmin>
                  }
                >
                  <Route index element={<AdminHome />} />          {/* /admin */}
                  <Route path="users" element={<UserList />} />    {/* /admin/users */}
                  <Route path="users/:id" element={<UserDetail />} />     {/* /admin/users/:id */}
                  <Route path="products" element={<ProductList />} />     {/* /admin/products */}
                  <Route path="products/create" element={<ProductEdit />} />     {/* /admin/products/create */}
                  <Route path="products/:id/edit" element={<ProductEdit />} />   {/* /admin/products/:id/edit */}
                  <Route path="orders" element={<OrderList />} />     {/* /admin/orders */}
                </Route>

                {/* 兜底：其余未匹配的，重定向到首页 */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
    </>
  );
}
