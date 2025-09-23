import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const NavBar = () => {
  // const [mobileOpen, setMobileOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const onSearch = (e) => {
    e.preventDefault();
    const q = searchTerm.trim();
    if (q) {
      navigate(`/product?search=${encodeURIComponent(q)}`);
    } else {
      navigate('/product');
    }
    // keep input if you want, or clear:
    // setSearchTerm('');
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
          <button
            type="submit"
            className="px-4 py-2 bg-black text-white rounded-lg"
          >
            Search
          </button>
        </form>

        <nav className="flex items-center gap-4">
          {/* <Link to="/cart" className="text-sm">
            Cart
          </Link> */}
          <Link to="/login" className="text-sm">
            Login
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default NavBar;
