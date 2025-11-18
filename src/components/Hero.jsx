import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const heroImages = [
  {
    url: "https://images.unsplash.com/photo-1758186374131-d542d2beae0c?q=80&w=1032&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    title: "ENGINEERED TO INSPIRE",
    subtitle: "A fusion of mindful design and next-gen intelligence — crafted for curious minds.",
    cta: "Enter the Future",
    categoryLabel: "Technology"
  },
  {
    url: "https://plus.unsplash.com/premium_photo-1701108112647-42fcf021841a?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=1920",
    title: "STYLE IN MOTION",
    subtitle: "Fluid silhouettes, artful minimalism, and statements that whisper luxury.",
    cta: "Explore the Drop",
    categoryLabel: "Fashion"
  },
  {
    url: "https://images.unsplash.com/photo-1619218005459-c8651c2f5918?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    title: "SPACES THAT BREATHE",
    subtitle: "Objects with presence — designed to calm, uplift, and redefine your everyday.",
    cta: "Curate Your Space",
    categoryLabel: "Home & Living"
  },
  {
    url: "https://plus.unsplash.com/premium_photo-1708971732751-70c3e1cfa2b6?q=80&w=849&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    title: "RITUALS OF BALANCE",
    subtitle: "Clean nourishment and conscious choices for a centered, intentional life.",
    cta: "Elevate Your Routine",
    categoryLabel: "Food & Wellness"
  },
  {
    url: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    title: "ELEMENTS OF EXPRESSION",
    subtitle: "Accessories that turn simplicity into identity — subtle, striking, unmistakable.",
    cta: "View the Collection",
    categoryLabel: "Accessories"
  },
  {
    url: "https://images.unsplash.com/photo-1562347174-7370ad83dc47?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    title: "THE ART OF CARE",
    subtitle: "Modern beauty driven by clarity, purity, and quiet confidence.",
    cta: "Uncover Essentials",
    categoryLabel: "Beauty"
  },
  {
    url: "https://images.unsplash.com/photo-1693833923492-16fd4c1373bf?q=80&w=580&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    title: "UNEXPECTED TREASURES",
    subtitle: "Rare finds, curious objects, and pieces that deserve a second glance.",
    cta: "Discover More",
    categoryLabel: "Other"
  },
];


const Hero = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  // Auto-play
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroImages.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const goToSlide = (direction) => {
    setCurrentIndex((prev) => (prev + direction + heroImages.length) % heroImages.length);
  };

  const image = heroImages[currentIndex];

  return (
    <section className="relative flex flex-col md:flex-row w-full h-screen max-h-[900px] overflow-hidden font-sans">

      {/* LEFT: IMAGE */}
      <div className="relative w-full md:w-[65%] h-[60vh] md:h-full ">
        <img
          src={image.url}
          alt={image.title}
          key={image.url}
          className="w-full h-full object-cover transition-transform duration-[1500ms] ease-in-out scale-100 animate-zoom"
        />

        <div className="absolute "></div>

        {/* CONTROLS */}
        <button
          onClick={() => goToSlide(-1)}
          className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/30 backdrop-blur-sm border border-white/40 text-white w-12 h-12 flex items-center justify-center rounded-full transition-all duration-300 hover:scale-105 shadow-lg"
          aria-label="Previous Slide"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <button
          onClick={() => goToSlide(1)}
          className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/30 backdrop-blur-sm border border-white/40 text-white w-12 h-12 flex items-center justify-center rounded-full transition-all duration-300 hover:scale-105 shadow-lg"
          aria-label="Next Slide"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* SLIDE INDICATOR */}
        {/* <div className="absolute bottom-6 left-6 text-white/80 text-sm tracking-widest font-light uppercase">
          <span className="font-semibold">{`0${currentIndex + 1}`}</span> / {`0${heroImages.length}`}
        </div> */}
      </div>

      {/* RIGHT: TEXT PANEL */}
      <div className="w-full md:w-[35%] h-[40vh] md:h-full bg-[#000000] flex flex-col justify-center items-start px-8 md:px-12 py-10 text-zinc-300 relative">

        <div className="space-y-6 md:space-y-8" key={currentIndex}>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-thin leading-tight tracking-tight text-white animate-slideUp">
            {image.title}
          </h1>

          <p className="text-zinc-400 font-light text-xl md:text-2xl leading-normal animate-fadeIn delay-300">
            {image.subtitle}
          </p>

          <button
            onClick={() =>
              navigate(`/product?category=${encodeURIComponent(image.categoryLabel)}`)
            }
            className="group relative inline-flex items-center justify-center gap-3 mt-4 px-8 py-3 rounded-md border border-white/50 text-white overflow-hidden text-base font-medium tracking-widest uppercase transition-shadow duration-300 shadow-md hover:shadow-lg"
          >
            <div className="absolute inset-0 bg-white scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 rounded-xl"></div>
            <span className="relative z-10 group-hover:text-zinc-950 transition-colors duration-500">
              {image.cta}
            </span>
            <ChevronRight className="relative z-10 w-5 h-5 group-hover:text-zinc-950 transition-colors duration-500" />
          </button>
        </div>
      </div>

      {/* CUSTOM CSS */}
      <style jsx>{`
        @keyframes zoom {
          0% { transform: scale(1.0); }
          100% { transform: scale(1.05); }
        }
        .animate-zoom {
          animation: zoom 8s ease-in-out infinite alternate;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(50px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slideUp {
          animation: slideUp 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
        }
      `}</style>
      
    </section>
  );
};

export default Hero;
