import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Star, Heart, Bookmark, Plus, Check, ShoppingBag, Download } from 'lucide-react';

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
  const downloadCount = book.downloadCount || 0;
  const rating = Math.min(5, 3 + (downloadCount / 10000) * 2).toFixed(1);

  return (
    <div 
      className="flex flex-col group relative cursor-pointer hover:border-chill-sage/30 rounded-2xl p-2 transition-all duration-300 border border-transparent"
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
              <Link to={`/book/${book.id}`} className="w-full bg-chill-sage py-2 rounded-lg text-xs font-bold text-black hover:bg-chill-sand flex items-center justify-center gap-2 shadow-lg transition-colors">
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

// --- Skeleton Loader ---
const BookSkeleton = () => (
  <div className="animate-pulse">
    <div className="bg-chill-highlight aspect-[2/3] rounded-xl mb-2 border border-white/5"></div>
    <div className="h-4 bg-chill-highlight rounded w-3/4 mb-1"></div>
    <div className="h-3 bg-chill-highlight rounded w-1/2"></div>
  </div>
);

// --- Main BookSection Component ---

const BookSection = ({ title, books = [], isLoading = false, showViewAll = true, compact = false }) => {
  const gridClass = compact 
    ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-6"
    : "grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-x-4 gap-y-8";

  // Convert section title to category query param
  const category = title ? title.toLowerCase().split(" ")[0] : "all";

  return (
    <section className="mb-10">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          {title}
          <span className="text-xs font-normal text-gray-400 bg-chill-highlight px-2 py-0.5 rounded-full border border-white/5">
            {books.length}
          </span>
        </h2>

        {showViewAll && books.length > 0 && (
          <Link
            to={`/booklists?category=${category}`}
            className="text-sm font-medium text-chill-sage hover:text-chill-sand flex items-center gap-1 transition-colors"
          >
            View all <ChevronRight size={16} />
          </Link>
        )}
      </div>

      {/* Grid */}
      <div className={gridClass}>
        {isLoading
          ? [...Array(compact ? 4 : 6)].map((_, i) => <BookSkeleton key={i} />)
          : books.map((book, i) => (
              <BookCard
                key={book.gutenbergId || book._id || `book-${i}`}
                book={book}
              />
            ))
        }
      </div>

      {/* Empty State */}
      {!isLoading && books.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>No books found</p>
        </div>
      )}
    </section>
  );
};

export default BookSection;