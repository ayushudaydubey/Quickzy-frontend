import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { addToCart } from "../store/Reducers/cartSlice";

const truncateWords = (text, limit = 15) => {
  if (!text) return "";
  const words = text.split(" ");
  return words.length <= limit ? text : words.slice(0, limit).join(" ") + "...";
};

const ProductCard = ({ product, showBuy = false }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleCardClick = () => {
    navigate(`/product/${product._id}`);
  };

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    try {
      await dispatch(addToCart(product._id)).unwrap();
      toast.success("Added to cart!");
    } catch {
      toast.error("Please login first");
      navigate(`/login?redirect=/product/${product._id}`);
    }
  };

  const handleBuyNow = (e) => {
    e.stopPropagation();
    navigate(`/checkout/${product._id}`, { state: { quantity: 1 } });
  };

  return (
    <div
      onClick={handleCardClick}
      className="bg-white border border-zinc-200 hover:border-zinc-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer w-[300px] h-[380px] flex flex-col group relative"
    >
      {/* Image Section */}
      <div className="overflow-hidden h-[60%] relative">
        <img
          src={(Array.isArray(product.images) && product.images[0]) || product.image}
          alt={product.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        {Array.isArray(product.images) && product.images.length > 1 && (
          <span className="absolute top-3 right-3 bg-zinc-900 text-white text-[10px] px-2 py-1 rounded-full">
            {product.images.length} Images
          </span>
        )}
      </div>

      {/* Details Section */}
      <div className="p-4 flex flex-col justify-between flex-grow">
        <div>
          <h3 className="text-zinc-950 text-lg font-semibold leading-tight mb-2 truncate">
            {truncateWords(product.title, 3)}
          </h3>
          <p className="text-zinc-600 text-sm mb-4 leading-snug line-clamp-3">
            {truncateWords(product.description, 15)}
          </p>
        </div>

        <div className="flex items-center justify-between mt-auto">
          <span className="text-lg font-semibold text-zinc-950">
            ₹{product.price}
          </span>

          {showBuy ? (
            <button
              onClick={handleBuyNow}
              className="bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-medium px-4 py-2 rounded-full transition-all duration-300"
            >
              Buy Now
            </button>
          ) : (
            <button
              onClick={handleAddToCart}
              className="border border-zinc-900 text-zinc-900 hover:bg-zinc-900 hover:text-white text-xs font-medium px-4 py-2 rounded-full transition-all duration-300"
            >
              Add to Cart
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
