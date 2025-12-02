// src/components/HomePage/HorizontalCarousel.jsx
import React, { useRef, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import BookCard from './BookCard';

const HorizontalCarousel = ({ 
  title, 
  books, 
  categories, 
  activeCategory, 
  onCategoryChange,
  isLoading = false 
}) => {
  const scrollContainerRef = useRef(null);
  const animationRef = useRef(null);
  const currentScrollRef = useRef(0);
  const SCROLL_SPEED = 0.17;

  // ALL HOOKS MUST BE CALLED BEFORE ANY CONDITIONAL RETURNS
  useEffect(() => {
    // Don't start scroll if no books or loading
    if (isLoading || !books || books.length === 0) {
      return;
    }

    currentScrollRef.current = 0;
    if (scrollContainerRef.current) scrollContainerRef.current.scrollLeft = 0;

    const timeoutId = setTimeout(() => {
        startScroll();
    }, 100);
    
    return () => {
        clearTimeout(timeoutId);
        stopScroll();
    };
  }, [books, isLoading]); 

  const startScroll = () => {
    if (animationRef.current) cancelAnimationFrame(animationRef.current);

    const animate = () => {
      const container = scrollContainerRef.current;
      
      if (container) {
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
      
      const scrollAmount = direction === 'left' ? -300 : 300;
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      
      setTimeout(() => {
        currentScrollRef.current = container.scrollLeft;
        startScroll();
      }, 500);
    }
  };

  // Now we can conditionally return after all hooks are called
  if (isLoading) {
    return (
      <div className="mb-10">
        <h2 className="text-xl font-bold text-gray-800 mb-4">{title}</h2>
        <div className="flex gap-4 overflow-x-auto hide-scrollbar">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex-none w-[140px] animate-pulse">
              <div className="aspect-[2/3] bg-gray-200 rounded-xl mb-3"></div>
              <div className="h-4 bg-gray-200 rounded mb-1"></div>
              <div className="h-3 bg-gray-200 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!books || books.length === 0) {
    return (
      <div className="mb-10">
        <h2 className="text-xl font-bold text-gray-800 mb-4">{title}</h2>
        <div className="text-center py-8 text-gray-500">
          <p>No books available</p>
        </div>
      </div>
    );
  }

  // Duplicate data for infinite loop illusion
  const extendedBooks = [...books, ...books, ...books, ...books];

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
          className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 z-10 w-10 h-10 bg-white shadow-lg rounded-full flex items-center justify-center text-gray-700 opacity-0 group-hover/section:opacity-100 transition-opacity"
        >
          <ChevronLeft size={20} />
        </button>

        {/* Scrollable Area */}
        <div 
          ref={scrollContainerRef}
          className="flex gap-4 overflow-x-auto hide-scrollbar px-1 py-4 -mx-1"
          style={{ scrollBehavior: 'auto' }}
        >
          {extendedBooks.map((book, index) => (
            <div 
              key={`${book.gutenbergId || book._id}-${index}`} 
              className="flex-none w-[140px] md:w-[160px] transition-transform hover:-translate-y-1 duration-300"
            >
              <BookCard book={book} />
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