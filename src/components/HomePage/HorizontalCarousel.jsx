import React, { useRef, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Star, Heart, Bookmark, Plus, Check, ShoppingBag, Download } from 'lucide-react';
import { Link } from 'react-router-dom';

// --- Internal Mock Components (to fix dependency errors) ---

const StarRating = ({ rating }) => (
  <div className="flex items-center gap-0.5">
    {[...Array(5)].map((_, i) => (
      <Star 
        key={i} 
        size={12} 
        className={i < Math.round(rating) ? "fill-chill-sage text-chill-sage" : "text-gray-600"} 
      />
    ))}
    <span className="text-xs text-gray-500 ml-1">{rating}</span>
  </div>
);

const BookCard = ({ book }) => {
  const [imageSrc, setImageSrc] = useState(book.coverImageUrl || 'https://via.placeholder.com/300x450?text=No+Cover');
  const [isHovered, setIsHovered] = useState(false);

  const handleError = () => {
    setImageSrc('https://via.placeholder.com/300x450?text=Error');
  };

  const bookTitle = book.title || 'Untitled';
  const bookAuthor = book.author || 'Unknown Author';
  const bookId = book.gutenbergId || book._id;
  const downloadCount = book.downloadCount || 0;
  const rating = Math.min(5, 3 + (downloadCount / 10000) * 2).toFixed(1);

  return (
    <div 
      className="flex flex-col group relative cursor-pointer hover:border-chill-sage/30 rounded-2xl p-2 transition-all duration-300 border border-transparent w-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      
      {/* Cover Image Container */}
      <div className="border-2 border-white/5 relative rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 mb-2 aspect-[2/3] bg-chill-card">
        
        <img 
          src={imageSrc} 
          alt={bookTitle} 
          onError={handleError}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
        />

        {/* Status Badge */}
        {downloadCount > 50000 && (
          <span className="absolute top-2 left-2 bg-chill-sage text-black text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide shadow-md">
            Popular
          </span>
        )}

        {/* Hover Overlay Actions */}
        <div className={`absolute inset-0 bg-gradient-to-t from-chill-bg/95 via-chill-bg/40 to-transparent transition-opacity duration-300 flex flex-col justify-between p-3 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
            
            {/* Top Right: Buttons */}
            <div className="flex justify-between">
              <button className="bg-chill-bg/90 p-1.5 rounded-full hover:bg-chill-card text-white hover:text-chill-blue transition-colors border border-white/10">
                <Plus size={16} />
              </button>

              <button className="bg-chill-bg/90 p-1.5 rounded-full hover:bg-chill-card text-white hover:text-chill-rose transition-colors border border-white/10">
                <Heart size={16} />
              </button>
            </div>

            {/* Bottom: Quick Action */}
            <div className="flex flex-col gap-2">
              <Link to={`/book/${bookId}`} className="w-full bg-chill-sage py-2 rounded-lg text-xs font-bold text-black hover:bg-chill-sand flex items-center justify-center gap-2 shadow-lg transition-colors">
                <ShoppingBag size={14} /> View Details
              </Link>
            </div>
        </div>
      </div>

      {/* Book Metadata */}
      <div className="flex-1">
        <h3 className="font-bold text-white text-sm line-clamp-2 group-hover:text-chill-sage transition-colors mb-1 min-h-[2.5rem]">
          {bookTitle}
        </h3>
        <p className="text-xs text-gray-400 mb-1 line-clamp-1">{bookAuthor}</p>
        
        <StarRating rating={parseFloat(rating)} />
      </div>
    </div>
  );
};

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
        <h2 className="text-xl font-bold text-white mb-4">{title}</h2>
        <div className="flex gap-4 overflow-x-auto hide-scrollbar">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex-none w-[140px] animate-pulse">
              <div className="aspect-[2/3] bg-chill-highlight border border-white/5 rounded-xl mb-3"></div>
              <div className="h-4 bg-chill-highlight rounded mb-1"></div>
              <div className="h-3 bg-chill-highlight rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!books || books.length === 0) {
    return (
      <div className="mb-10">
        <h2 className="text-xl font-bold text-white mb-4">{title}</h2>
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
        <h2 className="text-xl font-bold text-white">{title}</h2>
        
        {categories && (
          <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar z-20 relative">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => onCategoryChange(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                  activeCategory === cat 
                    ? 'bg-chill-sage text-black shadow-lg shadow-chill-sage/20' 
                    : 'bg-chill-card border border-white/10 text-gray-400 hover:text-white hover:border-white/20'
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
          className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 z-10 w-10 h-10 bg-chill-card border border-white/10 shadow-lg rounded-full flex items-center justify-center text-white opacity-0 group-hover/section:opacity-100 transition-opacity hover:bg-chill-highlight hover:text-chill-sage hover:border-chill-sage/30"
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
          className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 z-10 w-10 h-10 bg-chill-card border border-white/10 shadow-lg rounded-full flex items-center justify-center text-white opacity-0 group-hover/section:opacity-100 transition-opacity hover:bg-chill-highlight hover:text-chill-sage hover:border-chill-sage/30"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default HorizontalCarousel;