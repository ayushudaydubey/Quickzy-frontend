import React, { useState } from 'react';
import { ShoppingCart, User, Menu, X, Search } from 'lucide-react';

const NavBar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('Home');

  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter' && searchTerm.trim() !== '') {
      console.log('Searching for:', searchTerm);
      setSearchOpen(false);
      setMobileOpen(false);
    }
  };

  const closeMobile = () => {
    setMobileOpen(false);
    setSearchOpen(false);
  };

  const handleNavClick = (tabName) => {
    setActiveTab(tabName);
    closeMobile();
  };

  const isActive = (tabName) => activeTab === tabName;

  return (
    <header className="bg-gray-100 backdrop-blur-2xl text-black sticky top-0 shadow-md z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4">
        
        {/* Logo */}
        <div 
          className="text-2xl sm:text-3xl font-medium tracking-wide flex-shrink-0 cursor-pointer"
          onClick={() => handleNavClick('Home')}
        >
          Quickzy
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex space-x-8 text-lg font-medium">
          <button
            onClick={() => handleNavClick('Home')}
            className={
              isActive('Home')
                ? 'border-b-2 border-zinc-950 pb-1'
                : 'hover:scale-105 transition'
            }
          >
            Home
          </button>
          <button
            onClick={() => handleNavClick('About')}
            className={
              isActive('About')
                ? 'border-b-2 border-zinc-950 pb-1'
                : 'hover:scale-105 transition'
            }
          >
            About
          </button>
          <button
            onClick={() => handleNavClick('Shop')}
            className={
              isActive('Shop')
                ? 'border-b-2 border-zinc-950 pb-1'
                : 'hover:scale-105 transition'
            }
          >
            Shop
          </button>
        </nav>

        {/* Desktop Search Bar */}
        <div className="hidden md:flex items-center">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleSearchKeyPress}
            placeholder="Search..."
            className="px-3 py-2 w-48 lg:w-64 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-black text-sm"
          />
        </div>

        {/* Desktop Icons */}
        <div className="hidden md:flex items-center space-x-3">
          <button
            onClick={() => handleNavClick('Account')}
            className="p-2 rounded-full border border-transparent hover:border-zinc-950 transition-all duration-300 ease-in-out"
          >
            <User className="w-6 h-6" />
          </button>
          <button
            onClick={() => handleNavClick('Cart')}
            className="p-2 rounded-full border border-transparent hover:border-zinc-950 transition-all duration-300 ease-in-out relative"
          >
            <ShoppingCart className="w-6 h-6" />
            {/* Optional cart badge */}
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">3</span>
          </button>
        </div>

        {/* Mobile Icons */}
        <div className="flex md:hidden items-center space-x-2">
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="p-2 rounded-full border border-transparent hover:border-zinc-950 transition-all duration-300 ease-in-out"
          >
            <Search className="w-5 h-5" />
          </button>
          
          <button
            onClick={() => handleNavClick('Account')}
            className="p-2 rounded-full border border-transparent hover:border-zinc-950 transition-all duration-300 ease-in-out"
          >
            <User className="w-5 h-5" />
          </button>

          <button
            onClick={() => handleNavClick('Cart')}
            className="p-2 rounded-full border border-transparent hover:border-zinc-950 transition-all duration-300 ease-in-out relative"
          >
            <ShoppingCart className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">3</span>
          </button>

          <button
            className="p-2 focus:outline-none text-black"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Search Bar */}
      {searchOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 px-4 py-3 animate-in slide-in-from-top duration-200">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleSearchKeyPress}
              placeholder="Search products..."
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-black text-base pr-10"
              autoFocus
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
        </div>
      )}

      {/* Mobile Navigation Menu */}
      {mobileOpen && (
        <nav className="md:hidden bg-white border-t border-gray-200 shadow-lg animate-in slide-in-from-top duration-200">
          <ul className="flex flex-col px-4 py-3">
            {[
              { label: 'Home', value: 'Home' },
              { label: 'About', value: 'About' },
              { label: 'Shop', value: 'Shop' }
            ].map((item, idx) => (
              <li key={idx}>
                <button
                  onClick={() => handleNavClick(item.value)}
                  className={`block w-full text-left py-4 px-4 rounded-lg transition-all duration-200 text-base font-medium ${
                    isActive(item.value)
                      ? 'bg-indigo-100 text-indigo-700 border-l-4 border-indigo-700 shadow-sm'
                      : 'hover:bg-gray-50 hover:text-indigo-600 active:bg-gray-100'
                  }`}
                >
                  {item.label}
                </button>
              </li>
            ))}
            
            {/* Mobile-only links */}
            <li className="border-t border-gray-200 mt-3 pt-3">
              <button
                onClick={() => handleNavClick('Account')}
                className={`flex items-center w-full py-4 px-4 rounded-lg transition-all duration-200 text-base font-medium ${
                  isActive('Account')
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'hover:bg-gray-50 hover:text-indigo-600 active:bg-gray-100'
                }`}
              >
                <User className="w-5 h-5 mr-3" />
                My Account
              </button>
            </li>
            <li>
              <button
                onClick={() => handleNavClick('Cart')}
                className={`flex items-center w-full py-4 px-4 rounded-lg transition-all duration-200 text-base font-medium ${
                  isActive('Cart')
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'hover:bg-gray-50 hover:text-indigo-600 active:bg-gray-100'
                }`}
              >
                <ShoppingCart className="w-5 h-5 mr-3" />
                <span>Cart & Orders</span>
                <span className="ml-auto bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">3</span>
              </button>
            </li>
          </ul>
        </nav>
      )}

      {/* Overlay for mobile menu */}
      {(mobileOpen || searchOpen) && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-25 z-40 md:hidden"
          onClick={closeMobile}
        />
      )}
    </header>
  );
};

export default NavBar;