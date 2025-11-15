import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axiosInstance from '../utils/axios';
import { loadUser, logout as logoutAction } from '../store/Reducers/userSlice';
import { Menu, X, Search, ShoppingCart, Heart, User, LogOut, LayoutDashboard, Package } from 'lucide-react';

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const cartItems = useSelector((state) => state.cart.items || []);
  const wishlistItems = useSelector((state) => state.wishlist.items || []);
  const cartCount = cartItems.reduce((s, it) => s + (Number(it.quantity) || 0), 0);
  const wishlistCount = Array.isArray(wishlistItems) ? wishlistItems.length : 0;

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

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setMobileSearchOpen(false);
  }, [location.pathname]);

  const onSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    const q = searchTerm.trim();
    if (q) params.set('search', q);
    if (category) params.set('category', category);
    const queryString = params.toString();
    navigate(`/product${queryString ? `?${queryString}` : ''}`);
    setMobileSearchOpen(false);
  };

  const handleLogout = async () => {
    try {
      await axiosInstance.post('/logout', {}, { withCredentials: true });
    } catch (err) {
      console.error('Logout request failed', err);
    } finally {
      dispatch(logoutAction());
      navigate('/', { replace: true });
    }
  };

  return (
    <header className="bg-black border-b border-neutral-800 sticky top-0  z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Navigation Bar */}
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden text-white p-2 hover:text-neutral-300 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Logo */}
          <Link 
            to="/" 
            className="text-2xl sm:text-3xl font-light text-white hover:text-neutral-300 transition-colors tracking-widest uppercase"
          >
            Quickzy
          </Link>

          {/* Desktop Search Bar */}
          <form
            onSubmit={onSearch}
            className="hidden lg:flex items-center gap-4 flex-1 max-w-2xl mx-8"
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
              className="px-8 py-3 bg-white text-black font-light uppercase tracking-wider rounded-none hover:bg-neutral-200 transition-colors whitespace-nowrap"
            >
              Search
            </button>
          </form>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6">
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
                <Link to="/cart" className="relative text-xs text-neutral-400 font-light uppercase tracking-widest hover:text-white transition-colors">
                  Cart
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-3 bg-red-600 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">{cartCount}</span>
                  )}
                </Link>
                <Link to="/wishlist" className="relative text-xs text-neutral-400 font-light uppercase tracking-widest hover:text-white transition-colors">
                  Wishlist
                  {wishlistCount > 0 && (
                    <span className="absolute -top-2 -right-3 bg-pink-600 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">{wishlistCount}</span>
                  )}
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

          {/* Mobile Icons */}
          <div className="flex lg:hidden items-center gap-3">
            <button
              onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
              className="text-white p-2 hover:text-neutral-300 transition-colors"
              aria-label="Toggle search"
            >
              <Search size={20} />
            </button>
            {user && (
              <>
                <Link to="/cart" className="relative text-white p-2 hover:text-neutral-300 transition-colors">
                  <ShoppingCart size={20} />
                  {cartCount > 0 && (
                    <span className="absolute top-0 right-0 bg-pink-600 text-white rounded-full text-xs w-4 h-4 flex items-center justify-center text-[10px]">{cartCount}</span>
                  )}
                </Link>
                <Link to="/wishlist" className="relative text-white p-2 hover:text-neutral-300 transition-colors">
                  <Heart size={20} />
                  {wishlistCount > 0 && (
                    <span className="absolute top-0 right-0 bg-pink-600 text-white rounded-full text-xs w-4 h-4 flex items-center justify-center text-[10px]">{wishlistCount}</span>
                  )}
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile Search Bar */}
        {mobileSearchOpen && (
          <form onSubmit={onSearch} className="lg:hidden py-4 border-t border-neutral-800">
            <div className="flex flex-col gap-3">
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search products..."
                className="w-full px-4 py-3 bg-neutral-900 text-white placeholder-neutral-500 border border-neutral-800 rounded-none focus:outline-none focus:border-white transition-colors font-light"
              />
              <div className="flex gap-3">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="flex-1 px-4 py-3 bg-neutral-900 text-white border border-neutral-800 rounded-none focus:outline-none focus:border-white cursor-pointer transition-colors font-light appearance-none"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat} className="bg-neutral-900">
                      {cat === '' ? 'All Categories' : cat}
                    </option>
                  ))}
                </select>
                <button
                  type="submit"
                  className="px-6 py-3 bg-white text-black font-light uppercase tracking-wider rounded-none hover:bg-neutral-200 transition-colors whitespace-nowrap"
                >
                  Search
                </button>
              </div>
            </div>
          </form>
        )}
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-neutral-800 bg-black top0 sticky">
          <nav className="px-4 py-4 space-y-1">
            {user ? (
              <>
                <Link 
                  to="/profile" 
                  className="flex items-center gap-3 px-4 py-3 text-white hover:bg-neutral-900 transition-colors rounded-none"
                >
                  <User size={20} />
                  <span className="font-light tracking-wider">{user.username || 'Profile'}</span>
                </Link>
                {user.admin && (
                  <Link 
                    to="/admin/dashboard" 
                    className="flex items-center gap-3 px-4 py-3 text-white hover:bg-neutral-900 transition-colors rounded-none border-l-2 border-white"
                  >
                    <LayoutDashboard size={20} />
                    <span className="font-light tracking-wider uppercase text-sm">Admin Dashboard</span>
                  </Link>
                )}
                <Link 
                  to="/orders" 
                  className="flex items-center gap-3 px-4 py-3 text-neutral-400 hover:text-white hover:bg-neutral-900 transition-colors rounded-none"
                >
                  <Package size={20} />
                  <span className="font-light tracking-wider">Orders</span>
                </Link>
                <Link 
                  to="/cart" 
                  className="flex items-center gap-3 px-4 py-3 text-neutral-400 hover:text-white hover:bg-neutral-900 transition-colors rounded-none"
                >
                  <ShoppingCart size={20} />
                  <span className="font-light tracking-wider">Cart</span>
                  {cartCount > 0 && (
                    <span className="ml-auto bg-red-600 text-white rounded-full text-xs px-2 py-1">{cartCount}</span>
                  )}
                </Link>
                <Link 
                  to="/wishlist" 
                  className="flex items-center gap-3 px-4 py-3 text-neutral-400 hover:text-white hover:bg-neutral-900 transition-colors rounded-none"
                >
                  <Heart size={20} />
                  <span className="font-light tracking-wider">Wishlist</span>
                  {wishlistCount > 0 && (
                    <span className="ml-auto bg-pink-600 text-white rounded-full text-xs px-2 py-1">{wishlistCount}</span>
                  )}
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full px-4 py-3 text-neutral-400 hover:text-white hover:bg-neutral-900 transition-colors rounded-none"
                >
                  <LogOut size={20} />
                  <span className="font-light tracking-wider">Logout</span>
                </button>
              </>
            ) : (
              <Link 
                to="/login" 
                className="flex items-center justify-center gap-3 px-4 py-3 bg-white text-black hover:bg-neutral-200 transition-colors rounded-none font-light tracking-wider uppercase"
              >
                Login
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default NavBar;