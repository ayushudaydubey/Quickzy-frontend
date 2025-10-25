import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { addToCart } from '../store/Reducers/cartSlice';
import axiosInstance from '../utils/axios';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleCardClick = () => {
    console.log('ProductCard click:', product._id);
    navigate(`/product/${product._id}`);
  };

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      // Dispatch thunk which handles the API call + errors
      await dispatch(addToCart(product._id)).unwrap();
      toast.success('Product added to cart!');
    } catch (error) {
      console.error('Add to cart error:', error);
      // If unauthorized, redirect to login with return URL
      if (error?.response?.status === 401) {
        navigate(`/login?redirect=/product/${product._id}`);
      } else {
        toast.error('Please login to add items to your cart');
        navigate(`/login?redirect=/product/${product._id}`);
      }
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition duration-300 cursor-pointer overflow-hidden flex flex-col transform hover:-translate-y-1"
    >
      {/* image count badge */}
      {Array.isArray(product.images) && product.images.length > 1 && (
        <div className="absolute mt-3 mr-3 right-0 z-10">
          <span className="bg-black text-white text-xs px-2 py-1 rounded">{product.images.length} images</span>
        </div>
      )}
      <div className="overflow-hidden">
        <img
          src={(Array.isArray(product.images) && product.images[0]) || product.image}
          alt={product.title}
          className="w-full h-60 object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>

      <div className="p-4 flex flex-col flex-grow justify-between">
        <h3 className="text-xl font-semibold text-gray-800 mb-1">{product.title}</h3>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>

        <div className="mt-auto flex items-center justify-between">
          <span className="text-zinc-950 text-lg font-bold">₹{product.price}</span>
          <button
            onClick={handleAddToCart} //Fixed here
            className="bg-zinc-900 hover:bg-zinc-950 text-white text-sm font-medium px-4 py-2 rounded-lg transition duration-300"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
