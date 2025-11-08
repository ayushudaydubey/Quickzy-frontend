import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axios";
import ProductCard from "./ProductCard";

// Skeleton Loader (dark theme)
const Skeleton = () => (
  <div className="min-w-[300px] bg-zinc-900 rounded-2xl overflow-hidden animate-pulse border border-zinc-800 shadow-lg">
    <div className="w-full h-64 bg-zinc-800" />
    <div className="p-5 space-y-3">
      <div className="h-4 bg-zinc-800 rounded w-3/4"></div>
      <div className="h-4 bg-zinc-800 rounded w-full"></div>
      <div className="h-4 bg-zinc-800 rounded w-2/3"></div>
    </div>
  </div>
);

// Navigation Button (dark theme)
const NavButton = ({ direction, onClick }) => (
  <button
    onClick={onClick}
    className="w-10 h-10 border border-zinc-700 hover:bg-white hover:text-black text-white transition-all rounded-full flex items-center justify-center"
  >
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="square"
        d={direction === "left" ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"}
      />
    </svg>
  </button>
);

const FoodWellness = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    axiosInstance
      .get("/products")
      .then((res) =>
        setProducts(res.data.filter((p) => p.category === "Food & Wellness"))
      )
      .catch((err) => console.error("Failed to fetch products:", err))
      .finally(() => setLoading(false));
  }, []);

  const scroll = (dir) =>
    scrollRef.current?.scrollBy({
      left: dir === "left" ? -420 : 420,
      behavior: "smooth",
    });

  return (
    <div className="max-w-7xl mx-auto text-zinc-950 ">
      {/* Header */}
      <div className="flex items-end justify-between mb-10">
        <div>
          <p className="text-xs font-light text-zinc-500 uppercase mb-3 tracking-widest">
            Healthy Living
          </p>
          <h2 className="text-5xl md:text-6xl font-thin tracking-tight">
            Food & Wellness
          </h2>
     
        </div>

        <div className="flex items-center gap-3">
          <NavButton direction="left" onClick={() => scroll("left")} />
          <NavButton direction="right" onClick={() => scroll("right")} />
          <div className="w-px h-9 bg-zinc-700 mx-3" />
          <button
            onClick={() => navigate("/product?category=Food & Wellness")}
            className="px-8 py-3 border border-zinc-700 text-sm font-light uppercase rounded-full hover:bg-white hover:text-black transition-all duration-300"
          >
            View All
          </button>
        </div>
      </div>

      {/* Product Section */}
      <div
        ref={scrollRef}
        className="flex gap-8 overflow-x-auto pb-8 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      >
        {loading
          ? Array.from({ length: 6 }, (_, i) => <Skeleton key={i} />)
          : products.map((product) => (
              <div
                key={product._id}
                className="group min-w-[300px] max-w-[300px] flex-shrink-0 bg-zinc-900 rounded-2xl border border-zinc-800 hover:border-zinc-700 transition-all duration-300 hover:scale-[1.02] overflow-hidden"
              >
                <ProductCard product={product} showBuy={true} />
              </div>
            ))}
      </div>

      {/* Empty State */}
      {!loading && !products.length && (
        <div className="text-center py-32 text-zinc-500 uppercase tracking-widest">
          No Products Available
        </div>
      )}
    </div>
  );
};

export default FoodWellness;
