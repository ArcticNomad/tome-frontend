import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Pause, Play, BookOpen, ArrowRight, Star, Sparkles } from 'lucide-react';

const HeroSlideshow = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Data with your specific text included
  const slides = [
    {
      id: 1,
      // Cozy reading vibe
      image: "/banner1.jpg",
      tag: "Welcome",
      // Split title to match the design: "read all" (thin) + "YOU CAN" (bold)
      preTitle: "read all", 
      title: "YOU CAN",
      subtitle: "Discover a library that grows with you. Search smarter, read faster, and explore thousands of books effortlessly. Your next favorite story is just a click away.",
      cta: "Start Your Journey",
      link: "/books",
      accent: "bg-orange-500"
    },
    {
      id: 2,
      // Classic library architecture
      image: "/banner2.jpg",
      tag: "Curated",
      preTitle: "Discover",
      title: "Classic Literature",
      subtitle: "Dive into the world's greatest stories. From Austen to Zola, access thousands of free books from Project Gutenberg in one beautiful interface.",
      cta: "Explore Classics",
      link: "/classics",
      accent: "bg-emerald-500"
    },
    {
      id: 3,
      // Modern reading device/cozy
      image: "/banner3.png",
      tag: "Personalized",
      preTitle: "Your",
      title: "Reading Sanctuary",
      subtitle: "Track your progress, save your favorites, and get recommendations tailored specifically to your unique literary tastes.",
      cta: "Create Profile",
      link: "/signup",
      accent: "bg-blue-500"
    }
  ];

  useEffect(() => {
    if (isPaused) return;
    
    const interval = setInterval(() => {
      handleNext();
    }, 6000); // Slightly longer duration for better reading time

    return () => clearInterval(interval);
  }, [isPaused, currentSlide]);

  const handleNext = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setTimeout(() => setIsAnimating(false), 700);
  };

  const handlePrev = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    setTimeout(() => setIsAnimating(false), 700);
  };

  const handleDotClick = (index) => {
    if (isAnimating || index === currentSlide) return;
    setIsAnimating(true);
    setCurrentSlide(index);
    setTimeout(() => setIsAnimating(false), 700);
  };

  return (
    <div className="min-h-screen bg-white font-sans rounded-xl overflow-hidden">
      {/* Import Poppins Font for that specific geometric look */}
      <style>
        {`@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@200;300;400;800;900&display=swap');`}
      </style>

      {/* Added isolate, transform-gpu, and explicit z-index to enforce clipping of children */}
      <div className="relative w-full h-[600px] md:h-[600px] overflow-hidden bg-gray-900 group select-none shadow-xl rounded-b-[2rem] isolate transform-gpu">
        
        {/* Slides */}
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            {/* Image with subtle zoom effect */}
            <div className={`absolute inset-0 transform transition-transform duration-[10000ms] ease-linear ${
              index === currentSlide && !isPaused ? 'scale-100' : 'scale-80'
            }`}>
              <img
                src={slide.image}
                alt={slide.title}
                onError={(e) => {
                   // Optional: fallback if local image is missing
                   // e.target.src = "https://images.unsplash.com/photo-1519682337058-a94d519337bc?q=80&w=2070&auto=format&fit=crop";
                }}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Cinematic Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-90" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/20 to-transparent opacity-80" />

            {/* Content Container - Constrained width for readability */}
            <div className="absolute inset-0 flex flex-col justify-center">
              <div className="w-full max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
                <div className={`max-w-3xl transform transition-all duration-1000 delay-300 ${
                  index === currentSlide ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                }`}>
                  
                  {/* Tag */}
                  <span className={`inline-block px-4 py-1.5 rounded-full text-xs md:text-sm font-bold tracking-wider text-white uppercase mb-6 backdrop-blur-md bg-white/10 border border-white/20 ${
                    index === currentSlide ? 'animate-fadeIn' : ''
                  }`}>
                    <span className={`inline-block w-2 h-2 rounded-full mr-2 ${slide.accent}`}></span>
                    {slide.tag}
                  </span>

                  {/* Title Block - Updated to match reference image typography */}
                  <h1 className="text-white mb-6 leading-none" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    {/* Top line: Thin, lowercase */}
                    {slide.preTitle && (
                      <span className="block text-4xl md:text-5xl lg:text-4xl font-light lowercase mb-2 opacity-90 tracking-wide text-grey-200">
                        {slide.preTitle}
                      </span>
                    )}
                    {/* Main line: Ultra-Bold, Uppercase, rounded/geometric look */}
                    <span className="block text-6xl md:text-8xl lg:text-6xl font-black uppercase tracking-tight text-yellow-100">
                      {slide.title}
                    </span>
                  </h1>

                  {/* Subtitle */}
                  <p className="text-sm md:text-lg text-gray-200 mb-10 leading-relaxed font-light max-w-2xl border-l-4 border-white/30 pl-6">
                    {slide.subtitle}
                  </p>

                  {/* CTA Button */}
                  <div className="flex flex-wrap gap-4">
                    <button className="group relative px-8 py-4 bg-stone-300 text-gray-900 font-bold rounded-full overflow-hidden transition-all duration-300 hover:shadow-[0_0_40px_-10px_rgba(255,255,255,0.5)] hover:scale-105 active:scale-95">
                      <span className="relative z-10 flex items-center gap-2">
                        {slide.cta}
                        <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
                      </span>
                    </button>
                    
                    <button className="px-8 py-4 bg-transparent border border-white/30 text-white font-medium rounded-full hover:bg-white/10 backdrop-blur-sm transition-all duration-300">
                      Learn More
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Floating Glass Navigation Bar - Centered relative to content width */}
        <div className="absolute bottom-8 left-0 right-0 z-20">
          <div className="w-full max-w-7xl mx-auto px-6 md:px-12 lg:px-16 flex items-center justify-between">
            
            <div className="flex items-center gap-6">
              {/* Progress Indicators */}
              <div className="flex items-center gap-3">
                {slides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleDotClick(idx)}
                    className={`group relative h-1.5 rounded-full transition-all duration-500 overflow-hidden ${
                      idx === currentSlide ? 'w-16 bg-white' : 'w-6 bg-white/30 hover:bg-white/50'
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  >
                    {/* Progress Fill for current slide */}
                    {idx === currentSlide && !isPaused && (
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 animate-progress origin-left" />
                    )}
                  </button>
                ))}
              </div>

              {/* Control Buttons (Glassmorphism) */}
              <div className="flex items-center gap-2 ml-4">
                <button
                  onClick={handlePrev}
                  className="p-3 rounded-full bg-white/10 border border-white/10 backdrop-blur-md text-white hover:bg-white/20 hover:scale-110 active:scale-95 transition-all duration-300"
                >
                  <ChevronLeft size={20} />
                </button>
                
                <button
                  onClick={() => setIsPaused(!isPaused)}
                  className="p-3 rounded-full bg-white/10 border border-white/10 backdrop-blur-md text-white hover:bg-white/20 hover:scale-110 active:scale-95 transition-all duration-300"
                >
                  {isPaused ? <Play size={20} fill="currentColor" /> : <Pause size={20} fill="currentColor" />}
                </button>

                <button
                  onClick={handleNext}
                  className="p-3 rounded-full bg-white/10 border border-white/10 backdrop-blur-md text-white hover:bg-white/20 hover:scale-110 active:scale-95 transition-all duration-300"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>

            {/* Decorative elements - moved to bottom right alignment */}
            <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-black/20 backdrop-blur-lg border border-white/10 text-white/90 text-sm font-medium">
              <Sparkles size={14} className="text-yellow-400" />
              <span>Featured Collection</span>
            </div>

          </div>
        </div>

        {/* Global Styles for Animations */}
        <style>{`
          @keyframes progress {
            0% { transform: scaleX(0); }
            100% { transform: scaleX(1); }
          }
          .animate-progress {
            animation: progress 6s linear forwards;
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fadeIn {
            animation: fadeIn 0.8s ease-out forwards;
          }
        `}</style>
      </div>
    </div>
  );
};

// Main App Component
const App = () => {
  return (
    <HeroSlideshow />
  );
};

export default App;