import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from 'lucide-react';

const heroImages = [
  {
    url: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=1920",
    title: "TECH INNOVATION",
    subtitle: "Experience the future with intelligent, minimalist design.",
    cta: "Shop Tech",
  },
  {
    url: "https://plus.unsplash.com/premium_photo-1701108112647-42fcf021841a?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=1920",
    title: "NEW COLLECTION",
    subtitle: "Step into the next era of modern luxury and form.",
    cta: "Explore Now",
  },
  {
    url: "https://images.unsplash.com/photo-1560343090-f0409e92791a?auto=format&fit=crop&w=1920&q=80",
    title: "HOME & LIVING",
    subtitle: "Craft spaces that breathe elegance and simplicity.",
    cta: "View Collection",
  },
  {
    url: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1920&q=80",
    title: "WELLNESS FIRST",
    subtitle: "Balance luxury with mindful living and purity.",
    cta: "Discover More",
  },
];

const Hero = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const image = heroImages[currentIndex];

  // Auto-play interval
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroImages.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  // Manual navigation
  const navigate = (direction) => {
    setCurrentIndex(
      (prev) => (prev + direction + heroImages.length) % heroImages.length
    );
  };

  return (
    <section className="relative flex flex-col md:flex-row w-full h-screen max-h-[900px] overflow-hidden font-sans">
      
      {/* LEFT IMAGE SIDE - Responsive dimensions */}
      <div className="relative w-full md:w-[65%] h-[60vh] md:h-full">
        <img
          src={image.url}
          alt={image.title}
          // Key added to image to force re-render, ensuring smooth transition
          key={image.url} 
          className="w-full h-full object-cover transition-transform duration-[1500ms] ease-in-out scale-100 animate-zoom"
        />

        {/* Deep Black Overlay for Contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>

        {/* Controls */}
        <button
          onClick={() => navigate(-1)}
          className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/30 backdrop-blur-sm border border-white/40 text-white w-12 h-12 flex items-center justify-center rounded-full transition-all duration-300 hover:scale-105 shadow-lg"
          aria-label="Previous Slide"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={() => navigate(1)}
          className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/30 backdrop-blur-sm border border-white/40 text-white w-12 h-12 flex items-center justify-center rounded-full transition-all duration-300 hover:scale-105 shadow-lg"
          aria-label="Next Slide"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Image index indicator */}
        <div className="absolute bottom-6 left-6 text-white/80 text-sm tracking-widest font-light uppercase">
          <span className="font-semibold">{`0${currentIndex + 1}`}</span> / {`0${heroImages.length}`}
        </div>
      </div>

      {/* RIGHT TEXT SIDE - Deep Contrast Panel */}
      <div className="w-full md:w-[35%] h-[40vh] md:h-full bg-zinc-950 flex flex-col justify-center items-start px-8 md:px-12 py-10 md:py-0 text-zinc-300 relative">
        
        {/* Key added here to force animations to reset on slide change */}
        <div className="space-y-6 md:space-y-8" key={currentIndex}>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-thin leading-tight tracking-tight text-white animate-slideUp">
            {image.title}
          </h1>
          
          <p className="text-zinc-400 font-light text-xl md:text-2xl leading-normal animate-fadeIn delay-300">
            {image.subtitle}
          </p>

          <button className="group relative inline-flex items-center justify-center gap-3 mt-4 px-8 py-3 rounded-xl border border-white/50 text-white overflow-hidden text-base font-medium tracking-widest uppercase transition-shadow duration-300 shadow-md hover:shadow-lg">
            
            {/* White Fill Layer (Scales up on hover) */}
            <div className="absolute inset-0 bg-white scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 rounded-xl"></div>
            
            {/* Text and Icon */}
            <span className="relative z-10 text-white group-hover:text-zinc-950 transition-colors duration-500">
              {image.cta}
            </span>
            <ChevronRight className="relative z-10 w-5 h-5 text-white group-hover:text-zinc-950 transition-colors duration-500" />
          </button>
        </div>
      </div>

      {/* Custom CSS Animations */}
      <style jsx>{`
        @keyframes zoom {
          0% { transform: scale(1.0); }
          100% { transform: scale(1.05); }
        }
        .animate-zoom {
          animation: zoom 8s ease-in-out infinite alternate;
        }
        
        /* Fade in animation (slower) */
        .animate-fadeIn {
          animation: fadeIn 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
          animation-delay: 0.3s; 
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* Slide up animation (faster) */
        .animate-slideUp {
          animation: slideUp 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(50px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
};

export default Hero;