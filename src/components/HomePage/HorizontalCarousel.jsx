// src/components/HomePage/HorizontalCarousel.jsx
import React, { useRef, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

const HorizontalCarousel = ({ title, books, categories, activeCategory, onCategoryChange }) => {
  const scrollContainerRef = useRef(null);
  const animationRef = useRef(null);
  
  // 1. New Ref to track the EXACT float position (e.g., 10.5px)
  // This solves the issue where the browser rounds 0.5 down to 0
  const currentScrollRef = useRef(0);

  // Duplicate data for infinite loop illusion
  const extendedBooks = books && books.length > 0 ? [...books, ...books, ...books, ...books] : [];

  const SCROLL_SPEED = 0.17; // Slightly increased for visibility

  const startScroll = () => {
    // Clear any existing animation to prevent speeding up
    if (animationRef.current) cancelAnimationFrame(animationRef.current);

    const animate = () => {
      const container = scrollContainerRef.current;
      
      if (container) {
        // 1. Increment our TRACKER, not the DOM directly
        currentScrollRef.current += SCROLL_SPEED;

        // 2. Apply the tracker value to the DOM
        container.scrollLeft = currentScrollRef.current;

        // 3. Infinite Loop Reset Logic
        // If we have scrolled past the length of the first set (1/4 of total content now)
        // We reset the position. 
        // We use scrollWidth / 4 because we duplicated data 4 times.
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

  useEffect(() => {
    // Safety check: Don't scroll if no books
    if (!books || books.length === 0) return;

    // Reset position when category changes
    currentScrollRef.current = 0;
    if (scrollContainerRef.current) scrollContainerRef.current.scrollLeft = 0;

    const timeoutId = setTimeout(() => {
        startScroll();
    }, 100);
    
    return () => {
        clearTimeout(timeoutId);
        stopScroll();
    };
  }, [books]); 

  const manualScroll = (direction) => {
    const container = scrollContainerRef.current;
    if (container) {
      stopScroll(); // Stop auto-scroll momentarily
      
      const scrollAmount = direction === 'left' ? -300 : 300;
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      
      // Update our tracker to match where the manual scroll landed
      // We add a delay to wait for the smooth scroll to finish
      setTimeout(() => {
        currentScrollRef.current = container.scrollLeft;
        startScroll(); // Restart auto-scroll
      }, 500);
    }
  };

  if (!books || books.length === 0) return null;

  return (
    <div className="mb-10 relative group/section">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
        <h2 className="text-xl font-bold text-gray-800">{title}</h2>
        
        {categories && (
          <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar z-20 relative">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => onCategoryChange(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                  activeCategory === cat 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
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
        <button 
          onClick={() => manualScroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 z-10 w-10 h-10 bg-white shadow-lg rounded-full flex items-center justify-center text-gray-700 opacity-0 group-hover/section:opacity-100 transition-opacity disabled:opacity-0"
        >
          <ChevronLeft size={20} />
        </button>

        {/* Scrollable Area */}
        <div 
          ref={scrollContainerRef}
          className="flex gap-4 overflow-x-auto hide-scrollbar px-1 py-4 -mx-1"
          style={{ 
             // IMPORTANT: We explicitly disable smooth scroll here because
             // it fights with our frame-by-frame JS animation.
             scrollBehavior: 'auto' 
          }}
        >
          {extendedBooks.map((book, index) => (
            <div 
              key={`${book.id}-${index}`} 
              className="flex-none w-[140px] md:w-[160px] transition-transform hover:-translate-y-1 duration-300"
            >
              <div className="aspect-[2/3] rounded-xl overflow-hidden shadow-md mb-3 group relative cursor-pointer">
                <img 
                  src={book.cover} 
                  alt={book.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
              </div>
              
              <h3 className="font-bold text-gray-800 text-sm truncate">{book.title}</h3>
              <p className="text-xs text-gray-500 mb-1 truncate">{book.author}</p>
              
              <div className="flex items-center gap-1">
                <Star size={10} className="fill-yellow-400 text-yellow-400" />
                <span className="text-[10px] text-gray-400">4.8</span>
              </div>
            </div>
          ))}
        </div>

        <button 
          onClick={() => manualScroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 z-10 w-10 h-10 bg-white shadow-lg rounded-full flex items-center justify-center text-gray-700 opacity-0 group-hover/section:opacity-100 transition-opacity"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default HorizontalCarousel;