import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axios";
import ProductCard from "./ProductCard";

// Skeleton Loader (light theme)
const Skeleton = () => (
  <div className="min-w-[300px] bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
    <div className="w-full h-64 bg-gray-300"></div>
    <div className="p-4 space-y-2">
      <div className="h-5 bg-gray-300 rounded w-3/4"></div>
      <div className="h-4 bg-gray-300 rounded w-full"></div>
      <div className="h-4 bg-gray-300 rounded w-2/3"></div>
    </div>
  </div>
);

// Navigation Button (light theme)
const NavButton = ({ direction, onClick }) => (
  <button
    onClick={onClick}
    className="w-10 h-10 border border-black hover:bg-black transition-all group rounded-full flex items-center justify-center"
  >
    <svg
      className="w-5 h-5 text-black group-hover:text-white transition-colors"
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

const Other = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    axiosInstance
      .get("/products")
      .then((res) =>
        setProducts(res.data.filter((p) => p.category === "Other"))
      )
      .catch((err) => console.error("Failed to fetch products:", err))
      .finally(() => setLoading(false));
  }, []);

  const scroll = (dir) =>
    scrollRef.current?.scrollBy({
      left: dir === "left" ? -400 : 400,
      behavior: "smooth",
    });

  return (
    <div className="max-w-7xl mx-auto text-zinc-950 bg-white">
      {/* Header */}
      <div className="flex items-end justify-between mb-10 px-1">
        <div>
          <p className="text-xs font-light text-gray-400 uppercase mb-3">
            Curated Picks
          </p>
          <h2 className="text-5xl md:text-6xl font-light text-black">
            Other Products
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <NavButton direction="left" onClick={() => scroll("left")} />
          <NavButton direction="right" onClick={() => scroll("right")} />
          <div className="w-px h-8 bg-gray-300 mx-3" />
          <button
            onClick={() => navigate("/product?category=Other")}
            className="px-8 py-3 border border-black text-black text-xs font-light uppercase hover:bg-black hover:text-white transition-all"
          >
            View All
          </button>
        </div>
      </div>

      {/* Scroll Section */}
      <div className="relative">
        <div
          ref={scrollRef}
          className="flex gap-8 overflow-x-auto pb-8 px-1 [&::-webkit-scrollbar]:hidden"
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
        <div className="text-center py-32 text-gray-400 uppercase">
          No Products Available
        </div>
      )}
    </div>
  );
};

export default Other;
