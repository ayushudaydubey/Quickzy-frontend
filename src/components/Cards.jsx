import React, { useEffect, useState } from 'react';
import axiosInstance from '../utils/axios';
import ProductCard from './ProductCard';

const Cards = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axiosInstance.get('/products');
        setProducts(res.data);
      } catch (err) {
        console.error('Failed to fetch products:', err);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="max-w-7xl mx-auto  ">
      <h2 className="text-3xl font-bold mb-6 mt-4 text-zinc-950 text-left">New Collections...</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map(product => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default Cards;
