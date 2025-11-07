import React from 'react';
import { useNavigate } from 'react-router-dom';

const NavButton = ({ direction, onClick }) => (
  <button
    onClick={onClick}
    className="w-11 h-11 border border-black hover:bg-black transition-all group"
    aria-label={`Scroll ${direction}`}
  >
    <svg className="w-5 h-5 mx-auto text-black group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="square" strokeWidth={1.5} d={direction === 'left' ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"} />
    </svg>
  </button>
);

const CategorySection = ({
  title,
  subtitle = 'Curated Selection',
  categoryQuery = '',
  scrollLeft,
  scrollRight,
  children,
}) => {
  const navigate = useNavigate();

  return (
    <section className="max-w-7xl mx-auto py-12 bg-white">
      <div className="flex items-end justify-between mb-10 px-1">
        <div>
          <p className="text-xs font-light text-gray-400 tracking-wider uppercase mb-3">{subtitle}</p>
          <h2 className="text-5xl md:text-6xl font-light text-black">{title}</h2>
        </div>

        <div className="flex items-center gap-3">
          <NavButton direction="left" onClick={scrollLeft} />
          <NavButton direction="right" onClick={scrollRight} />
          <div className="w-px h-9 bg-gray-300 mx-3" />
          <button
            onClick={() => navigate(`/product?category=${encodeURIComponent(categoryQuery)}`)}
            className="px-8 py-3 border border-black text-black text-xs font-light tracking-wider uppercase hover:bg-black hover:text-white transition-all"
          >
            View All
          </button>
        </div>
      </div>

      <div className="relative">
        {children}
      </div>
    </section>
  );
};

export default CategorySection;
