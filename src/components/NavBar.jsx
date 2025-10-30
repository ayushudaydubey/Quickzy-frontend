import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axiosInstance from '../utils/axios';
import { loadUser, logout as logoutAction } from '../store/Reducers/userSlice';

const categories = [
  '',
  'Fashion',
  'Technology',
  'Home & Living',
  'Food & Wellness',
  'Accessories',
  'Beauty',
  'Other',
];

const NavBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);

  // keep input/select in sync with query params
  useEffect(() => {
    const q = new URLSearchParams(location.search);
    setSearchTerm(q.get('search') || '');
    setCategory(q.get('category') || '');
  }, [location.search]);

  // load user from session cookie if not loaded
  useEffect(() => {
    if (!user) {
      dispatch(loadUser());
    }
  }, [dispatch, user]);

  const onSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    const q = searchTerm.trim();
    if (q) params.set('search', q);
    if (category) params.set('category', category);
    const queryString = params.toString();
    navigate(`/product${queryString ? `?${queryString}` : ''}`);
  };

  const handleLogout = async () => {
    try {
      await axiosInstance.post('/logout', {}, { withCredentials: true });
    } catch (err) {
      // ignore server error, still clear client state
      console.error('Logout request failed', err);
    } finally {
      dispatch(logoutAction());
      navigate('/', { replace: true });
    }
  };

  return (
    <header className="bg-black border-b border-neutral-800">
      <div className="max-w-7xl mx-auto px-8 py-5">
        <div className="flex items-center justify-between gap-10">
          {/* Logo */}
          <Link 
            to="/" 
            className="text-3xl font-light text-white hover:text-neutral-300 transition-colors tracking-widest uppercase"
          >
            Quickzy
          </Link>

          {/* Search Bar */}
          <form
            onSubmit={onSearch}
            className="flex items-center gap-4 flex-1 max-w-3xl"
          >
            <div className="relative flex-1">
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search products..."
                className="w-full px-6 py-3 bg-neutral-900 text-white placeholder-neutral-500 border border-neutral-800 rounded-none focus:outline-none focus:border-white transition-colors font-light"
              />
            </div>
            
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="px-5 py-3 bg-neutral-900 text-white border border-neutral-800 rounded-none focus:outline-none focus:border-white cursor-pointer transition-colors font-light appearance-none"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat} className="bg-neutral-900">
                  {cat === '' ? 'All Categories' : cat}
                </option>
              ))}
            </select>
            
            <button
              type="submit"
              className="px-8 py-3 bg-white text-black font-light uppercase tracking-wider rounded-none hover:bg-neutral-200 transition-colors"
            >
              Search
            </button>
          </form>

          {/* Navigation Links */}
          <nav className="flex items-center gap-6">
            {user ? (
              <>
                {user.admin && (
                  <Link 
                    to="/admin/dashboard" 
                    className="text-xs text-white font-light uppercase tracking-widest hover:text-neutral-400 transition-colors border-b border-white pb-1"
                  >
                    Admin
                  </Link>
                )}
                <Link 
                  to="/orders" 
                  className="text-xs text-neutral-400 font-light uppercase tracking-widest hover:text-white transition-colors"
                >
                  Orders
                </Link>
                <Link 
                  to="/profile" 
                  className="text-xs text-white font-light uppercase tracking-widest hover:text-neutral-400 transition-colors"
                >
                  {user.username || 'Profile'}
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-xs px-6 py-2 bg-transparent text-white font-light uppercase tracking-widest border border-white rounded-none hover:bg-white hover:text-black transition-all"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link 
                to="/login" 
                className="text-xs px-6 py-2.5 bg-white text-black font-light uppercase tracking-widest rounded-none hover:bg-neutral-200 transition-colors"
              >
                Login
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default NavBar;