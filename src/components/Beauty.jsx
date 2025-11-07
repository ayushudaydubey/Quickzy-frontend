import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axios";
import ProductCard from "./ProductCard";

// Skeleton Loader
const Skeleton = () => (
  <div className="min-w-[300px] bg-zinc-900 rounded-2xl overflow-hidden animate-pulse border border-zinc-800">
    <div className="w-full h-64 bg-zinc-800" />
    <div className="p-5 space-y-3">
      <div className="h-4 bg-zinc-800 rounded w-3/4"></div>
      <div className="h-4 bg-zinc-800 rounded w-full"></div>
      <div className="h-4 bg-zinc-800 rounded w-2/3"></div>
    </div>
  </div>
);

// Navigation Buttons
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

const Beauty = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    axiosInstance
      .get("/products")
      .then((res) => setProducts(res.data.filter((p) => p.category === "Beauty")))
      .catch((err) => console.error("Failed to fetch:", err))
      .finally(() => setLoading(false));
  }, []);

  const scroll = (dir) =>
    scrollRef.current?.scrollBy({
      left: dir === "left" ? -420 : 420,
      behavior: "smooth",
    });

  return (
    <section className="bg-zinc-950 text-white py-20">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12">
          <div>
            <p className="text-sm font-light text-zinc-400 uppercase mb-3 tracking-widest">
              Curated Selection
            </p>
            <h2 className="text-4xl md:text-6xl font-semibold text-white">
              Beauty
            </h2>
            <p className="text-zinc-400 mt-2 text-sm md:text-base">
              Discover premium beauty essentials for your everyday glow.
            </p>
          </div>

          <div className="flex items-center gap-4 mt-6 md:mt-0">
            <NavButton direction="left" onClick={() => scroll("left")} />
            <NavButton direction="right" onClick={() => scroll("right")} />
            <button
              onClick={() => navigate("/product?category=Beauty")}
              className="px-6 py-3 border border-white text-white text-xs font-medium uppercase rounded-full hover:bg-white hover:text-black transition-all"
            >
              View All
            </button>
          </div>
        </div>

        {/* Product Scroll */}
        <div className="relative">
          <div
            ref={scrollRef}
            className="flex gap-8 overflow-x-auto pb-8 no-scrollbar scroll-smooth"
          >
            {loading
              ? Array.from({ length: 6 }, (_, i) => <Skeleton key={i} />)
              : products.map((product) => (
                  <div
                    key={product._id}
                    className="min-w-[300px] max-w-[300px] flex-shrink-0"
                  >
                    <ProductCard product={product} showBuy={true} />
                  </div>
                ))}
          </div>
        </div>

        {/* Empty State */}
        {!loading && !products.length && (
          <div className="text-center py-32 text-zinc-500 uppercase tracking-widest">
            No Products Available
          </div>
        )}
      </div>
    </section>
  );
};

export default Beauty;
