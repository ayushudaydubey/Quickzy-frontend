import React, { useEffect, useState } from 'react';
import axiosInstance from '../utils/axios';
import ProductCard from './ProductCard';

// Skeleton Component
const ProductCardSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse min-w-[250px] max-w-[250px] flex-shrink-0">
      <div className="w-full h-60 bg-gray-300"></div>
      <div className="p-4">
        <div className="h-5 bg-gray-300 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-300 rounded w-2/3 mb-4"></div>
        <div className="h-8 bg-gray-300 rounded w-1/2"></div>
      </div>
    </div>
  );
};

const Cards = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axiosInstance.get('/products');
        // Filter only Fashion or Lifestyle
        const filtered = res.data.filter(
          (p) => p.category === 'Fashion' || p.category === 'Lifestyle'
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

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold mb-6 mt-4 text-zinc-950 text-left">
          Fashion / Lifestyle
        </h2>
        <button className="px-4 py-2 rounded-2xl border border-y-zinc-950 cursor-pointer">
          Scroll for More 
        </button>
      </div>

      {/* Horizontal Scroll Container */}
      <div className="flex space-x-6 overflow-x-auto scrollbarHide pb-4">
        {loading
          ? Array.from({ length: 8 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))
          : products.map((product) => (
              <div
                key={product._id}
                className="min-w-[250px] max-w-[250px] flex-shrink-0"
              >
                <ProductCard product={product} />
              </div>
            ))}
      </div>
    </div>
  );
};

export default Cards;
