// AppRoutes.jsx
import React, { Suspense, lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';

const Register = lazy(() => import('../pages/user/Register'));
const Login = lazy(() => import('../pages/user/Login'));
const Home = lazy(() => import('../pages/Home'));
const About = lazy(() => import('../pages/About'));
const Cart = lazy(() => import('../pages/user/Cart'));
const Products = lazy(() => import('../pages/Products'));
const AdminProducts = lazy(() => import('../pages/admin/AdminProducts'));
const AdminDashBoard = lazy(() => import('../pages/admin/AdminDashBoard'));
const AdminPayments = lazy(() => import('../pages/admin/Payments'));
const AdminPaymentDetail = lazy(() => import('../pages/admin/PaymentDetail'));
const ProductDetails = lazy(() => import('../components/ProductDetails'));
const SingleCart = lazy(() => import('../pages/user/SingleCart'));
const Checkout = lazy(() => import('../pages/user/Checkout'));
const OrdersPage = lazy(() => import('../pages/user/OrderPage'));
const UserProfile = lazy(() => import('../components/UserProfile'));
const UsersProductStatus = lazy(() => import('../pages/admin/UsersProductsStatus'));

const MainRoutes = () => {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading…</div>}>
      <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/register' element={<Register />} />
      <Route path='/login' element={<Login />} />
      <Route path='/about' element={<About />} />
      <Route path='/product/:id' element={<ProductDetails />} />

      <Route path='/product' element={<PrivateRoute><Products /></PrivateRoute>} />
      <Route path='/cart' element={<PrivateRoute><Cart /></PrivateRoute>} />
  <Route path='/admin/create-products' element={<PrivateRoute><AdminProducts /></PrivateRoute>} />
  <Route path='/admin/product-status' element={<PrivateRoute><UsersProductStatus /></PrivateRoute>} />
  <Route path='/admin/payments' element={<PrivateRoute adminOnly={true}><AdminPayments /></PrivateRoute>} />
  <Route path='/admin/payments/:orderId' element={<PrivateRoute adminOnly={true}><AdminPaymentDetail /></PrivateRoute>} />
  <Route path='/admin/dashboard' element={<PrivateRoute adminOnly={true}><AdminDashBoard /></PrivateRoute>} />

      <Route path='/single-cart/:id' element={<PrivateRoute><SingleCart /></PrivateRoute>} />
      <Route path='/checkout/:id' element={<PrivateRoute><Checkout /></PrivateRoute>} />
      <Route path='/orders' element={<PrivateRoute><OrdersPage /></PrivateRoute>} />

      {/* Profile route (protected) */}
      <Route path='/profile' element={<PrivateRoute><UserProfile /></PrivateRoute>} />
      </Routes>
    </Suspense>
  );
};

export default MainRoutes;