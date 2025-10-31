import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axios";
import ProductCard from './ProductCard';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [message, setMessage] = useState("");
  const [selectedImage, setSelectedImage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    let mounted = true;
    axiosInstance
      .get(`/products/${id}`)
      .then((res) => {
        if (!mounted) return;
        setProduct(res.data);
        const first =
          Array.isArray(res.data.images) && res.data.images.length > 0
            ? res.data.images[0]
            : res.data.image || "";
        setSelectedImage(first);
        // fetch related products by same category (exclude current product)
        if (res.data?.category) {
          const cat = encodeURIComponent(res.data.category);
          axiosInstance
            .get(`/products?category=${cat}`)
            .then((r) => {
              if (!mounted) return;
              const related = Array.isArray(r.data) ? r.data.filter(p => p._id !== res.data._id) : [];
              setRelatedProducts(related);
            })
            .catch(() => {
              // ignore related fetch errors
            });
        }
      })
      .catch(() => setMessage(" Product not found"));
    return () => {
      mounted = false;
    };
  }, [id]);

  const [relatedProducts, setRelatedProducts] = useState([]);

  const performAddToCart = useCallback(async () => {
    try {
      await axiosInstance.post(
        "/cart/add-to-cart",
        { productId: id },
        { withCredentials: true }
      );
      navigate(`/checkout/${id}`, { state: { quantity: 1 } });
    } catch (err) {
      console.error("Add to cart failed", err);
      setMessage(" Failed to add to cart");
    }
  }, [id, navigate]);

  const handleAddToCart = async () => {
    try {
      await axiosInstance.get("/me", { withCredentials: true });
      performAddToCart();
    } catch {
      navigate(`/login?redirect=/product/${id}`);
    }
  };

  const openModal = (img) => {
    if (img) setSelectedImage(img);
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const getImages = () =>
    Array.isArray(product?.images) && product.images.length > 0
      ? product.images
      : product?.image
      ? [product.image]
      : [];

  const showNext = (e) => {
    if (e) e.stopPropagation();
    const imgs = getImages();
    if (!imgs.length) return;
    const idx = imgs.indexOf(selectedImage);
    const next = idx === -1 ? 0 : (idx + 1) % imgs.length;
    setSelectedImage(imgs[next]);
  };

  const showPrev = (e) => {
    if (e) e.stopPropagation();
    const imgs = getImages();
    if (!imgs.length) return;
    const idx = imgs.indexOf(selectedImage);
    const prev =
      idx === -1 ? imgs.length - 1 : (idx - 1 + imgs.length) % imgs.length;
    setSelectedImage(imgs[prev]);
  };

  // keyboard navigation
  useEffect(() => {
    if (!isModalOpen) return;
    const handler = (ev) => {
      if (ev.key === "ArrowRight") showNext();
      if (ev.key === "ArrowLeft") showPrev();
      if (ev.key === "Escape") closeModal();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isModalOpen, selectedImage, product]);

  if (!product) {
    return (
      <div className="min-h-screen bg-white flex justify-center items-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-black text-xl font-medium">
            {message || "Loading product..."}
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
            {/* ---------- Left: Images ---------- */}
            <div className="lg:w-1/2 relative">
              <div className="aspect-square lg:h-[600px] overflow-hidden flex flex-col items-center">
                {Array.isArray(product.images) && product.images.length > 0 ? (
                  <>
                    <img
                      src={selectedImage}
                      alt={product.title}
                      className="w-full h-96 object-center object-cover rounded mb-2 cursor-pointer transition-transform duration-300 hover:scale-105"
                      onClick={() => openModal(selectedImage)}
                      onError={(e) => (e.target.src = "/fallback.jpg")}
                    />
                    <div
                      className="flex gap-2 mt-2 overflow-x-auto pb-2"
                      aria-label="Product thumbnails"
                    >
                      {product.images.map((img, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => openModal(img)}
                          className={`flex-shrink-0 p-0 border-0 rounded ${
                            img === selectedImage
                              ? "ring-2 ring-blue-500"
                              : "hover:ring-2 hover:ring-gray-300"
                          }`}
                          aria-label={`View ${product.title} image ${idx + 1}`}
                        >
                          <img
                            src={img}
                            alt={`${product.title} ${idx + 1}`}
                            className="h-16 w-16 object-cover rounded"
                            onError={(e) => (e.target.src = "/fallback.jpg")}
                          />
                        </button>
                      ))}
                    </div>
                  </>
                ) : (
                  <img
                    src={product.image || "/fallback.jpg"}
                    alt={product.title}
                    className="w-full h-96 object-center object-cover rounded"
                    onError={(e) => (e.target.src = "/fallback.jpg")}
                  />
                )}
              </div>
            </div>

            {/* ---------- Right: Details ---------- */}
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
                className="group relative w-full sm:w-auto px-8 py-4 bg-black hover:bg-gray-800 text-white font-bold text-lg rounded-2xl shadow-lg transition-all duration-300 transform hover:scale-105"
              >
                <span className="relative z-10">Add to Cart & Checkout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ---------- Modal ---------- */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-[9999]"
          onClick={closeModal}
          role="dialog"
          aria-modal="true"
        >
          {/* Prev Button */}
          <button
            onClick={(e) => showPrev(e)}
            aria-label="Previous image"
            className="absolute left-5 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full 
                       bg-white/10 border border-white/20 text-white text-3xl 
                       flex items-center justify-center backdrop-blur-sm hover:bg-white/20"
          >
            ‹
          </button>

          {/* Image */}
          <img
            src={selectedImage}
            alt="Full Screen"
            className="max-w-[90vw] max-h-[90vh] rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />

          {/* Next Button */}
          <button
            onClick={(e) => showNext(e)}
            aria-label="Next image"
            className="absolute right-5 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full 
                       bg-white/10 border border-white/20 text-white text-3xl 
                       flex items-center justify-center backdrop-blur-sm hover:bg-white/20"
          >
            ›
          </button>

          {/* Close Button */}
          <button
            onClick={closeModal}
            aria-label="Close"
            className="absolute top-6 right-8 text-4xl text-white hover:text-gray-300"
          >
            &times;
          </button>
        </div>
      )}

        {/* ---------- Related Products ---------- */}
        {relatedProducts && relatedProducts.length > 0 && (
          <div className="max-w-7xl mx-auto mt-12 px-4">
            <h3 className="text-2xl font-semibold mb-6">Related Products</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p._id} product={p} showBuy={true} />
              ))}
            </div>
          </div>
        )}
    </div>
  );
};

export default ProductDetails;
