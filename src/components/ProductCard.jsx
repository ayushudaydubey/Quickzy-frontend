import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { addToCart } from "../store/Reducers/cartSlice";

const truncateWords = (text, limit) => {
  if (!text) return "";
  const words = text.split(" ");
  if (words.length <= limit) return text;
  return words.slice(0, limit).join(" ") + "...";
};

const ProductCard = ({ product, showBuy = false }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleCardClick = () => {
    navigate(`/product/${product._id}`);
  };

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      await dispatch(addToCart(product._id)).unwrap();
      toast.success("Product added to cart!");
    } catch (error) {
      if (error?.response?.status === 401) {
        navigate(`/login?redirect=/product/${product._id}`);
      } else {
        toast.error("Please login to add items to your cart");
        navigate(`/login?redirect=/product/${product._id}`);
      }
    }
  };

  const handleBuyNow = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/checkout/${product._id}`, { state: { quantity: 1 } });
  };

  return (
    <div
      onClick={handleCardClick}
      className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer overflow-hidden flex flex-col"
    >
      {Array.isArray(product.images) && product.images.length > 1 && (
        <div className="absolute mt-3 mr-3 right-0 z-10">
          <span className="bg-zinc-950 text-white text-xs px-2 py-1 rounded">
            {product.images.length} images
          </span>
        </div>
      )}

      <div className="overflow-hidden h-60">
        <img
          src={(Array.isArray(product.images) && product.images[0]) || product.image}
          alt={product.title}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>

      <div className="p-5 flex flex-col flex-grow justify-between">
        <h3 className="text-zinc-950 text-xl font-semibold mb-2">
          {truncateWords(product.title, 3)}
        </h3>
        <p className="text-zinc-700 text-sm mb-4 flex-grow">
          {truncateWords(product.description, 15)}
        </p>

        <div className="flex items-center justify-between">
          <span className="text-zinc-950 text-lg font-bold">₹{product.price}</span>
          {showBuy ? (
            <button
              onClick={handleBuyNow}
              className="bg-zinc-950 hover:bg-zinc-800 text-white text-sm font-medium px-4 py-2 rounded-lg transition duration-300"
            >
              Buy Now
            </button>
          ) : (
            <button
              onClick={handleAddToCart}
              className="border border-zinc-950 text-zinc-950 hover:bg-zinc-950 hover:text-white text-sm font-medium px-4 py-2 rounded-lg transition duration-300"
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
