// AppRoutes.jsx
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Register from '../pages/user/Register';
import Login from '../pages/user/Login';
import Home from '../pages/Home';
import About from '../pages/About';
import Cart from '../pages/user/Cart';
import Products from '../pages/Products';
import PrivateRoute from './PrivateRoute';
import AdminProducts from '../pages/admin/AdminProducts';
import AdminDashBoard from '../pages/admin/AdminDashBoard';
import ProductDetails from '../components/ProductDetails';
import SingleCart from '../pages/user/SingleCart';
import Checkout from '../pages/user/Checkout';
import OrdersPage from '../pages/user/OrderPage';
import UserProfile from '../components/UserProfile';

const MainRoutes = () => {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/register' element={<Register />} />
      <Route path='/login' element={<Login />} />
      <Route path='/about' element={<About />} />
      <Route path='/product/:id' element={<ProductDetails />} />

      <Route path='/product' element={<PrivateRoute><Products /></PrivateRoute>} />
      <Route path='/cart' element={<PrivateRoute><Cart /></PrivateRoute>} />
      <Route path='/admin/create-products' element={<PrivateRoute><AdminProducts /></PrivateRoute>} />
      <Route path='/admin/dashboard' element={<PrivateRoute adminOnly={true}><AdminDashBoard /></PrivateRoute>} />

      <Route path='/single-cart/:id' element={<PrivateRoute><SingleCart /></PrivateRoute>} />
      <Route path='/checkout/:id' element={<PrivateRoute><Checkout /></PrivateRoute>} />
      <Route path='/orders' element={<PrivateRoute><OrdersPage /></PrivateRoute>} />

      {/* Profile route (protected) */}
      <Route path='/profile' element={<PrivateRoute><UserProfile /></PrivateRoute>} />
    </Routes>
  );
};

export default MainRoutes;