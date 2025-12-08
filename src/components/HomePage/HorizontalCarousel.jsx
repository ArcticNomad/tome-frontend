// src/components/HomePage/HorizontalCarousel.jsx
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import BookCard from './BookCard';

const HorizontalCarousel = ({ 
  title, 
  books = [],
  categories, 
  activeCategory, 
  onCategoryChange,
  isLoading = false,
  theme = 'dark'
}) => {
  const scrollContainerRef = useRef(null);
  const animationRef = useRef(null);
  const currentScrollRef = useRef(0);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const isDragging = useRef(false);
  const [showButtons, setShowButtons] = useState(false);
  
  const SCROLL_SPEED = 0.17;

  // Safely check if books exist and is an array
  const safeBooks = Array.isArray(books) ? books : [];

  // Touch events for mobile scrolling
  const handleTouchStart = useCallback((e) => {
    if (!scrollContainerRef.current) return;
    
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    isDragging.current = true;
    stopScroll();
    
    // Add active class for visual feedback
    scrollContainerRef.current.classList.add('active-scroll');
  }, []);

  const handleTouchMove = useCallback((e) => {
    if (!isDragging.current || !scrollContainerRef.current) return;
    
    const touchX = e.touches[0].clientX;
    const touchY = e.touches[0].clientY;
    
    // Calculate swipe direction
    const deltaX = touchStartX.current - touchX;
    const deltaY = touchStartY.current - touchY;
    
    // Only scroll if horizontal movement is greater than vertical (avoid conflict with vertical scroll)
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      e.preventDefault(); // Prevent vertical scroll when swiping horizontally
      scrollContainerRef.current.scrollLeft += deltaX * 2; // Multiply for better feel
      touchStartX.current = touchX;
    }
  }, []);

  const handleTouchEnd = useCallback(() => {
    isDragging.current = false;
    if (scrollContainerRef.current) {
      scrollContainerRef.current.classList.remove('active-scroll');
    }
    // Restart auto-scroll after a delay
    setTimeout(() => {
      if (!scrollContainerRef.current) return;
      const rect = scrollContainerRef.current.getBoundingClientRect();
      const isHovering = rect.top < window.innerHeight && rect.bottom > 0;
      if (isHovering) {
        startScroll();
      }
    }, 1000);
  }, []);

  // ALL HOOKS MUST BE CALLED BEFORE ANY CONDITIONAL RETURNS
  useEffect(() => {
    if (isLoading || safeBooks.length === 0) {
      return;
    }

    currentScrollRef.current = 0;
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft = 0;
    }

    const timeoutId = setTimeout(() => {
      startScroll();
    }, 100);
    
    return () => {
      clearTimeout(timeoutId);
      stopScroll();
    };
  }, [safeBooks, isLoading]);

  // Add/remove touch event listeners
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd);
    container.addEventListener('touchcancel', handleTouchEnd);

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
      container.removeEventListener('touchcancel', handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd]);

  // Check scroll position to show/hide navigation buttons on mobile
  useEffect(() => {
    const checkScroll = () => {
      if (!scrollContainerRef.current) return;
      
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      const canScrollLeft = scrollLeft > 10;
      const canScrollRight = scrollLeft < (scrollWidth - clientWidth - 10);
      
      // On mobile, show buttons if user can scroll either direction
      setShowButtons(canScrollLeft || canScrollRight);
    };

    const container = scrollContainerRef.current;
    if (!container) return;

    container.addEventListener('scroll', checkScroll);
    return () => container.removeEventListener('scroll', checkScroll);
  }, []);

  const startScroll = () => {
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
    if (isDragging.current) return; // Don't auto-scroll while dragging

    const animate = () => {
      const container = scrollContainerRef.current;
      
      if (container && !isDragging.current) {
        currentScrollRef.current += SCROLL_SPEED;
        container.scrollLeft = currentScrollRef.current;

        if (container.scrollLeft >= container.scrollWidth / 4) {
          currentScrollRef.current = 0;
          container.scrollLeft = 0;
        } 
      }
      
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
  };

  const stopScroll = () => {
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
  };

  const manualScroll = (direction) => {
    const container = scrollContainerRef.current;
    if (container) {
      stopScroll();
      
      // Calculate scroll amount based on viewport width
      const isMobile = window.innerWidth < 768;
      const scrollAmount = direction === 'left' 
        ? -container.clientWidth * 0.7 
        : container.clientWidth * 0.7;
      
      container.scrollBy({ 
        left: scrollAmount, 
        behavior: 'smooth' 
      });
      
      setTimeout(() => {
        if (container) {
          currentScrollRef.current = container.scrollLeft;
          startScroll();
        }
      }, 500);
    }
  };

  // Now we can conditionally return after all hooks are called
  if (isLoading) {
    return (
      <div className="mb-8 md:mb-10">
        <h2 className="text-lg md:text-xl font-bold text-white mb-4">{title}</h2>
        <div className="flex gap-3 md:gap-4 overflow-x-auto hide-scrollbar pb-2">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex-none w-[120px] sm:w-[140px] md:w-[150px] animate-pulse">
              <div className="aspect-[2/3] bg-chill-bg rounded-lg md:rounded-xl mb-2 md:mb-3"></div>
              <div className="h-3 md:h-4 bg-chill-bg rounded mb-1"></div>
              <div className="h-2.5 md:h-3 bg-chill-bg rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (safeBooks.length === 0) {
    return (
      <div className="mb-8 md:mb-10">
        <h2 className="text-lg md:text-xl font-bold text-white mb-4">{title}</h2>
        <div className="text-center py-6 md:py-8 text-gray-400">
          <p className="text-sm md:text-base">No related books found</p>
        </div>
      </div>
    );
  }

  // Duplicate data for infinite loop illusion
  const extendedBooks = [...safeBooks, ...safeBooks, ...safeBooks, ...safeBooks];

  // Theme-based styling
  const isDark = theme === 'dark';
  const titleColor = isDark ? 'text-white' : 'text-gray-800';
  const buttonBg = isDark ? 'bg-chill-card' : 'bg-white';
  const buttonBorder = isDark ? 'border-white/10' : 'border-gray-200';
  const buttonText = isDark ? 'text-gray-200' : 'text-gray-600';
  const buttonHover = isDark ? 'hover:bg-white/5' : 'hover:bg-gray-50';
  const activeButtonBg = isDark ? 'bg-chill-sage' : 'bg-purple-600';
  const activeButtonText = isDark ? 'text-black' : 'text-white';

  return (
    <div className="mb-8 md:mb-10 relative group/section">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 md:mb-4 gap-3 md:gap-4">
        <h2 className={`text-lg md:text-xl font-bold ${titleColor}`}>{title}</h2>
        
        {categories && (
          <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar z-20 relative">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => onCategoryChange(cat)}
                className={`px-3 md:px-4 py-1 md:py-1.5 rounded-full text-xs md:text-sm font-semibold whitespace-nowrap transition-colors flex-shrink-0 ${
                  activeCategory === cat 
                    ? `${activeButtonBg} ${activeButtonText}` 
                    : `${buttonBg} border ${buttonBorder} ${buttonText} ${buttonHover}`
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>

      <div 
        className="relative"
        onMouseEnter={stopScroll}
        onMouseLeave={startScroll}
      >
        {/* Left Scroll Button - Visible on desktop, conditionally on mobile */}
        <button 
          onClick={() => manualScroll('left')}
          className={`absolute left-0 top-1/2 -translate-y-1/2 -ml-2 md:-ml-4 z-10 w-8 h-8 md:w-10 md:h-10 
                     ${buttonBg} shadow-lg rounded-full flex items-center justify-center ${buttonText} 
                     border ${buttonBorder} transition-all duration-300
                     hidden sm:flex sm:opacity-0 group-hover/section:opacity-100
                     ${showButtons ? 'sm:hidden md:flex' : ''}
                     active:scale-95`}
          aria-label="Scroll left"
        >
          <ChevronLeft size={16} className="md:size-20" />
        </button>

        {/* Scrollable Area */}
        <div 
          ref={scrollContainerRef}
          className="flex gap-3 md:gap-4 overflow-x-auto hide-scrollbar px-1 py-2 md:py-4 -mx-1 cursor-grab active:cursor-grabbing"
          style={{ 
            scrollBehavior: 'auto',
            WebkitOverflowScrolling: 'touch', // Better momentum scrolling on iOS
            scrollbarWidth: 'none', // Firefox
            msOverflowStyle: 'none', // IE/Edge
          }}
        >
          {extendedBooks.map((book, index) => (
            <div 
              key={`${book?.gutenbergId || book?._id || index}-${index}`} 
              className="flex-none w-[120px] sm:w-[140px] md:w-[160px] lg:w-[180px] 
                        transition-transform duration-300 hover:-translate-y-1 
                        active:scale-95"
            >
              <BookCard book={book} />
            </div>
          ))}
        </div>

        {/* Right Scroll Button - Visible on desktop, conditionally on mobile */}
        <button 
          onClick={() => manualScroll('right')}
          className={`absolute right-0 top-1/2 -translate-y-1/2 -mr-2 md:-mr-4 z-10 w-8 h-8 md:w-10 md:h-10 
                     ${buttonBg} shadow-lg rounded-full flex items-center justify-center ${buttonText} 
                     border ${buttonBorder} transition-all duration-300
                     hidden sm:flex sm:opacity-0 group-hover/section:opacity-100
                     ${showButtons ? 'sm:hidden md:flex' : ''}
                     active:scale-95`}
          aria-label="Scroll right"
        >
          <ChevronRight size={16} className="md:size-20" />
        </button>

        {/* Mobile Navigation Dots (optional) */}
        <div className="flex justify-center gap-1.5 mt-3 md:hidden">
          {safeBooks.slice(0, 5).map((_, index) => (
            <button
              key={index}
              onClick={() => {
                if (scrollContainerRef.current) {
                  const scrollAmount = scrollContainerRef.current.clientWidth * index;
                  scrollContainerRef.current.scrollTo({
                    left: scrollAmount,
                    behavior: 'smooth'
                  });
                }
              }}
              className={`w-1.5 h-1.5 rounded-full transition-all ${
                index === 0 
                  ? 'bg-chill-sage w-4' 
                  : 'bg-white/20'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Mobile floating scroll hint (only shows initially) */}
      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 md:hidden">
        <div className="text-[10px] text-gray-400 animate-pulse">
          ← swipe →
        </div>
      </div>

      {/* Custom scrollbar styles */}
      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .active-scroll {
          cursor: grabbing;
        }
        @media (hover: hover) {
          .hide-scrollbar:hover::-webkit-scrollbar {
            display: block;
            height: 6px;
          }
          .hide-scrollbar:hover::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.05);
            border-radius: 3px;
          }
          .hide-scrollbar:hover::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.2);
            border-radius: 3px;
          }
        }
      `}</style>
    </div>
  );
};

export default HorizontalCarousel;