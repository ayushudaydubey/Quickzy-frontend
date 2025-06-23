import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Menu, X } from 'lucide-react';

const NavBar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  // const handleSearchKeyPress = (e) => {
  //   if (e.key === 'Enter' && searchTerm.trim() !== '') {
  //     navigate(`/search?query=${encodeURIComponent(searchTerm)}`);
  //   }
  // };

  return (
    <header className="bg-gray-100 backdrop-blur-2xl text-black sticky top-0 shadow-md z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">

        <NavLink to="/" className="text-3xl font-medium tracking-wide">
          Quickzy
        </NavLink>


        <nav className="hidden md:flex space-x-8 text-lg font-medium">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive
                ? 'border-b-2 border-zinc-950 pb-1'
                : 'hover:scale-105 transition'
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) =>
              isActive
                ? 'border-b-2 border-zinc-950 pb-1'
                : 'hover:scale-105 transition'
            }
          >
            About
          </NavLink>
          <NavLink
            to="/products"
            className={({ isActive }) =>
              isActive
                ? 'border-b-2 border-zinc-950 pb-1'
                : 'hover:scale-105 transition'
            }
          >
            Shop
          </NavLink>
        </nav>


        <div className="flex items-center space-x-4">
          <input
            type="text"
            value={searchTerm}
            // onChange={(e) => setSearchTerm(e.target.value)}
            // onKeyDown={handleSearchKeyPress}
            placeholder="Search..."
            className="px-3 py-1 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-black"
          />
          <NavLink
            to="/login"
            className="p-2 rounded-full border border-transparent hover:border-zinc-950 transition-all duration-300 ease-in-out"
          >
            <User className="w-6 h-6" />
          </NavLink>

          <NavLink
            to="/orders"
            className="p-2 rounded-full border border-transparent hover:border-zinc-950 transition-all duration-300 ease-in-out"
          >
            <ShoppingCart className="w-6 h-6" />
          </NavLink>



          <button
            className="md:hidden focus:outline-none text-black"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>


      {mobileOpen && (
        <nav className="md:hidden bg-white border-t border-gray-200">
          <ul className="flex flex-col space-y-2 px-4 py-3 text-lg">
            {['Home', 'Advice', 'Shop'].map((label, idx) => {
              const path = label === 'Home' ? '/' : `/${label.toLowerCase()}`;
              return (
                <li key={idx}>
                  <NavLink
                    to={path}
                    className={({ isActive }) =>
                      `block w-full py-2 px-2 rounded-lg transition-colors ${isActive
                        ? 'bg-indigo-100 text-indigo-700'
                        : 'hover:bg-gray-100 hover:text-indigo-600'
                      }`
                    }
                    onClick={() => setMobileOpen(false)}
                  >
                    {label}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>
      )}
    </header>
  );
};

export default NavBar;
