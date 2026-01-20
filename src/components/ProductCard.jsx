import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { ShoppingCart, Zap, Image as ImageIcon } from "lucide-react";
import { addToCart, loadCart } from "../store/Reducers/cartSlice";
import axiosInstance from "../utils/axios";

const truncateWords = (text, limit = 15) => {
  if (!text) return "";
  const words = text.split(" ");
  return words.length <= limit
    ? text
    : words.slice(0, limit).join(" ") + "...";
};

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);

  const handleCardClick = () => {
    navigate(`/product/${product._id}`);
  };

  const handleBuyNow = (e) => {
    e.stopPropagation();
    if (!user) {
      navigate(
        `/login?redirect=${encodeURIComponent(
          `/checkout/${product._id}?quantity=1`
        )}`
      );
      return;
    }
    navigate(`/checkout/${product._id}`, { state: { quantity: 1 } });
  };

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    try {
      await dispatch(addToCart(product._id)).unwrap();
      await dispatch(loadCart()).unwrap().catch(() => {});
      toast.success(`${product.title} added to your cart list`);
    } catch (err) {
      toast.error("please login to add items to cart");
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
          val.url ||
          val.secure_url ||
          val.path ||
          val.src ||
          val.publicUrl ||
          val.public_id ||
          ""
        );
      }
      return "";
    };

    let raw = "";
    if (Array.isArray(product?.images)) {
      for (const it of product.images) {
        const u = extractUrl(it);
        if (u && u.trim() !== "") {
          raw = u;
          break;
        }
      }
    }

    if (!raw) raw = extractUrl(product?.image) || "";

    let imgSrc = raw || DEFAULT_FALLBACK;

    if (typeof imgSrc === "string" && imgSrc.startsWith("/")) {
      const base =
        (axiosInstance &&
          axiosInstance.defaults &&
          axiosInstance.defaults.baseURL) ||
        "";
      imgSrc = (base.replace(/\/$/, "") || "") + imgSrc;
    }

    return imgSrc;
  };

  const imgSrc = getProductImageUrl();

  return (
    <div
      onClick={handleCardClick}
      className="
        relative bg-white border border-gray-200 rounded-2xl overflow-hidden
        transition-all duration-500 ease-out cursor-pointer
        w-full sm:max-w-[350px]
        h-[400px]
        flex flex-col group
      "
    >
      {/* image */}
      <div className="overflow-hidden h-52 relative bg-gray-50">
        <img
          src={imgSrc}
          alt={product.title}
          className="w-full h-full object-scale-down transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
          onError={(e) => (e.currentTarget.src = DEFAULT_FALLBACK)}
        />

        {Array.isArray(product.images) && product.images.length > 1 && (
          <span className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] flex items-center gap-1 px-2 py-1 rounded-full">
            <ImageIcon size={12} />
            {product.images.length}
          </span>
        )}
      </div>

      {/* content */}
      <div className="p-4 sm:p-5 flex flex-col flex-grow">
        <div>
          <h3 className="text-gray-900 text-lg sm:text-xl font-bold mb-2 capitalize truncate">
            {truncateWords(product.title, 3)}
          </h3>
          <p className="text-gray-600 text-xs sm:text-sm mb-3 leading-tight font-medium line-clamp-2">
            {truncateWords(product.description, 10)}
          </p>
        </div>

        {/* price + buttons */}
        <div className="mt-auto pt-3 border-t border-gray-200">
          <div className="flex items-center justify-between gap-3">
            <span className="text-lg sm:text-xl font-semibold text-black whitespace-nowrap">
              ₹{product.price}
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={handleAddToCart}
                className="
                  flex items-center justify-center
                  bg-white border border-gray-300 text-black
                  hover:bg-black hover:text-white
                  p-2 sm:p-2.5
                  rounded-lg transition-all duration-300
                "
              >
                <ShoppingCart size={16} />
              </button>

              <button
                onClick={handleBuyNow}
                className="
                  flex items-center gap-1
                  bg-black hover:bg-zinc-900 text-white
                  px-3 py-1.5 sm:px-4 sm:py-2
                  text-[10px] sm:text-sm font-light
                  rounded-lg transition-all duration-300
                "
              >
                <Zap size={16} /> Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
