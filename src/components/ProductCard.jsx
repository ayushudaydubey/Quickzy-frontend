import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
// Ensure you have lucide-react installed for these icons
import { ShoppingCart, Zap, Image as ImageIcon } from "lucide-react"; 
import { addToCart, loadCart } from "../store/Reducers/cartSlice";
import axiosInstance from "../utils/axios";

const truncateWords = (text, limit = 15) => {
  if (!text) return "";
  const words = text.split(" ");
  return words.length <= limit ? text : words.slice(0, limit).join(" ") + "...";
};

// **Updated Monochromatic ProductCard Component (No Blur)**
const ProductCard = ({ product, showBuy = false }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleCardClick = () => {
    navigate(`/product/${product._id}`);
  };

  const handleBuyNow = (e) => {
    e.stopPropagation();
    navigate(`/product/${product._id}`, { state: { quantity: 1 } });
  };

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    try {
      await dispatch(addToCart(product._id)).unwrap();
      await dispatch(loadCart()).unwrap().catch(() => {});
      toast.success(`${product.title} added to your cart list `);
    } catch (err) {
      toast.error("Please login to add items to cart");
      navigate(`/login?redirect=/product/${product._id}`);
    }
  };

  const DEFAULT_FALLBACK = "https://via.placeholder.com/600x400?text=No+Image";

  const getProductImageUrl = () => {
    const extractUrl = (val) => {
      if (!val) return "";
      if (typeof val === "string") return val;
      if (typeof val === "object") {
        return (
          val.url || val.secure_url || val.path || val.src || val.publicUrl || val.public_id || ""
        );
      }
      return "";
    };

    let raw = "";
    if (Array.isArray(product?.images)) {
      for (const it of product.images) {
        const u = extractUrl(it);
        if (u && typeof u === "string" && u.trim() !== "") {
          raw = u;
          break;
        }
      }
    }

    if (!raw) raw = extractUrl(product?.image) || "";

    let imgSrc = raw || DEFAULT_FALLBACK;

    if (typeof imgSrc === "string" && imgSrc.startsWith("/")) {
      const base =
        (axiosInstance && axiosInstance.defaults && axiosInstance.defaults.baseURL) || "";
      imgSrc = (base.replace(/\/$/, "") || "") + imgSrc;
    }

    return imgSrc;
  };

  const imgSrc = getProductImageUrl();

  return (
    <div
      onClick={handleCardClick}
      // Fixed card height so all product cards are uniform
      className="relative bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 ease-out cursor-pointer w-full max-w-[330px] h-[420px] flex flex-col group hover:-translate-y-2"
    >
      <div className="overflow-hidden h-56 relative bg-gray-50">
        <img
          src={imgSrc}
          alt={product.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
          onError={(e) => {
            if (!e.currentTarget.src || !e.currentTarget.src.includes("placeholder.com")) {
              e.currentTarget.src = DEFAULT_FALLBACK;
            }
          }}
        />

        {Array.isArray(product.images) && product.images.length > 1 && (
          // Removed backdrop-blur-md
          <span className="absolute bottom-3 right-3 bg-black/80 text-white text-[10px] flex items-center gap-1 px-2 py-1 rounded-full">
            <ImageIcon size={12} /> {product.images.length}
          </span>
        )}

        {/* Action Overlay (Modern Hover Effect) */}
        {/* Removed backdrop-blur-sm */}
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <button
            onClick={handleAddToCart}
            // Add to Cart Button is high-contrast white/black and scales on hover
            className="bg-white text-black p-4 rounded-full shadow-xl hover:bg-gray-200 transition-all duration-300 scale-90 group-hover:scale-110"
            title="Add to cart"
          >
            <ShoppingCart size={22} />
          </button>
        </div>
      </div>

      <div className="p-5 flex flex-col justify-between flex-grow">
        <div>
          <h3 className="text-gray-900 text-xl font-bold leading-snug mb-1 capitalize truncate h-10 overflow-hidden">
            {truncateWords(product.title, 3)}
          </h3>
          <p className="text-gray-600 text-sm mb-3 leading-tight font-medium h-16 overflow-hidden">
            {truncateWords(product.description, 10)}
          </p>
        </div>

        <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-200">
          <span className="text-2xl font-extrabold text-black">₹{product.price}</span>

          <button
            onClick={handleBuyNow}
            className="flex items-center gap-1 bg-black hover:bg-gray-800 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-all duration-300 shadow-lg hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-gray-400/40"
            title="Buy Now"
          >
            <Zap size={18} /> Buy Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;