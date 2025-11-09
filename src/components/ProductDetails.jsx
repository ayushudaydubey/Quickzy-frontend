import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axios";
import ProductCard from "./ProductCard";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedImage, setSelectedImage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });

    let mounted = true;
    (async () => {
      try {
        const res = await axiosInstance.get(`/products/${id}`);
        if (!mounted) return;

        const data = res.data;
        setProduct(data);
        setSelectedImage(
          Array.isArray(data.images) && data.images.length > 0
            ? data.images[0]
            : data.image || ""
        );

        if (data.category) {
          const cat = encodeURIComponent(data.category);
          const rel = await axiosInstance.get(`/products?category=${cat}`);
          if (mounted && Array.isArray(rel.data)) {
            setRelatedProducts(rel.data.filter((p) => p._id !== data._id));
          }
        }
      } catch {
        setMessage("Product not found");
      }
    })();

    return () => (mounted = false);
  }, [id]);

  // Cart/checkout feature removed; wishlist remains only

  const getImages = () =>
    Array.isArray(product?.images)
      ? product.images
      : product?.image
      ? [product.image]
      : [];

  const showNext = useCallback(() => {
    const imgs = getImages();
    if (!imgs.length) return;
    const next = (imgs.indexOf(selectedImage) + 1) % imgs.length;
    setSelectedImage(imgs[next]);
  }, [selectedImage, product]);

  const showPrev = useCallback(() => {
    const imgs = getImages();
    if (!imgs.length) return;
    const prev =
      (imgs.indexOf(selectedImage) - 1 + imgs.length) % imgs.length;
    setSelectedImage(imgs[prev]);
  }, [selectedImage, product]);

  useEffect(() => {
    if (!isModalOpen) return;
    const keyHandler = (e) => {
      if (e.key === "ArrowRight") showNext();
      if (e.key === "ArrowLeft") showPrev();
      if (e.key === "Escape") setIsModalOpen(false);
    };
    window.addEventListener("keydown", keyHandler);
    return () => window.removeEventListener("keydown", keyHandler);
  }, [isModalOpen, showNext, showPrev]);

  if (!product) {
    return (
      <div className="min-h-screen bg-white flex justify-center items-center text-zinc-900">
        <div className="text-center space-y-4">
          <div className="w-14 h-14 border-4 border-zinc-900 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xl">{message || "Loading product..."}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-zinc-900 px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="rounded-2xl shadow-xl bg-white overflow-hidden border border-zinc-200">
          <div className="flex flex-col lg:flex-row">
            {/* ---------- Left: Images ---------- */}
            <div className="lg:w-1/2 p-4 flex flex-col items-center">
              <img
                src={selectedImage}
                alt={product.title}
                loading="lazy"
                decoding="async"
                className="w-full h-[480px] object-cover rounded-xl cursor-pointer transition-transform duration-300 hover:scale-105"
                onClick={() => setIsModalOpen(true)}
                onError={(e) => (e.target.src = "/fallback.jpg")}
              />
              <div className="flex gap-2 mt-4 overflow-x-auto">
                {getImages().map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`border-2 rounded-lg p-0.5 transition-all duration-200 ${
                      img === selectedImage
                        ? "border-zinc-900"
                        : "border-transparent hover:border-zinc-400"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`thumb-${idx}`}
                      loading="lazy"
                      decoding="async"
                      className="h-16 w-16 object-cover rounded-md"
                      onError={(e) => (e.target.src = "/fallback.jpg")}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* ---------- Right: Details ---------- */}
            <div className="lg:w-1/2 p-8 flex flex-col justify-center space-y-8">
              <div>
                <h1 className="text-4xl lg:text-5xl font-extrabold mb-4">
                  {product.title}
                </h1>
                <p className="text-zinc-700 text-lg leading-relaxed">
                  {product.description}
                </p>
                <div className="flex items-center gap-4 mt-6">
                  <span className="text-4xl font-bold text-zinc-900">
                    ₹ {product.price}
                  </span>
                  <div className="h-6 w-px bg-zinc-300"></div>
                  <span className="text-zinc-500 text-sm">Premium Quality</span>
                </div>
              </div>

              {message && (
                <div className="bg-red-100 border border-red-300 rounded-xl p-4 text-red-700">
                  {message}
                </div>
              )}

              <button
                onClick={() => navigate(`/checkout/${id}`, { state: { quantity: 1 } })}
                className="px-8 py-4 bg-zinc-900 text-white rounded-xl font-semibold hover:bg-zinc-800 transition-transform duration-300 hover:scale-105 shadow-md"
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>

        {/* ---------- Related Products ---------- */}
        {relatedProducts.length > 0 && (
          <div className="mt-12">
            <h3 className="text-2xl font-semibold mb-6">Related Products</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ---------- Modal ---------- */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          onClick={() => setIsModalOpen(false)}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              showPrev();
            }}
            className="absolute left-6 text-white text-4xl hover:text-gray-400"
          >
            ‹
          </button>

          <img
            src={selectedImage}
            alt="preview"
            loading="lazy"
            decoding="async"
            className="max-w-[90vw] max-h-[90vh] rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />

          <button
            onClick={(e) => {
              e.stopPropagation();
              showNext();
            }}
            className="absolute right-6 text-white text-4xl hover:text-gray-400"
          >
            ›
          </button>

          <button
            onClick={() => setIsModalOpen(false)}
            className="absolute top-6 right-8 text-4xl text-white hover:text-gray-400"
          >
            &times;
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
