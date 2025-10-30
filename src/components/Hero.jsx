import React, { useState, useEffect } from 'react';

const heroImages = [
  {
    url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1920&q=80',
    title: 'NEW COLLECTION',
    subtitle: 'Discover the latest trends in fashion',
    cta: 'EXPLORE NOW',
  },
  {
    url: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1920&q=80',
    title: 'TECH INNOVATION',
    subtitle: 'Cutting-edge gadgets for modern life',
    cta: 'SHOP TECH',
  },
  {
    url: 'https://images.unsplash.com/photo-1560343090-f0409e92791a?auto=format&fit=crop&w=1920&q=80',
    title: 'HOME & LIVING',
    subtitle: 'Transform your space with style',
    cta: 'VIEW COLLECTION',
  },
  {
    url: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1920&q=80',
    title: 'WELLNESS FIRST',
    subtitle: 'Premium products for healthy living',
    cta: 'DISCOVER MORE',
  },
  {
    url: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=1920&q=80',
    title: 'BEAUTY ESSENTIALS',
    subtitle: 'Elevate your beauty routine',
    cta: 'SHOP BEAUTY',
  },
];

const Hero = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroImages.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const navigate = (direction) => {
    setCurrentIndex((prev) => 
      (prev + direction + heroImages.length) % heroImages.length
    );
  };

  const NavButton = ({ direction, label }) => (
    <button
      onClick={() => navigate(direction)}
      className="absolute top-1/2 -translate-y-1/2 w-12 h-12 text-white/60 hover:text-white transition-colors z-20 group"
      style={{ [direction > 0 ? 'right' : 'left']: '2rem' }}
      aria-label={label}
    >
      <div className="absolute inset-0 border border-white/20 group-hover:border-white/60 transition-colors" />
      <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="square" strokeWidth={1} d={direction > 0 ? "M9 5l7 7-7 7" : "M15 19l-7-7 7-7"} />
      </svg>
    </button>
  );

  return (
    <section className="relative w-full h-screen overflow-hidden bg-black">
      <div className="relative w-full h-full">
        {heroImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-[1500ms] ease-in-out ${
              index === currentIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
            }`}
          >
            <div
              className="w-full h-full bg-cover bg-center grayscale"
              style={{ backgroundImage: `url('${image.url}')` }}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/80 to-black/90" />
            </div>

            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 md:px-12">
              <h1 className="text-6xl md:text-8xl lg:text-9xl font-light text-white mb-8 tracking-[0.15em] leading-none animate-[slideUp_1s_ease-out_0.4s_both]">
                {image.title}
              </h1>
              <div className="w-24 h-px bg-white mb-8 animate-[expand_0.8s_ease-out_0.8s_both]" />
              <p className="text-lg md:text-xl lg:text-2xl text-white/80 mb-12 max-w-2xl font-light tracking-wide animate-[fadeIn_1s_ease-out_0.6s_both]">
                {image.subtitle}
              </p>
              <button className="group relative px-12 py-4 bg-transparent text-white font-light text-sm tracking-[0.2em] border border-white overflow-hidden transition-all duration-500 hover:text-black animate-[fadeIn_1s_ease-out_0.9s_both]">
                <span className="relative z-10">{image.cta}</span>
                <div className="absolute inset-0 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <NavButton direction={-1} label="Previous slide" />
      <NavButton direction={1} label="Next slide" />

      <div className="absolute bottom-12 md:bottom-16 left-1/2 -translate-x-1/2 flex gap-4 z-20">
        {heroImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className="group"
            aria-label={`Go to slide ${index + 1}`}
          >
            <div className={`h-px transition-all duration-500 ${
              index === currentIndex ? 'w-16 bg-white' : 'w-8 bg-white/40 group-hover:bg-white/60 group-hover:w-12'
            }`} />
          </button>
        ))}
      </div>

      <div className="absolute bottom-12 md:bottom-16 right-8 md:right-16 flex flex-col items-center gap-3 text-white/40 z-20">
        <span className="text-xs font-light tracking-[0.3em] rotate-90 -mr-8">SCROLL</span>
        <div className="w-px h-12 bg-white/20" />
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(50px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes expand {
          from { width: 0; opacity: 0; }
          to { width: 6rem; opacity: 1; }
        }
      `}</style>
    </section>
  );
};

export default Hero;