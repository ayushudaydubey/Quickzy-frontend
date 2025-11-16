import React from "react";
import { useNavigate } from "react-router-dom";

const PageNotFound = () => {
  const navigate = useNavigate();

  return (
    <div
      className="relative flex items-center-safe justify-start min-h-screen text-white overflow-hidden"
    >
      {/* 🔮 Illusion / Blur Background Image */}
      <img
        src="https://images.unsplash.com/photo-1478098711619-5ab0b478d6e6?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        alt="illusion"
        className="absolute inset-0 w-full h-full object-cover "
      />

      {/* Dark overlay */}
      <div className="absolute "></div>

      {/* Content */}
      <div className="relative text-center px-6 max-w-md backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-10 shadow-2xl">
        <h1 className="text-7xl font-extrabold mb-4 text-red-500 drop-shadow-lg">
          404
        </h1>

        <h2 className="text-2xl font-semibold mb-2">Page Not Found</h2>

        <p className="text-gray-300 mb-6">
          The page you’re trying to reach doesn’t exist or has been moved.
        </p>

        <button
          onClick={() => navigate("/")}
          className="px-6 py-2 bg-zinc-950 hover:bg-zinc-900 rounded-lg font-medium transition transform active:scale-95 shadow-lg"
        >
          Go Home
        </button>
      </div>
    </div>
  );
};

export default PageNotFound;
