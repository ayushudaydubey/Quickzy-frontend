import React, { useState, useEffect } from "react";

const heroImages = [
  {
    url: "https://plus.unsplash.com/premium_photo-1701108112647-42fcf021841a?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=870",
    title: "NEW COLLECTION",
    subtitle: "Step into the next era of modern fashion.",
    cta: "Explore Now",
  },
  {
    url: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1920&q=80",
    title: "TECH INNOVATION",
    subtitle: "Experience the future with intelligent design.",
    cta: "Shop Tech",
  },
  {
    url: "https://images.unsplash.com/photo-1560343090-f0409e92791a?auto=format&fit=crop&w=1920&q=80",
    title: "HOME & LIVING",
    subtitle: "Craft spaces that breathe elegance.",
    cta: "View Collection",
  },
  {
    url: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1920&q=80",
    title: "WELLNESS FIRST",
    subtitle: "Balance luxury with mindful living.",
    cta: "Discover More",
  },
];

const Hero = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const image = heroImages[currentIndex];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroImages.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const navigate = (direction) => {
    setCurrentIndex(
      (prev) => (prev + direction + heroImages.length) % heroImages.length
    );
  };

  return (
    <section className="relative flex flex-col md:flex-row w-full h-[90vh]  overflow-hidden font-[Poppins]">
      {/* LEFT IMAGE SIDE */}
      <div className="relative w-full md:w-[70%] h-[60vh] md:h-full">
        <img
          src={image.url}
          alt={image.title}
          className="w-full h-full object-cover transition-all duration-[1500ms] ease-in-out  scale-105 animate-zoom"
        />

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent"></div>

        {/* Controls */}
        <button
          onClick={() => navigate(-1)}
          className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 text-white text-2xl w-10 h-10 flex items-center justify-center rounded-full transition-transform hover:scale-110"
        >
          ‹
        </button>
        <button
          onClick={() => navigate(1)}
          className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 text-white text-2xl w-10 h-10 flex items-center justify-center rounded-full transition-transform hover:scale-110"
        >
          ›
        </button>

        {/* Image index */}
        <div className="absolute bottom-6 left-6 text-white/80 text-xs tracking-widest uppercase">
          {`0${currentIndex + 1}`} / {`0${heroImages.length}`}
        </div>
      </div>

      {/* RIGHT TEXT SIDE */}
      <div className="w-full md:w-[30%] h-[40vh] md:h-full bg-zinc-950 flex flex-col justify-center items-start px-6 md:px-10 py-8 md:py-0 text-zinc-300 relative">
        <div className="space-y-4 md:space-y-6">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-thin leading-tight tracking-wide animate-slideUp">
            {image.title}
          </h1>
          <p className="text-zinc-400 font-thin text-xl   md:text-xl leading-1.5 animate-fadeIn">
            {image.subtitle}
          </p>

          <button className="group relative inline-flex items-center gap-2 mt-6 px-6 py-3 rounded-full border border-zinc-700 overflow-hidden text-sm font-semibold tracking-wider uppercase">
            <span className="relative z-10 text-white group-hover:text-zinc-900 transition-colors duration-500">
              {image.cta}
            </span>
            <div className="absolute inset-0 bg-white scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 rounded-full"></div>
          </button>
        </div>

    
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes zoom {
          0% {
            transform: scale(1.05);
          }
          100% {
            transform: scale(1.1);
          }
        }
        .animate-zoom {
          animation: zoom 8s ease-in-out infinite alternate;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 1s ease-out both;
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideUp {
          animation: slideUp 0.8s ease-out both;
        }
      `}</style>
    </section>
  );
};

export default Hero;
