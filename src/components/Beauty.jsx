import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axios";
import ProductCard from "./ProductCard";

// Skeleton Loader
const Skeleton = () => (
  <div className="min-w-[220px] sm:min-w-[260px] md:min-w-[300px] bg-zinc-100 overflow-hidden animate-pulse rounded-xl border border-zinc-300">
    <div className="w-full h-56 sm:h-72 md:h-96 bg-zinc-200" />
    <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
      <div className="h-4 sm:h-5 bg-zinc-200 w-3/4" />
      <div className="h-3 sm:h-4 bg-zinc-100 w-full" />
      <div className="flex justify-between pt-2 sm:pt-3">
        <div className="h-5 sm:h-6 bg-zinc-200 w-20 sm:w-24" />
        <div className="h-8 sm:h-10 w-8 sm:w-10 bg-zinc-200" />
      </div>
    </div>
  </div>
);

const NavButton = ({ direction, onClick }) => (
  <button
    onClick={onClick}
    className="relative w-8 h-8 sm:w-10 sm:h-10 bg-zinc-800 rounded-full overflow-hidden transition-all duration-300 flex items-center justify-center shadow-sm hover:shadow group border border-transparent hover:border-zinc-900"
    aria-label={`Scroll ${direction}`}
  >
    <div className="absolute inset-0 bg-gradient-to-r from-zinc-900 via-black to-zinc-950 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full pointer-events-none" />
    <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/30 to-transparent rounded-full pointer-events-none" />

    <svg
      className="relative w-3 h-3 sm:w-4 sm:h-4 text-zinc-300 group-hover:text-white transition-colors duration-300"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      strokeWidth={2.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d={direction === "left" ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"}
      />
    </svg>
  </button>
);

const Beauty = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    axiosInstance
      .get("/products")
      .then((res) => {
        setProducts(res.data.filter((p) => p.category === "Beauty"));
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch products:", err);
        setLoading(false);
      });
  }, []);

  const scroll = (dir) =>
    scrollRef.current?.scrollBy({
      left: dir === "left" ? -320 : 320, // mobile friendly
      behavior: "smooth",
    });

  return (
    <div className="max-w-7xl mx-auto py-6 sm:py-8 px-3 sm:px-0 bg-white text-zinc-950">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 sm:gap-0 mb-8 sm:mb-10 py-4 sm:py-6 px-3 sm:px-4 rounded-2xl bg-gradient-to-r from-zinc-100/70 via-zinc-500 to-zinc-700">
        
        <div>
          <p className="text-[9px] sm:text-[10px] font-medium text-zinc-600 tracking-[0.2em] uppercase mb-1 sm:mb-2">
            Curated Selection
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-6xl font-light tracking-tight text-zinc-900">
            Beauty That Speaks
          </h2>
        </div>

        <div className="flex items-center gap-2 sm:gap-2.5">
          <NavButton direction="left" onClick={() => scroll("left")} />
          <NavButton direction="right" onClick={() => scroll("right")} />

          <div className="hidden sm:block w-[1px] h-8 bg-zinc-200 mx-2" />

          <button
            onClick={() => navigate("/product?category=Beauty")}
            className="relative px-4 sm:px-6 py-2 bg-gradient-to-r from-zinc-900 via-black to-zinc-950 text-white text-[10px] sm:text-[11px] font-medium tracking-[0.15em] uppercase rounded-full transition-all duration-500 shadow-sm hover:shadow-xl overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-zinc-700 via-zinc-800 to-zinc-800 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/30 to-transparent" />

            <span className="relative z-10">View All</span>
          </button>
        </div>
      </div>

      {/* Product Cards */}
      <div className="relative">
        <div
          ref={scrollRef}
          className="flex gap-4 sm:gap-8 overflow-x-auto pb-6 sm:pb-8 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >
          {loading
            ? Array.from({ length: 6 }, (_, i) => <Skeleton key={i} />)
            : products.map((product) => (
                <div
                  key={product._id}
                  className="group min-w-[220px] sm:min-w-[260px] md:min-w-[300px] mt-3 sm:mt-4 bg-zinc-100 rounded-2xl overflow-hidden border border-zinc-300 hover:border-zinc-400 transition-all duration-300 hover:scale-[1.02]"
                >
                  <ProductCard product={product} showBuy={true} />
                </div>
              ))}
        </div>
      </div>

      {/* Empty State */}
      {!loading && !products.length && (
        <div className="text-center py-24 sm:py-32">
          <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 flex items-center justify-center bg-zinc-100 rounded-full border border-zinc-300">
            <svg
              className="w-8 h-8 sm:w-10 sm:h-10 text-zinc-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="miter"
                strokeWidth={1.3}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
          </div>
          <p className="text-sm sm:text-base text-zinc-500 font-light tracking-wider uppercase">
            No Products Available
          </p>
        </div>
      )}
    </div>
  );
};

export default Beauty;
