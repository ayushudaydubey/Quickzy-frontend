import React, { useEffect, useState } from 'react';
import ProductCard from './ProductCard';
import axiosInstance from '../utils/axios';

const ProductsList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get('/products');
        setProducts(res.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('🚫 Failed to load products. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const renderMessage = (message, color = 'gray') => (
    <div className="flex justify-center items-center min-h-[300px]">
      <div className={`text-lg text-${color}-600`}>{message}</div>
    </div>
  );

  if (loading) return renderMessage('⏳ Loading products...');
  if (error) return renderMessage(error, 'red');
  if (products.length === 0) return renderMessage('🛒 No products available.');

  return (
    <div className="px-6 py-10 bg-gray-50">
      <h2 className="text-3xl font-bold text-center mb-10 text-gray-800">Our Products</h2>
      <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {products.map(product => (
          <div key={product._id} className="animate-fade-in">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductsList;
