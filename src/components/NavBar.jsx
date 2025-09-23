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
    <header className="bg-white shadow">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/" className="text-2xl font-bold text-zinc-900">
            Quickzy
          </Link>
        </div>

        <form
          onSubmit={onSearch}
          className="flex items-center gap-2 w-1/2 max-w-2xl"
        >
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search products by name..."
            className="w-full px-4 py-2 border rounded-lg focus:outline-none"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-3 py-2 border rounded-lg bg-white"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat === '' ? 'All categories' : cat}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="px-4 py-2 bg-black text-white rounded-lg"
          >
            Search
          </button>
        </form>

        <nav className="flex items-center gap-4">
          {/* If user is logged in show profile + orders (and logout), otherwise show Login */}
          {user ? (
            <>
              <Link to="/orders" className="text-sm">
                Orders
              </Link>
              <Link to="/profile" className="text-sm font-medium">
                {user.username || 'Profile'}
              </Link>
              <button
                onClick={handleLogout}
                className="text-sm px-3 py-1 bg-gray-100 rounded"
              >
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="text-sm">
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default NavBar;
