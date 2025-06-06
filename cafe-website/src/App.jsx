// src/App.jsx
import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Navbar from './components/Navbar';
import { CartProvider } from './context/CartContext';
import { OrderProvider } from './context/OrderContext';
import { ReviewProvider } from './context/ReviewContext';

// 导入守卫组件
import RequireAuth from './components/RequireAuth';
import RequireAdmin from './components/RequireAdmin';

// 使用 React.lazy 实现路由懒加载
const Home = lazy(() => import('./pages/Home'));
const Menu = lazy(() => import('./pages/Menu'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Checkout = lazy(() => import('./pages/Checkout'));
const OrderDetail = lazy(() => import('./pages/OrderDetail'));
const OrderHistory = lazy(() => import('./pages/OrderHistory'));
const Account = lazy(() => import('./pages/Account'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const Wishlist = lazy(() => import('./pages/Wishlist'));
const Reservation = lazy(() => import('./pages/Reservation'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const Blog = lazy(() => import('./pages/Blog'));

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

      <CartProvider>
        <OrderProvider>
          <ReviewProvider>
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

                {/* 新增预约、关于我们、联系方式、博客等公开访问页面 */}
                <Route path="/reservation" element={<Reservation />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/blog" element={<Blog />} />

                {/* 需要登录才能访问的页面 —— 用 RequireAuth 包裹 */}
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

                {/* 认证相关 —— 登录 / 注册 / 找回密码 */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />

                {/* —— 管理后台路由 —— */}
                <Route path="/admin/login" element={<AdminLogin />} />

                {/* 后台主路由（需要管理员权限） */}
                <Route
                  path="/admin/*"
                  element={
                    <RequireAdmin>
                      <AdminLayout />
                    </RequireAdmin>
                  }
                >
                  {/* 嵌套路由：会渲染到 <AdminLayout> 的 <Outlet /> */}
                  <Route index element={<AdminHome />} /> {/* /admin */}
                  <Route path="users" element={<UserList />} /> {/* /admin/users */}
                  <Route path="users/:id" element={<UserDetail />} /> {/* /admin/users/:id */}
                  <Route path="products" element={<ProductList />} /> {/* /admin/products */}
                  <Route path="products/create" element={<ProductEdit />} /> {/* /admin/products/create */}
                  <Route path="products/:id/edit" element={<ProductEdit />} /> {/* /admin/products/:id/edit */}
                  <Route path="orders" element={<OrderList />} /> {/* /admin/orders */}
                </Route>

                {/* 兜底路由：所有未匹配的，都重定向到首页 */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          </ReviewProvider>
        </OrderProvider>
      </CartProvider>
    </>
  );
}

export default App;
