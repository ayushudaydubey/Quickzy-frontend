import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import axiosInstance from "../utils/axios";
import { addToCart, loadCart } from "../store/Reducers/cartSlice";
import ProductCard from "./ProductCard";
import {
  ArrowLeft,
  ChevronRight,
  Truck,
  ShieldCheck,
  RotateCcw,
  ShoppingCart,
  Zap,
  ZoomIn,
  X,
  ChevronLeft,
  Check
} from "lucide-react";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedImage, setSelectedImage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [message, setMessage] = useState("");

  const getEstimatedDeliveryDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 3);
    return date.toLocaleDateString("en-IN", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

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
            ? (typeof data.images[0] === "string" ? data.images[0] : data.images[0]?.url || data.images[0]?.secure_url || "")
            : typeof data.image === "string" ? data.image : data.image?.url || ""
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

  const getImages = () => {
    if (!product) return [];
    if (Array.isArray(product.images) && product.images.length > 0) {
      return product.images.map((img) =>
        typeof img === "string" ? img : img?.url || img?.secure_url || img?.src || ""
      ).filter(Boolean);
    }
    if (product.image) {
      const url = typeof product.image === "string" ? product.image : product.image?.url || product.image?.secure_url || "";
      return url ? [url] : [];
    }
    return [];
  };

  const imagesList = getImages();

  const showNext = useCallback(() => {
    if (!imagesList.length) return;
    const next = (imagesList.indexOf(selectedImage) + 1) % imagesList.length;
    setSelectedImage(imagesList[next]);
  }, [selectedImage, imagesList]);

  const showPrev = useCallback(() => {
    if (!imagesList.length) return;
    const prev = (imagesList.indexOf(selectedImage) - 1 + imagesList.length) % imagesList.length;
    setSelectedImage(imagesList[prev]);
  }, [selectedImage, imagesList]);

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

  // Handle Buy Now
  const handleBuyNow = () => {
    if (!user) {
      navigate(`/login?redirect=${encodeURIComponent(`/checkout/${id}?quantity=${quantity}`)}`);
      return;
    }
    navigate(`/checkout/${id}`, { state: { quantity } });
  };

  // Handle Add To Cart
  const handleAddToCart = async () => {
    if (!user) {
      navigate(`/login?redirect=${encodeURIComponent(`/product/${id}`)}`);
      return;
    }
    setAddingToCart(true);
    try {
      await dispatch(addToCart(product._id)).unwrap();
      await dispatch(loadCart()).unwrap().catch(() => {});
      toast.success(`${product.title} added to your cart`);
    } catch (err) {
      toast.error("Failed to add product to cart");
    } finally {
      setAddingToCart(false);
    }
  };

  if (!product) {
    return (
      <div className="min-h-[75vh] bg-zinc-50 flex justify-center items-center text-zinc-900">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-2 border-zinc-900 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm font-medium text-zinc-600">{message || "Loading product..."}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* ================= BREADCRUMBS ================= */}
        <div className="flex items-center justify-between gap-4 pb-2">
          <div className="flex items-center gap-1.5 text-xs text-zinc-500 overflow-x-auto whitespace-nowrap">
            <Link to="/" className="hover:text-zinc-900 transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
            {product.category && (
              <>
                <Link
                  to={`/product?category=${encodeURIComponent(product.category)}`}
                  className="hover:text-zinc-900 transition-colors"
                >
                  {product.category}
                </Link>
                <ChevronRight className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
              </>
            )}
            <span className="text-zinc-800 font-medium truncate max-w-[200px] sm:max-w-xs">
              {product.title}
            </span>
          </div>

          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1 text-xs font-medium text-zinc-600 hover:text-zinc-900 bg-white border border-zinc-200 px-3 py-1.5 rounded-lg hover:bg-zinc-100 transition-colors shrink-0 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back</span>
          </button>
        </div>

        {/* ================= MAIN PRODUCT CARD ================= */}
        <div className="bg-white rounded-2xl border border-zinc-200 shadow-xs p-6 sm:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* ---------- Left Column: Images (6 cols) ---------- */}
            <div className="lg:col-span-6 space-y-4">
              {/* Main Showcase Image */}
              <div className="relative group w-full aspect-square rounded-2xl overflow-hidden bg-zinc-100 border border-zinc-200 flex items-center justify-center">
                <img
                  src={selectedImage || "https://placehold.co/600x600/F4F4F5/71717A?text=No+Image"}
                  alt={product.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 cursor-pointer"
                  onClick={() => setIsModalOpen(true)}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://placehold.co/600x600/F4F4F5/71717A?text=No+Image";
                  }}
                />

                {/* Zoom Hint Icon */}
                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className="absolute bottom-3 right-3 p-2 rounded-lg bg-white/90 hover:bg-white text-zinc-800 shadow-xs border border-zinc-200 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  title="Click to zoom image"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>

                {/* Left/Right controls if multiple images */}
                {imagesList.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        showPrev();
                      }}
                      className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 hover:bg-white text-zinc-800 shadow-xs border border-zinc-200 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        showNext();
                      }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 hover:bg-white text-zinc-800 shadow-xs border border-zinc-200 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnails Row */}
              {imagesList.length > 1 && (
                <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbarHide">
                  {imagesList.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedImage(img)}
                      className={`relative shrink-0 w-16 h-16 rounded-xl overflow-hidden border transition-all cursor-pointer ${
                        img === selectedImage
                          ? "border-zinc-900 ring-2 ring-zinc-900/10 shadow-xs"
                          : "border-zinc-200 hover:border-zinc-400 opacity-75 hover:opacity-100"
                      }`}
                    >
                      <img
                        src={img}
                        alt={`thumbnail-${idx}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://placehold.co/100x100/F4F4F5/71717A?text=No+Image";
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* ---------- Right Column: Product Details (6 cols) ---------- */}
            <div className="lg:col-span-6 space-y-6">
              
              {/* Header Badges & Title */}
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  {product.category && (
                    <span className="text-[11px] font-medium uppercase tracking-wider text-zinc-700 bg-zinc-100 border border-zinc-200 px-2.5 py-0.5 rounded-md">
                      {product.category}
                    </span>
                  )}
                  <span className="text-[11px] font-medium text-zinc-700 bg-zinc-100 border border-zinc-200 px-2.5 py-0.5 rounded-md flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-900"></span>
                    In Stock • Ready to Dispatch
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-medium tracking-tight text-zinc-900 leading-tight">
                  {product.title}
                </h1>
              </div>

              {/* Price Block */}
              <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-4 flex items-baseline justify-between">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl sm:text-3xl font-semibold text-zinc-900">
                      ₹{Number(product.price).toLocaleString("en-IN")}
                    </span>
                  </div>
                  <span className="text-xs text-zinc-500 font-normal">
                    Inclusive of all taxes & free shipping
                  </span>
                </div>
                <span className="text-xs font-medium text-zinc-700 bg-zinc-200/80 border border-zinc-300 px-2.5 py-1 rounded-md">
                  Premium Quality
                </span>
              </div>

              {/* Product Description */}
              <div className="space-y-2">
                <h4 className="text-xs font-medium uppercase tracking-wider text-zinc-400">
                  Description
                </h4>
                <p className="text-sm text-zinc-600 leading-relaxed font-normal">
                  {product.description || "No description provided for this product."}
                </p>
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center gap-3 pt-2 border-t border-zinc-100">
                <span className="text-xs font-medium text-zinc-700">Quantity:</span>
                <div className="inline-flex items-center border border-zinc-200 rounded-xl bg-zinc-50 p-0.5">
                  <button
                    type="button"
                    className={`w-8 h-8 flex items-center justify-center rounded-lg text-zinc-700 font-medium transition ${
                      quantity <= 1
                        ? "text-zinc-300 cursor-not-allowed"
                        : "hover:bg-white hover:shadow-xs active:scale-95 cursor-pointer"
                    }`}
                    onClick={() => setQuantity((n) => Math.max(1, n - 1))}
                    disabled={quantity <= 1}
                  >
                    −
                  </button>
                  <span className="w-9 text-center text-xs font-medium text-zinc-900">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-700 font-medium hover:bg-white hover:shadow-xs active:scale-95 transition cursor-pointer"
                    onClick={() => {
                      if (quantity >= 10) {
                        toast.warn("Maximum 10 units allowed");
                        return;
                      }
                      setQuantity((n) => n + 1);
                    }}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleBuyNow}
                  className="w-full py-3.5 px-6 bg-zinc-900 hover:bg-black text-white text-sm font-medium rounded-xl transition-all active:scale-[0.99] flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                >
                  <Zap className="w-4 h-4 text-zinc-300" />
                  <span>Buy Now</span>
                </button>

                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={addingToCart}
                  className="w-full py-3.5 px-6 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 border border-zinc-200 text-sm font-medium rounded-xl transition-all active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShoppingCart className="w-4 h-4 text-zinc-700" />
                  <span>{addingToCart ? "Adding..." : "Add to Cart"}</span>
                </button>
              </div>

              {/* Delivery ETA Pill */}
              <div className="bg-zinc-50 rounded-xl p-3.5 border border-zinc-200 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-zinc-200 flex items-center justify-center text-zinc-800 shrink-0">
                  <Truck className="w-4 h-4" />
                </div>
                <div className="text-xs">
                  <span className="font-medium text-zinc-900">
                    Quickzy Express Delivery:{" "}
                  </span>
                  <span className="text-zinc-600">
                    Estimated delivery in 3 days (
                    <strong className="text-zinc-900 font-medium">
                      {getEstimatedDeliveryDate()}
                    </strong>
                    )
                  </span>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-3 pt-2 border-t border-zinc-100 text-center">
                <div className="p-2 space-y-1">
                  <ShieldCheck className="w-4 h-4 text-zinc-700 mx-auto" />
                  <p className="text-[11px] font-medium text-zinc-900">100% Genuine</p>
                  <p className="text-[10px] text-zinc-500">Verified authentic</p>
                </div>
                <div className="p-2 space-y-1 border-x border-zinc-100">
                  <RotateCcw className="w-4 h-4 text-zinc-700 mx-auto" />
                  <p className="text-[11px] font-medium text-zinc-900">7 Days Return</p>
                  <p className="text-[10px] text-zinc-500">Easy replacement</p>
                </div>
                <div className="p-2 space-y-1">
                  <Truck className="w-4 h-4 text-zinc-700 mx-auto" />
                  <p className="text-[11px] font-medium text-zinc-900">Free Shipping</p>
                  <p className="text-[10px] text-zinc-500">On all orders</p>
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* ================= RELATED PRODUCTS ================= */}
        {relatedProducts.length > 0 && (
          <div className="space-y-4 pt-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg sm:text-xl font-medium text-zinc-900">
                Related Products
              </h3>
              <Link
                to={`/product?category=${encodeURIComponent(product.category || "")}`}
                className="text-xs font-medium text-zinc-600 hover:text-zinc-900 underline"
              >
                View all in {product.category} →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {relatedProducts.slice(0, 4).map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          </div>
        )}

      </div>

      {/* ================= LIGHTBOX / IMAGE MODAL ================= */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-zinc-950/80 backdrop-blur-xs flex items-center justify-center z-50 p-4"
          onClick={() => setIsModalOpen(false)}
        >
          <div className="relative max-w-4xl max-h-[90vh] flex flex-col items-center">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute -top-12 right-0 p-2 text-zinc-300 hover:text-white bg-zinc-800/80 rounded-full transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <img
              src={selectedImage}
              alt="preview"
              loading="lazy"
              className="max-w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl border border-zinc-800 bg-black"
              onClick={(e) => e.stopPropagation()}
            />

            {imagesList.length > 1 && (
              <div className="flex items-center gap-4 mt-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    showPrev();
                  }}
                  className="p-2 text-zinc-200 hover:text-white bg-zinc-800/80 hover:bg-zinc-700 rounded-full transition cursor-pointer"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="text-xs font-medium text-zinc-400">
                  {imagesList.indexOf(selectedImage) + 1} / {imagesList.length}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    showNext();
                  }}
                  className="p-2 text-zinc-200 hover:text-white bg-zinc-800/80 hover:bg-zinc-700 rounded-full transition cursor-pointer"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

export default ProductDetails;
