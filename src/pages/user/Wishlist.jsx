import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import ProductCard from '../../components/ProductCard';
import axiosInstance from '../../utils/axios';

const Wishlist = () => {
  const items = useSelector((state) => state.wishlist.items || []);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    const loadProducts = async () => {
      setLoading(true);
      try {
        if (!items || items.length === 0) {
          if (mounted) setProducts([]);
          return;
        }

        const toFetch = [];
        const result = [];

        for (const p of items) {
          if (!p) continue;

          // unwrap wrapper objects like { product: {...} } or { productId: ... }
          let entry = p;
          if (p && typeof p === 'object' && p.product) entry = p.product;

          // If this looks like a product object, normalize image(s) then keep it
          if (entry && typeof entry === 'object' && (entry.title || entry.images || entry.image)) {
            // Ensure `images` is always an array of string URLs for consistent rendering
            const extractUrl = (val) => {
              if (!val) return '';
              if (typeof val === 'string') return val;
              if (typeof val === 'object') {
                return (
                  val.url || val.secure_url || val.path || val.src || val.publicUrl || val.public_id || ''
                );
              }
              return '';
            };

            if (Array.isArray(entry.images)) {
              entry.images = entry.images.map(extractUrl).filter((x) => !!x);
            } else if (typeof entry.images === 'string' && entry.images.trim() !== '') {
              entry.images = [entry.images];
            } else if (entry.image) {
              const u = extractUrl(entry.image);
              entry.images = u ? [u] : [];
            } else if (entry.images) {
              const u = extractUrl(entry.images);
              entry.images = u ? [u] : [];
            } else {
              entry.images = [];
            }

            result.push(entry);
            continue;
          }

          const id = typeof entry === 'string' ? entry : entry._id || entry.productId;
          if (id) toFetch.push(id);
        }

        if (toFetch.length > 0) {
          const uniqueIds = Array.from(new Set(toFetch));
          const fetched = await Promise.all(
            uniqueIds.map((id) =>
              axiosInstance
                .get(`/products/${id}`)
                .then((r) => r.data)
                .catch(() => null)
            )
          );
          for (const f of fetched) if (f) result.push(f);
        }

        if (mounted) setProducts(result);
      } catch (err) {
        console.error('Failed to normalize wishlist items', err);
        if (mounted) setProducts([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadProducts();
    return () => (mounted = false);
  }, [items]);

  // debug logs to help diagnose missing images/descriptions
  useEffect(() => {
    console.debug('Wishlist store items:', items);
    console.debug('Wishlist products resolved:', products);
  }, [items, products]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <h2 className="text-2xl font-semibold text-zinc-950 mb-6">Your Wishlist</h2>
      {loading ? (
        <div className="text-zinc-600">Loading...</div>
      ) : products.length === 0 ? (
        <p className="text-zinc-600">Your wishlist is empty.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
