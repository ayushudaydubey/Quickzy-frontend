import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { addToWishlist, removeFromWishlist } from '../store/Reducers/wishlistSlice';
import axiosInstance from '../utils/axios';

const truncateWords = (text, limit = 15) => {
  if (!text) return "";
  const words = text.split(" ");
  return words.length <= limit ? text : words.slice(0, limit).join(" ") + "...";
};

const ProductCard = ({ product, showBuy = false }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // cart feature removed; keep wishlist only
  const wishlistItems = useSelector((state) => state.wishlist.items || []);
  const isWishlisted = wishlistItems.some((p) => String(p._id || p) === String(product._id));

  const handleCardClick = () => {
    navigate(`/product/${product._id}`);
  };

  const handleWishlistToggle = async (e) => {
    e.stopPropagation();
    try {
      if (isWishlisted) {
        await dispatch(removeFromWishlist(product._id)).unwrap();
        toast.success('Removed from wishlist');
      } else {
        await dispatch(addToWishlist(product._id)).unwrap();
        toast.success('Added to wishlist');
      }
    } catch (err) {
      toast.error('Please login to manage wishlist');
      navigate(`/login?redirect=/product/${product._id}`);
    }
  };

  const handleBuyNow = (e) => {
    e.stopPropagation();
    navigate(`/product/${product._id}`, { state: { quantity: 1 } });
  };

  return (
    <div
      onClick={handleCardClick}
      className="bg-white border border-zinc-200 hover:border-zinc-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer w-[300px] h-[380px] flex flex-col group relative"
    >
      {/* Image Section */}
      <div className="overflow-hidden h-[60%] relative">
        {(() => {
          // pick first valid image string from product.images or product.image
          let raw = null;
          if (Array.isArray(product?.images)) {
            raw = product.images.find((it) => typeof it === 'string' && it.trim() !== '') || null;
          }
          if (!raw && typeof product?.image === 'string') raw = product.image;
          // fallback
          const DEFAULT_FALLBACK = 'https://via.placeholder.com/600x400?text=No+Image';
          let imgSrc = raw || DEFAULT_FALLBACK;
          // if relative path, prefix backend baseURL
          if (typeof imgSrc === 'string' && imgSrc.startsWith('/')) {
            const base = (axiosInstance && axiosInstance.defaults && axiosInstance.defaults.baseURL) || '';
            imgSrc = (base.replace(/\/$/, '') || '') + imgSrc;
          }

          return (
            <img
              src={imgSrc}
              alt={product.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
              onError={(e) => {
                // when image fails, use external fallback
                if (!e.currentTarget.src || !e.currentTarget.src.includes('placeholder.com')) {
                  e.currentTarget.src = DEFAULT_FALLBACK;
                }
              }}
            />
          );
        })()}

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

          <div className="flex items-center gap-2">
            <button
              onClick={handleWishlistToggle}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${isWishlisted ? 'bg-pink-500 text-white' : 'bg-transparent border border-zinc-200 text-zinc-900'}`}
              title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              {isWishlisted ? '♥' : '♡'}
            </button>

            {/* Buy Now should navigate directly to checkout with quantity 1 */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleBuyNow(e);
              }}
              className="bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-medium px-4 py-2 rounded-full transition-all duration-300"
              title="Buy Now"
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
