import React, { useEffect, useState } from 'react';
import axiosInstance from '../utils/axios';
import { useLocation, useNavigate } from 'react-router-dom';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

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
  // debug
  const openProductDebug = (id) => { console.log('Products page openProduct:', id); navigate(`/product/${id}`); };

  if (loading) {
    return <div className="p-10 text-center">Loading products...</div>;
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
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          {products.map((p) => (
            <div
              key={p._id}
              className="bg-white rounded-xl shadow p-4 cursor-pointer"
              onClick={() => openProductDebug(p._id)}
            >
              <div className="mb-3">
                <img
                  src={(Array.isArray(p.images) && p.images[0]) || p.image}
                  alt={p.title}
                  className="h-40 w-full object-cover rounded"
                />

                {Array.isArray(p.images) && p.images.length > 1 && (
                  <div className="flex gap-2 mt-2 overflow-x-auto">
                    {p.images.slice(0, 4).map((img, idx) => (
                      <img key={idx} src={img} alt={`${p.title} ${idx + 1}`} className="h-16 w-16 object-cover rounded" />
                    ))}
                  </div>
                )}
              </div>

              <h3 className="font-semibold">{p.title}</h3>
              <p className="text-sm text-gray-600 line-clamp-2">{p.description}</p>
              <div className="mt-2 flex justify-between items-center">
                <span className="text-blue-600 font-bold">₹ {p.price}</span>
                <span className="text-sm text-gray-500">{p.category || 'Other'}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Products;