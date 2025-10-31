import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axios';
import ProductCard from './ProductCard';

const ProductCardSkeleton = () => (
  <div className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
    <div className="w-full h-60 bg-gray-300"></div>
    <div className="p-4">
      <div className="h-5 bg-gray-300 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
      <div className="h-4 bg-gray-300 rounded w-2/3 mb-4"></div>
      <div className="h-8 bg-gray-300 rounded w-1/2"></div>
    </div>
  </div>
);

const HomeLiving = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axiosInstance.get('/products');
        const filtered = res.data.filter(
          (p) => p.category === 'Home & Living'
        );
        setProducts(filtered);
      } catch (err) {
        console.error('Failed to fetch products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-end justify-between mb-6 mt-4">
        <h2 className="text-3xl font-bold text-zinc-950 text-left">Home & Living</h2>
        <button
          onClick={() => navigate('/product?category=Home%20%26%20Living')}
          className="px-6 py-2 border border-black text-black text-xs font-light tracking-wider uppercase hover:bg-black hover:text-white transition-all"
        >
          View All
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {loading
          ? Array.from({ length: 12 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))
          : products.map((product) => (
              <ProductCard key={product._id} product={product} showBuy={true} />
            ))}
      </div>
    </div>
  );
};

export default HomeLiving;
