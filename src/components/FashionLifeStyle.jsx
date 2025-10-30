import React, { useEffect, useState, useRef } from 'react';
import axiosInstance from '../utils/axios';
import ProductCard from './ProductCard';

const Skeleton = () => (
  <div className="min-w-[300px] bg-black/5 overflow-hidden animate-pulse">
    <div className="w-full h-96 bg-gradient-to-br from-black/10 to-black/20" />
    <div className="p-6 space-y-4">
      <div className="h-5 bg-black/10 w-3/4" />
      <div className="h-4 bg-black/5 w-full" />
      <div className="flex justify-between pt-3">
        <div className="h-6 bg-black/10 w-24" />
        <div className="h-10 w-10 bg-black/10" />
      </div>
    </div>
  </div>
);

const NavButton = ({ direction, onClick }) => (
  <button
    onClick={onClick}
    className="w-11 h-11 border border-black/20 hover:bg-black hover:border-black transition-all group"
    aria-label={`Scroll ${direction}`}
  >
    <svg className="w-5 h-5 mx-auto text-black group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="square" strokeWidth={1.5} d={direction === 'left' ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"} />
    </svg>
  </button>
);

const Cards = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);

  useEffect(() => {
    axiosInstance.get('/products')
      .then(res => {
        setProducts(res.data.filter(p => p.category === 'Fashion' || p.category === 'Lifestyle'));
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch products:', err);
        setLoading(false);
      });
  }, []);

  const scroll = (dir) => scrollRef.current?.scrollBy({ left: dir === 'left' ? -420 : 420, behavior: 'smooth' });

  return (
    <div className="max-w-7xl mx-auto py-12 bg-white">
      {/* Header */}
      <div className="flex items-end justify-between mb-10 px-1">
        <div>
          <p className="text-xs font-light text-black/40 tracking-[0.3em] uppercase mb-3">Curated Selection</p>
          <h2 className="text-5xl md:text-6xl font-light text-black tracking-tight">Fashion & Lifestyle</h2>
        </div>
        
        <div className="flex items-center gap-3">
          <NavButton direction="left" onClick={() => scroll('left')} />
          <NavButton direction="right" onClick={() => scroll('right')} />
          <div className="w-px h-9 bg-black/15 mx-3" />
          <button className="px-8 py-3 border border-black text-black text-xs font-light tracking-[0.15em] uppercase hover:bg-black hover:text-white transition-all">
            View All
          </button>
        </div>
      </div>

      {/* Products */}
      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white via-white/80 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white via-white/80 to-transparent z-10 pointer-events-none" />
        
        <div
          ref={scrollRef}
          className="flex gap-8 overflow-x-auto pb-8 px-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          style={{ scrollBehavior: 'smooth' }}
        >
          {loading 
            ? Array.from({ length: 6 }, (_, i) => <Skeleton key={i} />)
            : products.map((product) => (
                <div 
                  key={product._id} 
                  className="group min-w-[300px] bg-white border border-black/10 overflow-hidden transition-all duration-700 hover:border-black "
                >
                  <ProductCard product={product} />
                </div>
              ))
          }
        </div>
      </div>

      {/* Empty State */}
      {!loading && !products.length && (
        <div className="text-center py-32">
          <div className="w-20 h-20 mx-auto mb-6 border border-black/15 flex items-center justify-center">
            <svg className="w-10 h-10 text-black/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          </div>
          <p className="text-base text-black/40 font-light tracking-[0.1em] uppercase">No Products Available</p>
        </div>
      )}
    </div>
  );
};

export default Cards;