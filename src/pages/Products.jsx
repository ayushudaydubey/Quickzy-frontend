import React, { useEffect, useState } from 'react';
import axiosInstance from '../utils/axios';
import { useLocation, useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(6);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    try {
      window.scrollTo({ top: 0, behavior: 'auto' });
    } catch (e) {}
  }, [location.pathname, location.search]);

  const query = new URLSearchParams(location.search);
  const search = query.get('search') || '';
  const category = query.get('category') || '';

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (search) params.set('search', search);
        if (category) params.set('category', category);

        const url = `/products${params.toString() ? `?${params.toString()}` : ''}`;

        const res = await axiosInstance.get(url);
        setProducts(res.data || []);
      } catch (err) {
        console.error('Failed to fetch products', err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [search, category]);

  const openProduct = (id) => navigate(`/product/${id}`);

  const renderSkeletons = (count = 6) => (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-2xl shadow-md p-4 border border-gray-200"
        >
          <div className="mb-4">
            <div className="h-48 w-full bg-gray-200 rounded-xl animate-pulse" />
          </div>

          <div className="h-5 bg-gray-200 rounded w-3/4 animate-pulse mb-2" />
          <div className="h-4 bg-gray-200 rounded w-full animate-pulse mb-2" />
          <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
        </div>
      ))}
    </div>
  );

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        {renderSkeletons(6)}
      </div>
    );
  }

  const titleParts = [];
  if (search) titleParts.push(`"${search}"`);
  if (category) titleParts.push(`in ${category}`);
  const title = titleParts.length ? `Search results ${titleParts.join(' ')}` : 'Everything is here ';

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">

      {/* Title */}
      <h1 className="text-3xl sm:text-4xl font-medium mb-8 text-gray-900 tracking-tight">
        {title}
      </h1>

      {products.length === 0 ? (
        <div className="text-center py-20">
          <h2 className="text-xl font-semibold text-gray-700">No products found.</h2>
          <p className="text-gray-500 mt-2">Try searching for something else.</p>
        </div>
      ) : (
        <>
          {/* Product Grid */}
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {products.slice(0, visibleCount).map((p) => (
              <ProductCard key={p._id} product={p} showBuy={true} />
            ))}
          </div>

          {/* Load More Button */}
          {visibleCount < products.length && (
            <div className="mt-10 text-center">
              <button
                onClick={() =>
                  setVisibleCount((c) => Math.min(c + 6, products.length))
                }
                className="
                  px-7 py-3 
                  bg-black text-white 
                  rounded-xl 
                  shadow-lg hover:shadow-xl 
                  hover:bg-zinc-900 
                  transition-all duration-300 
                  text-sm sm:text-base
                "
              >
                Load More
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Products;
