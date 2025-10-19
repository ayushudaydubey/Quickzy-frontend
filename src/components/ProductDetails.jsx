import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axios';

const ProductDetails = () => {
  const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [message, setMessage] = useState('');
    const [selectedImage, setSelectedImage] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
      axiosInstance.get(`/products/${id}`)
        .then(res => {
          setProduct(res.data);
          setSelectedImage(res.data.images[0]);
        })
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

    const openModal = (img) => {
      setSelectedImage(img);
      setIsModalOpen(true);
    };
    const closeModal = () => {
      setIsModalOpen(false);
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
                {/* Image gallery */}
                <div className="aspect-square lg:aspect-auto lg:h-[600px] overflow-hidden flex flex-col items-center">
                  {Array.isArray(product.images) && product.images.length > 0 ? (
                    <React.Fragment>
                      <img
                        src={selectedImage}
                        alt={product.title}
                        className="w-full h-96 object-center object-cover rounded mb-2"
                        onError={(e) => (e.target.src = '/fallback.jpg')}
                        onClick={() => openModal(selectedImage)}
                        style={{ cursor: 'pointer' }}
                      />
                      <div className="flex gap-2 mt-2 overflow-x-auto">
                        {product.images.map((img, idx) => (
                          <button key={idx} onClick={() => setSelectedImage(img)} className={`p-0 border-0 ${img === selectedImage ? 'ring-2 ring-blue-500 rounded' : ''}`}>
                            <img
                              src={img}
                              alt={`${product.title} ${idx + 1}`}
                              className="h-16 w-16 object-cover rounded"
                              onError={(e) => (e.target.src = '/fallback.jpg')}
                              onClick={() => openModal(img)}
                              style={{ cursor: 'pointer' }}
                            />
                          </button>
                        ))}
                      </div>
                    </React.Fragment>
                  ) : (
                    <img
                      src={product.image || '/fallback.jpg'}
                      alt={product.title}
                      className="w-full h-96 object-center object-cover rounded"
                      onError={(e) => (e.target.src = '/fallback.jpg')}
                    />
                  )}
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
        {/* Modal for fullscreen image */}
        {isModalOpen && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              background: "rgba(0,0,0,0.8)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 9999,
            }}
            onClick={closeModal}
          >
            <img
              src={selectedImage}
              alt="Full Screen"
              style={{
                maxWidth: "90vw",
                maxHeight: "90vh",
                boxShadow: "0 0 20px #000",
                borderRadius: "8px",
              }}
              onClick={(e) => e.stopPropagation()}
            />
            <button
              onClick={closeModal}
              style={{
                position: "absolute",
                top: 30,
                right: 40,
                fontSize: 32,
                color: "#fff",
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
              aria-label="Close"
            >
              &times;
            </button>
          </div>
        )}
      </div>
    );
  };

  }
  export default ProductDetails;