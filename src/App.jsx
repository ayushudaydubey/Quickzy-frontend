import React, { useEffect } from 'react';
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
      <MainRoutes />
      
      <Footer />
    </>
  );
};

export default App;
