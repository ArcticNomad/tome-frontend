// src/components/HorizontalCarousel.jsx
import React, { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

const HorizontalCarousel = ({ title, books, categories, activeCategory, onCategoryChange }) => {
  const scrollContainerRef = useRef(null);

  const scroll = (direction) => {
    const container = scrollContainerRef.current;
    if (container) {
      // Scroll by 200px (approx width of one card) * 2
      const scrollAmount = direction === 'left' ? -400 : 400;
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="mb-10 relative group/section">
      {/* Header Area */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
        <h2 className="text-xl font-bold text-gray-800">{title}</h2>
        
        {/* Optional Category Tabs (for Genre Section) */}
        {categories && (
          <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
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

      {/* Carousel Container */}
      <div className="relative">
        
        {/* Left Arrow (Hidden by default, shows on hover) */}
        <button 
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 z-10 w-10 h-10 bg-white shadow-lg rounded-full flex items-center justify-center text-gray-700 opacity-0 group-hover/section:opacity-100 transition-opacity disabled:opacity-0"
        >
          <ChevronLeft size={20} />
        </button>

        {/* Scrollable Area */}
        <div 
          ref={scrollContainerRef}
          className="flex gap-4 overflow-x-auto scroll-smooth hide-scrollbar px-1 py-4 -mx-1"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {books.map((book) => (
            <div 
              key={book.id} 
              className="flex-none w-[140px] md:w-[160px] snap-start transition-transform hover:-translate-y-1 duration-300"
            >
              {/* Reuse the card look */}
              <div className="aspect-[2/3] rounded-xl overflow-hidden shadow-md mb-3 group relative">
                <img 
                  src={book.cover} 
                  alt={book.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {/* Dark Overlay on Hover */}
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
              </div>
              
              <h3 className="font-bold text-gray-800 text-sm truncate">{book.title}</h3>
              <p className="text-xs text-gray-500 mb-1 truncate">{book.author}</p>
              
              {/* Mini Rating */}
              <div className="flex items-center gap-1">
                <Star size={10} className="fill-yellow-400 text-yellow-400" />
                <span className="text-[10px] text-gray-400">4.8</span>
              </div>
            </div>
          ))}
        </div>

        {/* Right Arrow */}
        <button 
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 z-10 w-10 h-10 bg-white shadow-lg rounded-full flex items-center justify-center text-gray-700 opacity-0 group-hover/section:opacity-100 transition-opacity"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default HorizontalCarousel;