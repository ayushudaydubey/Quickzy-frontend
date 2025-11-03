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

  // ensure we are at the top of the page when opening the products list
  useEffect(() => {
    try {
      window.scrollTo({ top: 0, behavior: 'auto' });
    } catch (e) {
      // ignore non-browser environments
    }
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

  // navigation helper (used by ProductCard)
  const openProduct = (id) => navigate(`/product/${id}`);

  const renderSkeletons = (count = 6) => (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white rounded-xl shadow p-4">
          <div className="mb-3">
            <div className="h-40 w-full bg-gray-200 rounded animate-pulse" />
            <div className="flex gap-2 mt-2">
              <div className="h-16 w-16 bg-gray-200 rounded animate-pulse" />
              <div className="h-16 w-16 bg-gray-200 rounded animate-pulse" />
              <div className="h-16 w-16 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
          <div className="h-6 bg-gray-200 rounded w-3/4 animate-pulse mb-2" />
          <div className="h-4 bg-gray-200 rounded w-full animate-pulse mb-2" />
          <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
        </div>
      ))}
    </div>
  );

  if (loading) {
    return <div className="max-w-6xl mx-auto p-6">{renderSkeletons(6)}</div>;
  }

  const titleParts = [];
  if (search) titleParts.push(`"${search}"`);
  if (category) titleParts.push(`in ${category}`);
  const title = titleParts.length ? `Search results ${titleParts.join(' ')}` : 'All Products';

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6">
        {title}
      </h1>

      {products.length === 0 ? (
        <div className="text-center text-gray-600">No products found.</div>
      ) : (
        <>
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
            {products.slice(0, visibleCount).map((p) => (
              <ProductCard key={p._id} product={p} showBuy={true} />
            ))}
          </div>

          {visibleCount < products.length && (
            <div className="mt-8 text-center">
              <button
                onClick={() => setVisibleCount((c) => Math.min(c + 6, products.length))}
                className="px-6 py-3 bg-black text-white rounded-xl shadow hover:bg-gray-800 transition"
              >
                Load more
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Products;