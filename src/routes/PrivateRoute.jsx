import { Navigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axiosInstance from '../utils/axios';
import Loader from '../components/Loader';

const PrivateRoute = ({ children, adminOnly = false }) => {
  const [isAllowed, setIsAllowed] = useState(null);

  useEffect(() => {
    const checkAccess = async () => {
      try {
        const res = await axiosInstance.get('/me', { withCredentials: true });
          // normalize response shape: backend may return { user: {...} } or the user object directly
          const user = res.data.user || res.data;

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

  const location = useLocation();

  if (isAllowed === null) {
    return <div className="min-h-screen flex items-center justify-center"><Loader text="Checking access..." /></div>;
  }

  if (isAllowed) return children;

  // not allowed -> redirect to login and preserve attempted path
  const attempted = location.pathname + location.search;
  return <Navigate to={`/login?redirect=${encodeURIComponent(attempted)}`} replace />;
};

export default PrivateRoute;
