import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axios";
import ProductCard from "./ProductCard";

const Skeleton = () => (
  <div className="min-w-[300px] bg-gray-100 overflow-hidden animate-pulse">
    <div className="w-full h-96 bg-gray-200" />
    <div className="p-6 space-y-4">
      <div className="h-5 bg-gray-200 w-3/4" />
      <div className="h-4 bg-gray-100 w-full" />
      <div className="flex justify-between pt-3">
        <div className="h-6 bg-gray-200 w-24" />
        <div className="h-10 w-10 bg-gray-200" />
      </div>
    </div>
  </div>
);

const NavButton = ({ direction, onClick }) => (
  <button
    onClick={onClick}
    className="w-11 h-11 border border-black hover:bg-black transition-all group"
  >
    <svg
      className="w-5 h-5 mx-auto text-black group-hover:text-white transition-colors"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="square"
        strokeWidth={1.5}
        d={direction === "left" ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"}
      />
    </svg>
  </button>
);

const Technology = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    axiosInstance
      .get("/products")
      .then((res) => setProducts(res.data.filter((p) => p.category === "Technology")))
      .catch((err) => console.error("Failed to fetch:", err))
      .finally(() => setLoading(false));
  }, []);

  const scroll = (dir) =>
    scrollRef.current?.scrollBy({ left: dir === "left" ? -420 : 420, behavior: "smooth" });

  return (
    <div className="max-w-7xl mx-auto py-12 bg-white">
      <div className="flex items-end justify-between mb-10 px-1">
        <div>
          <p className="text-xs font-light text-gray-400 uppercase mb-3">Curated Selection</p>
          <h2 className="text-5xl md:text-6xl font-light text-black">Technology & Gadgets</h2>
        </div>

        <div className="flex items-center gap-3">
          <NavButton direction="left" onClick={() => scroll("left")} />
          <NavButton direction="right" onClick={() => scroll("right")} />
          <div className="w-px h-9 bg-gray-300 mx-3" />
          <button
            onClick={() => navigate("/product?category=Technology")}
            className="px-8 py-3 border border-black text-black text-xs font-light uppercase hover:bg-black hover:text-white transition-all"
          >
            View All
          </button>
        </div>
      </div>

      <div className="relative">
        <div
          ref={scrollRef}
          className="flex gap-8 overflow-x-auto pb-8 px-1 [&::-webkit-scrollbar]:hidden"
        >
          {loading
            ? Array.from({ length: 6 }, (_, i) => <Skeleton key={i} />)
            : products.map((product) => (
                <div key={product._id} className="group min-w-[300px]">
                  <ProductCard product={product} showBuy={true} />
                </div>
              ))}
        </div>
      </div>

      {!loading && !products.length && (
        <div className="text-center py-32 text-gray-400 uppercase">No Products Available</div>
      )}
    </div>
  );
};

export default Technology;
