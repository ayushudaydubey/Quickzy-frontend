import { Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axiosInstance from '../utils/axios';

const PrivateRoute = ({ children, adminOnly = false }) => {
  const [isAllowed, setIsAllowed] = useState(null);

  useEffect(() => {
    axiosInstance.get('/me', { withCredentials: true })
      .then(res => {
        if (adminOnly && !res.data?.admin) {
          setIsAllowed(false);
        } else {
          setIsAllowed(true);
        }
      })
      .catch(() => setIsAllowed(false));
  }, [adminOnly]);

  if (isAllowed === null) return <p className="text-center mt-10">Checking access...</p>;
  return isAllowed ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
