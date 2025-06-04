import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Navbar from './components/Navbar';
import Home from './pages/Home';
import Menu from './pages/Menu';
import ProductDetail from './pages/ProductDetail';
import Reservation from './pages/Reservation';
import About from './pages/About';
import Contact from './pages/Contact';
import Blog from './pages/Blog';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import OrderHistory from './pages/OrderHistory';
import Account from './pages/Account';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Wishlist from './pages/Wishlist';

import { useAuth } from './context/AuthContext';
import { useAdminAuth } from './context/AdminAuthContext';
import { ProductProvider } from './context/ProductContext';
import { CartProvider } from './context/CartContext';
import { OrderProvider } from './context/OrderContext';
import { ReviewProvider } from './context/ReviewContext';

import AdminLayout from './pages/admin/AdminLayout';
import AdminHome from './pages/admin/AdminHome';
import UserList from './pages/admin/UserList';
import UserDetail from './pages/admin/UserDetail';
import ProductList from './pages/admin/ProductList';
import ProductEdit from './pages/admin/ProductEdit';
import OrderList from './pages/admin/OrderList';
import AdminLogin from './pages/admin/AdminLogin';

function App() {
  const { user } = useAuth();            // 普通用户状态
  const { adminUser } = useAdminAuth();  // 管理员状态

  // 普通用户登录守卫
  const RequireUserLogin = ({ children }) => {
    if (!user) {
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  // 管理员登录守卫
  const RequireAdminLogin = ({ children }) => {
    if (!adminUser) {
      return <Navigate to="/admin/login" replace />;
    }
    return children;
  };

  return (
    <>
      <Navbar />

      <ProductProvider>
        <CartProvider>
          <OrderProvider>
            <ReviewProvider>
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
                    <RequireUserLogin>
                      <Checkout />
                    </RequireUserLogin>
                  }
                />
                <Route
                  path="/order-confirmation/:orderId"
                  element={
                    <RequireUserLogin>
                      <OrderConfirmation />
                    </RequireUserLogin>
                  }
                />
                <Route
                  path="/order-history"
                  element={
                    <RequireUserLogin>
                      <OrderHistory />
                    </RequireUserLogin>
                  }
                />
                <Route
                  path="/account"
                  element={
                    <RequireUserLogin>
                      <Account />
                    </RequireUserLogin>
                  }
                />

                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/wishlist" element={<Wishlist />} />

                {/* —— 管理后台分支 —— */}
                <Route path="/admin/login" element={<AdminLogin />} />

                <Route
                  path="/admin"
                  element={
                    <RequireAdminLogin>
                      <AdminLayout />
                    </RequireAdminLogin>
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
            </ReviewProvider>
          </OrderProvider>
        </CartProvider>
      </ProductProvider>
    </>
  );
}

export default App;
