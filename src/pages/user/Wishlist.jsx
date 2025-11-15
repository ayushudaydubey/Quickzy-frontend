import React from 'react';
import { Link } from 'react-router-dom';

const Wishlist = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 text-center">
      <h2 className="text-2xl font-semibold mb-4">Wishlist removed</h2>
      <p className="text-zinc-600 mb-6">The wishlist feature has been removed from this app. Use Cart to save items for later purchase.</p>
      <Link to="/products" className="inline-block px-6 py-3 bg-zinc-900 text-white rounded-lg">Browse Products</Link>
    </div>
  );
};

export default Wishlist;
