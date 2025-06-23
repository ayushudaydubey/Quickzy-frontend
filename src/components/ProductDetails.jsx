import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axios';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    axiosInstance.get(`/products/${id}`)
      .then(res => setProduct(res.data))
      .catch(() => setMessage('❌ Product not found'));
  }, [id]);

  const performAddToCart = useCallback(async () => {
    try {
      await axiosInstance.post(
        '/cart/add-to-cart',
        { productId: id },
        { withCredentials: true }
      );
      navigate(`/checkout/${id}`, { state: { quantity: 1 } });
    } catch (err) {
      console.error('Add to cart failed', err);
      setMessage('❌ Failed to add to cart');
    }
  }, [id, navigate]);

  const handleAddToCart = async () => {
    try {
      await axiosInstance.get('/me', { withCredentials: true });
      performAddToCart();
    } catch {
      navigate(`/login?redirect=/product/${id}`);
    }
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-white flex justify-center items-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-black text-xl font-medium">
            {message || 'Loading product...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-4 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden">
          <div className="flex flex-col lg:flex-row">
           
            <div className="lg:w-1/2 relative group">
              <div className="aspect-square lg:aspect-auto lg:h-[600px] overflow-hidden">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-center object-cover  "
                  onError={(e) => (e.target.src = '/fallback.jpg')}
                />
                <div className="absolute inset-0"></div>
              </div>
            </div>

            <div className="lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center space-y-8">
              <div className="space-y-6">
                <h1 className="text-4xl lg:text-5xl font-bold text-black leading-tight">
                  {product.title}
                </h1>
                
                <p className="text-gray-600 text-lg leading-relaxed">
                  {product.description}
                </p>
                
                <div className="flex items-center space-x-4">
                  <span className="text-4xl lg:text-5xl font-bold text-black">
                    ₹ {product.price}
                  </span>
                  <div className="h-8 w-px bg-gray-300"></div>
                  <span className="text-gray-500 text-sm">Premium Quality</span>
                </div>
              </div>

              {message && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <div className="text-red-600 font-medium flex items-center space-x-2">
                    <span>{message}</span>
                  </div>
                </div>
              )}

              <button
                onClick={handleAddToCart}
                className="group relative w-full sm:w-auto px-8 py-4 bg-black hover:bg-gray-800 text-white font-bold text-lg rounded-2xl shadow-lg transition-all duration-300 transform hover:scale-105 overflow-hidden"
              >
                <span className="relative z-10">Add to Cart & Checkout</span>
              </button>

            
            </div>
          </div>
        </div>
      </div>

    </div>

  );
};

export default ProductDetails;