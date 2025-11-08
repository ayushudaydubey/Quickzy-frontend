import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axios";
import ProductCard from "./ProductCard";

// Skeleton Loader (light theme)
const Skeleton = () => (
  <div className="min-w-[300px] bg-zinc-100 overflow-hidden animate-pulse rounded-xl border border-zinc-300">
    <div className="w-full h-96 bg-zinc-200" />
    <div className="p-6 space-y-4">
      <div className="h-5 bg-zinc-200 w-3/4" />
      <div className="h-4 bg-zinc-100 w-full" />
      <div className="flex justify-between pt-3">
        <div className="h-6 bg-zinc-200 w-24" />
        <div className="h-10 w-10 bg-zinc-200" />
      </div>
    </div>
  </div>
);

// Navigation Buttons (light theme)
const NavButton = ({ direction, onClick }) => (
  <button
    onClick={onClick}
    className="w-11 h-11 border border-zinc-300 hover:bg-zinc-100 rounded-full transition-all duration-300 flex items-center justify-center hover:scale-110 group"
    aria-label={`Scroll ${direction}`}
  >
    <svg
      className="w-5 h-5 text-zinc-600 group-hover:text-zinc-950 transition-colors duration-300"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeWidth={1.8}
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
      .then((res) => setProducts(res.data.filter((p) => p.category === "Beauty")))
      .catch((err) => console.error("Failed to fetch products:", err))
      .finally(() => setLoading(false));
  }, []);

  const scroll = (dir) =>
    scrollRef.current?.scrollBy({
      left: dir === "left" ? -420 : 420,
      behavior: "smooth",
    });

  return (
    <div className="max-w-7xl mx-auto  bg-white text-zinc-950">
      {/* Header */}
      <div className="flex items-end justify-between mb-10">
        <div>
          <p className="text-xs font-light text-zinc-500 tracking-wider uppercase mb-3">
            Curated Selection
          </p>
          <h2 className="text-5xl md:text-6xl font-thin tracking-tight">
            Beauty
          </h2>
      
        </div>

        <div className="flex items-center gap-3">
          <NavButton direction="left" onClick={() => scroll("left")} />
          <NavButton direction="right" onClick={() => scroll("right")} />
          <div className="w-px h-9 bg-zinc-300 mx-3" />
          <button
            onClick={() => navigate("/product?category=Beauty")}
            className="px-8 py-3 border border-zinc-300 text-zinc-950 text-xs font-medium tracking-wider uppercase rounded-full hover:bg-zinc-950 hover:text-white transition-all duration-300 transform hover:scale-105"
          >
            View All
          </button>
        </div>
      </div>

      {/* Product Section */}
      <div className="relative">
        <div
          ref={scrollRef}
          className="flex gap-8 overflow-x-auto pb-8 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >
          {loading
            ? Array.from({ length: 6 }, (_, i) => <Skeleton key={i} />)
            : products.map((product) => (
                <div
                  key={product._id}
                  className="group min-w-[300px] bg-zinc-100 rounded-2xl overflow-hidden border border-zinc-300 hover:border-zinc-400 transition-all duration-300 hover:scale-[1.02]"
                >
                  <ProductCard product={product} showBuy={true} />
                </div>
              ))}
        </div>
      </div>

      {/* Empty State */}
      {!loading && !products.length && (
        <div className="text-center py-32">
          <div className="w-20 h-20 mx-auto mb-6 flex items-center justify-center bg-zinc-100 rounded-full border border-zinc-300">
            <svg
              className="w-10 h-10 text-zinc-500"
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
          <p className="text-base text-zinc-500 font-light tracking-wider uppercase">
            No Products Available
          </p>
        </div>
      )}
    </div>
  );
};

export default Beauty;
