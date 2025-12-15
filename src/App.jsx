import React, { useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { loadUser } from './store/Reducers/userSlice';
// wishlist feature removed
import { loadCart } from './store/Reducers/cartSlice';
import MainRoutes from './routes/MainRoutes';
import Footer from './components/Footer';
import NavBar from './components/NavBar';

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadUser()).then(() => {
      // load cart after user is loaded
      dispatch(loadCart());
    });
  }, [dispatch]);

  return (
    <>
      <NavBar />
      <ToastContainer position="top-right" autoClose={3000} />
      <MainRoutes />
      
      <Footer />
    </>
  );
};

export default App;
