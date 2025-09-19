import React, { useEffect, useState } from 'react';
import axiosInstance from '../utils/axios';
import ProductCard from './ProductCard';

// Skeleton Component
const ProductCardSkeleton = () => {
  return (
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
};

const Cards = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axiosInstance.get('/products');
        setProducts(res.data);
      } catch (err) {
        console.error('Failed to fetch products:', err);
      } finally {
        setLoading(false); //  stop loading after fetch
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 mt-4 text-zinc-950 text-left">
        New Collections...
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {loading
          ? Array.from({ length: 12 }).map(( i) => (
              <ProductCardSkeleton key={i} />
            ))
          : products.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
      </div>
    </div>
  );
};

export default Cards;
