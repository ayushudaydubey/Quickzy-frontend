import React from 'react';
import { useNavigate } from 'react-router-dom';

const PageNotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-zinc-800 to-black text-white px-6">
      <div className="text-center max-w-md">
        <h1 className="text-6xl font-extrabold mb-4 text-red-500">404</h1>
        <h2 className="text-2xl font-semibold mb-2">Oops! Page not found</h2>
        <p className="text-gray-300 mb-6">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition"
        >
          Go to Homepage
        </button>
      </div>
    </div>
  );
};

export default PageNotFound;
