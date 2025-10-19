import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axios';

const useAddToCart = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);

  const addToCart = async (product, quantity = 1) => {
    // Check if user is logged in
    if (!user) {
      navigate('/login');
      return { success: false, message: 'Please login to add items to cart' };
    }

    try {
      setLoading(true);
      
      const response = await axiosInstance.post('/cart/add-to-cart', {
        productId: product._id,
        quantity,
        title: product.title,
        price: product.price,
    image: (Array.isArray(product.images) && product.images[0]) || product.image
      });

      return { 
        success: true, 
        message: 'Product added to cart successfully!',
        data: response.data 
      };
      
    } catch (error) {
      console.error('Error adding to cart:', error);
      
      if (error.response?.status === 401) {
        navigate('/login');
        return { success: false, message: 'Session expired. Please login again.' };
      }
      
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to add product to cart' 
      };
    } finally {
      setLoading(false);
    }
  };

  return { addToCart, loading };
};

export default useAddToCart;