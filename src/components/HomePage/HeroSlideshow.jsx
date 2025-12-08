import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Pause, Play, ArrowRight, Sparkles } from 'lucide-react';

// Mock Link component for standalone runnability, replace with react-router-dom Link if needed
const Link = ({ to, className, children }) => (
  <a href={to} className={className}>{children}</a>
);

const HeroSlideshow = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Data using CHILL theme colors
  const slides = [
    {
      id: 1,
      image: "./banner1.jpg",
      tag: "Welcome",
      preTitle: "read all", 
      title: "YOU CAN",
      subtitle: "Discover a library that grows with you. Search smarter, read faster, and explore thousands of books effortlessly.",
      cta: "Start Your Journey",
      link: "/books",
      accent: "bg-[#D4E09B]" // Chill Sage
    },
    {
      id: 2,
      image: "./banner2.jpg",
      tag: "Curated",
      preTitle: "Discover",
      title: "Classic Literature",
      subtitle: "Dive into the world's greatest stories. From Austen to Zola, access thousands of free books from Project Gutenberg.",
      cta: "Explore Classics",
      link: "/classics",
      accent: "bg-[#F7A278]" // Chill Sand/Orange
    },
    {
      id: 3,
      image: "./banner3.png",
      tag: "Personalized",
      preTitle: "Your",
      title: "Reading Sanctuary",
      subtitle: "Track your progress, save your favorites, and get recommendations tailored specifically to your unique literary tastes.",
      cta: "Create Profile",
      link: "/signup",
      accent: "bg-chill-bg" // Chill Blue
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
    <div className="bg-[#1A1F2C] font-sans overflow-hidden">
      <style>
        {`@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@200;300;400;800;900&display=swap');`}
      </style>

      {/* Main Slideshow Container */}
      <div className="relative w-full h-[85vh] lg:h-[700px] overflow-hidden bg-[#1A1F2C] group select-none shadow-xl isolate transform-gpu">
        
        {/* Slides */}
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            {/* Image & Zoom Effect */}
            <div className={`absolute inset-0 transform transition-transform duration-[8000ms] ease-linear ${
              index === currentSlide && !isPaused ? 'scale-105' : 'scale-100'
            }`}>
              <img
                src={slide.image}
                alt={slide.title}
                onError={(e) => {
                   e.target.src = "https://placehold.co/1920x1080/1A1F2C/D4E09B?text=CHILL+THEME";
                }}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Cinematic Gradient Overlay - Using Chill theme colors */}
             <div className="absolute inset-0 bg-gradient-to-t from-chill-bg via-chill-bg/50 to-transparent opacity-95" />
            <div className="absolute inset-0 bg-gradient-to-r from-chill-bg/90 via-chill-bg/30 to-transparent opacity-90" />
            {/* Content Container */}
            <div className="absolute inset-0 flex flex-col justify-center pt-20 md:pt-0">
              <div className="w-full max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
                <div className={`max-w-3xl transform transition-all duration-1000 delay-300 ${
                  index === currentSlide ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                }`}>
                  
                  {/* Tag */}
                  <span className={`inline-block px-4 py-1.5 rounded-full text-xs md:text-sm font-bold tracking-wider text-white uppercase mb-4 md:mb-6 backdrop-blur-md bg-[#262B38]/50 border border-white/10 ${
                    index === currentSlide ? 'animate-fadeIn' : ''
                  }`}>
                    <span className={`inline-block w-2 h-2 rounded-full mr-2 ${slide.accent}`}></span>
                    {slide.tag}
                  </span>

                  {/* Title Block */}
                  <h1 className="text-white mb-4 md:mb-6 leading-none" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    {/* Top line */}
                    {slide.preTitle && (
                      <span className="block text-3xl sm:text-4xl lg:text-5xl font-light lowercase mb-1 opacity-90 tracking-wide text-[#9CAFB7]">
                        {slide.preTitle}
                      </span>
                    )}
                    {/* Main line */}
                    <span className="block text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black uppercase tracking-tight text-[#D4E09B]">
                      {slide.title}
                    </span>
                  </h1>

                  {/* Subtitle */}
                  <p className="text-sm sm:text-base md:text-lg text-gray-300 mb-8 md:mb-10 leading-relaxed font-light max-w-xl md:max-w-2xl border-l-4 border-[#D4E09B]/50 pl-6">
                    {slide.subtitle}
                  </p>

                  {/* CTA Buttons */}
                  <div className="flex flex-wrap gap-3 sm:gap-4">
                    <Link 
                      to={slide.link}
                      className="group relative px-6 py-3 sm:px-8 sm:py-4 bg-[#D4E09B] text-black text-sm sm:text-base font-bold rounded-full overflow-hidden transition-all duration-300 hover:scale-[1.02] active:scale-95 border border-[#D4E09B] hover:bg-[#EAD2AC] hover:border-[#EAD2AC]"
                    >
                      <span className="relative z-10 flex items-center gap-2">
                        {slide.cta}
                        <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
                      </span>
                    </Link>
                    
                    <button className="px-6 py-3 sm:px-8 sm:py-4 bg-transparent border border-white/20 text-white text-sm sm:text-base font-medium rounded-full hover:bg-white/5 backdrop-blur-sm transition-all duration-300 hover:border-[#9CAFB7]/30 hover:text-[#9CAFB7]">
                      Learn More
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Floating Glass Navigation Bar */}
        <div className="absolute bottom-4 sm:bottom-8 left-0 right-0 z-20">
          <div className="w-full max-w-7xl mx-auto px-6 md:px-12 lg:px-16 flex items-center justify-between">
            
            <div className="flex items-center gap-4 sm:gap-6">
              {/* Progress Indicators */}
              <div className="flex items-center gap-2 sm:gap-3">
                {slides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleDotClick(idx)}
                    className={`group relative h-1 sm:h-1.5 rounded-full transition-all duration-500 overflow-hidden ${
                      idx === currentSlide ? 'w-10 sm:w-16 bg-white/20' : 'w-4 sm:w-6 bg-white/10 hover:bg-white/30'
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  >
                    {/* Progress Fill with Chill theme gradient */}
                    {idx === currentSlide && !isPaused && (
                      <div className="absolute inset-0 bg-gradient-to-r from-[#D4E09B] to-[#9CAFB7] animate-progress origin-left" />
                    )}
                  </button>
                ))}
              </div>

              {/* Control Buttons */}
              <div className="flex items-center gap-2 ml-2 sm:ml-4">
                <button
                  onClick={handlePrev}
                  className="p-2 sm:p-3 rounded-full bg-[#262B38]/50 border border-white/10 backdrop-blur-md text-white hover:bg-[#262B38] hover:text-[#D4E09B] hover:border-[#D4E09B]/30 hover:scale-105 active:scale-95 transition-all duration-300"
                >
                  <ChevronLeft size={18} className="sm:w-5 sm:h-5" />
                </button>
                
                <button
                  onClick={() => setIsPaused(!isPaused)}
                  className="p-2 sm:p-3 rounded-full bg-[#262B38]/50 border border-white/10 backdrop-blur-md text-white hover:bg-[#262B38] hover:text-[#D4E09B] hover:border-[#D4E09B]/30 hover:scale-105 active:scale-95 transition-all duration-300"
                >
                  {isPaused ? <Play size={18} className="fill-current" /> : <Pause size={18} className="fill-current" />}
                </button>

                <button
                  onClick={handleNext}
                  className="p-2 sm:p-3 rounded-full bg-[#262B38]/50 border border-white/10 backdrop-blur-md text-white hover:bg-[#262B38] hover:text-[#D4E09B] hover:border-[#D4E09B]/30 hover:scale-105 active:scale-95 transition-all duration-300"
                >
                  <ChevronRight size={18} className="sm:w-5 sm:h-5" />
                </button>
              </div>
            </div>

            {/* Decorative Label */}
            <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-[#262B38]/60 backdrop-blur-lg border border-white/10 text-white/80 text-sm font-medium">
              <Sparkles size={14} className="text-[#D4E09B]" />
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

const App = () => {
    return <HeroSlideshow />;
};

export default App;