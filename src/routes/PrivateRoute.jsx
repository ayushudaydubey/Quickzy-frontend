import { Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axiosInstance from '../utils/axios';

const PrivateRoute = ({ children, adminOnly = false }) => {
  const [isAllowed, setIsAllowed] = useState(null);

  useEffect(() => {
    const checkAccess = async () => {
      try {
        const res = await axiosInstance.get('/me', { withCredentials: true });
        const user = res.data;

        if (adminOnly && !user.admin) {
          setIsAllowed(false);
        } else {
          setIsAllowed(true);
        }
      } catch (err) {
        setIsAllowed(false);
      }
    };

    checkAccess();
  }, [adminOnly]);

  if (isAllowed === null) {
    return <p className="text-center mt-10">Checking access...</p>;
  }

  return isAllowed ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
