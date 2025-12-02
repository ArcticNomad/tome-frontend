import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Pause, Play, ArrowRight, Sparkles } from 'lucide-react';

const HeroSlideshow = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Data using theme classes
  const slides = [
    {
      id: 1,
      image: "/banner1.jpg",
      tag: "Welcome",
      preTitle: "read all", 
      title: "YOU CAN",
      subtitle: "Discover a library that grows with you. Search smarter, read faster, and explore thousands of books effortlessly.",
      cta: "Start Your Journey",
      link: "/books",
      accent: "bg-chill-sage" // Using chill-sage
    },
    {
      id: 2,
      image: "/banner2.jpg",
      tag: "Curated",
      preTitle: "Discover",
      title: "Classic Literature",
      subtitle: "Dive into the world's greatest stories. From Austen to Zola, access thousands of free books from Project Gutenberg.",
      cta: "Explore Classics",
      link: "/classics",
      accent: "bg-chill-rose" // Using chill-rose
    },
    {
      id: 3,
      image: "/banner3.png",
      tag: "Personalized",
      preTitle: "Your",
      title: "Reading Sanctuary",
      subtitle: "Track your progress, save your favorites, and get recommendations tailored specifically to your unique literary tastes.",
      cta: "Create Profile",
      link: "/signup",
      accent: "bg-chill-blue" // Using chill-blue
    }
  ];

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      handleNext();
    }, 6000); 
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
    <div className=" bg-chill-surface font-sans overflow-hidden">
      <style>
        {`@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@200;300;400;800;900&display=swap');`}
      </style>

      <div className="relative w-full h-[90vh] md:h-[655px] md:h-[600px] overflow-hidden bg-chill-bg group select-none shadow-xl isolate transform-gpu">
        
        {/* Slides */}
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            {/* Image */}
            <div className={`absolute inset-0 transform transition-transform duration-[10000ms] ease-linear ${
              index === currentSlide && !isPaused ? 'scale-100' : 'scale-100'
            }`}>
              <img
                src={slide.image}
                alt={slide.title}
                onError={(e) => {
                   e.target.src = "https://images.unsplash.com/photo-1519682337058-a94d519337bc?q=80&w=2070&auto=format&fit=crop";
                }}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Cinematic Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-chill-bg via-chill-bg/50 to-transparent opacity-95" />
            <div className="absolute inset-0 bg-gradient-to-r from-chill-bg/90 via-chill-bg/30 to-transparent opacity-90" />

            {/* Content Container */}
            <div className="absolute inset-0 flex flex-col justify-center">
              <div className="w-full max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
                <div className={`max-w-3xl transform transition-all duration-1000 delay-300 ${
                  index === currentSlide ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                }`}>
                  
                  {/* Tag */}
                  <span className={`inline-block px-4 py-1.5 rounded-full text-xs md:text-sm font-bold tracking-wider text-white uppercase mb-6 backdrop-blur-md bg-chill-card/50 border border-white/10 ${
                    index === currentSlide ? 'animate-fadeIn' : ''
                  }`}>
                    <span className={`inline-block w-2 h-2 rounded-full mr-2 ${slide.accent}`}></span>
                    {slide.tag}
                  </span>

                  {/* Title Block */}
                  <h1 className="text-white mb-6 leading-none" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    {/* Top line: Thin, lowercase */}
                    {slide.preTitle && (
                      <span className="block text-4xl md:text-5xl lg:text-4xl font-light lowercase mb-2 opacity-90 tracking-wide text-chill-blue">
                        {slide.preTitle}
                      </span>
                    )}
                    {/* Main line: Ultra-Bold */}
                    <span className="block text-6xl md:text-8xl lg:text-6xl font-black uppercase tracking-tight text-chill-sage">
                      {slide.title}
                    </span>
                  </h1>

                  {/* Subtitle */}
                  <p className="text-sm md:text-lg text-gray-300 mb-10 leading-relaxed font-light max-w-2xl border-l-4 border-chill-sage/50 pl-6">
                    {slide.subtitle}
                  </p>

                  {/* CTA Buttons */}
                  <div className="flex flex-wrap gap-4">
                    <Link 
                      to={slide.link}
                      className="group relative px-8 py-4 bg-chill-sage text-black font-bold rounded-full overflow-hidden transition-all duration-300 hover:scale-105 active:scale-95 border border-chill-sage"
                    >
                      <span className="relative z-10 flex items-center gap-2">
                        {slide.cta}
                        <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
                      </span>
                    </Link>
                    
                    <button className="px-8 py-4 bg-transparent border border-white/20 text-white font-medium rounded-full hover:bg-white/5 backdrop-blur-sm transition-all duration-300">
                      Learn More
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Floating Glass Navigation Bar */}
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
                      idx === currentSlide ? 'w-16 bg-white/20' : 'w-6 bg-white/10 hover:bg-white/30'
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  >
                    {/* Progress Fill */}
                    {idx === currentSlide && !isPaused && (
                      <div className="absolute inset-0 bg-gradient-to-r from-chill-sage to-chill-blue animate-progress origin-left" />
                    )}
                  </button>
                ))}
              </div>

              {/* Control Buttons (Dark Glassmorphism) */}
              <div className="flex items-center gap-2 ml-4">
                <button
                  onClick={handlePrev}
                  className="p-3 rounded-full bg-chill-card/50 border border-white/10 backdrop-blur-md text-white hover:bg-chill-card hover:text-chill-sage hover:border-chill-sage/30 hover:scale-110 active:scale-95 transition-all duration-300"
                >
                  <ChevronLeft size={20} />
                </button>
                
                <button
                  onClick={() => setIsPaused(!isPaused)}
                  className="p-3 rounded-full bg-chill-card/50 border border-white/10 backdrop-blur-md text-white hover:bg-chill-card hover:text-chill-sage hover:border-chill-sage/30 hover:scale-110 active:scale-95 transition-all duration-300"
                >
                  {isPaused ? <Play size={20} fill="currentColor" /> : <Pause size={20} fill="currentColor" />}
                </button>

                <button
                  onClick={handleNext}
                  className="p-3 rounded-full bg-chill-card/50 border border-white/10 backdrop-blur-md text-white hover:bg-chill-card hover:text-chill-sage hover:border-chill-sage/30 hover:scale-110 active:scale-95 transition-all duration-300"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>

            {/* Decorative Label */}
            <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-chill-card/60 backdrop-blur-lg border border-white/10 text-white/80 text-sm font-medium">
              <Sparkles size={14} className="text-chill-sage" />
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

export default HeroSlideshow;