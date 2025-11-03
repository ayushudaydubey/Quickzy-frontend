import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { loadUser } from './store/Reducers/userSlice';
import MainRoutes from './routes/MainRoutes';
import Footer from './components/Footer';
import NavBar from './components/NavBar';

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadUser());
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
