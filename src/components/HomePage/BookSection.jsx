// src/components/HomePage/BookSection.jsx
import React, { useState } from 'react';
import { Heart, Star, ShoppingBag, ChevronRight, Download } from 'lucide-react';
import BookCard from './BookCard';
// --- Sub-Component: Star Rating Helper ---
const StarRating = ({ rating, reviewCount = 42 }) => {
  return (
    <div className="flex items-center gap-0.5 text-yellow-400 mb-1">
      {[...Array(5)].map((_, i) => (
        <Star 
          key={i} 
          size={12} 
          fill={i < Math.floor(rating) ? "currentColor" : "none"} 
          className={i < Math.floor(rating) ? "" : "text-gray-300"}
        />
      ))}
      <span className="text-[10px] text-gray-400 ml-1">({reviewCount})</span>
    </div>
  );
};

// --- Sub-Component: Loading Skeleton ---
const BookSkeleton = () => (
  <div className="animate-pulse">
    <div className="bg-gray-200 aspect-[2/3] rounded-xl mb-2"></div>
    <div className="h-4 bg-gray-200 rounded w-3/4 mb-1"></div>
    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
  </div>
);

<BookCard />;

const BookSection = ({ title, books, isLoading = false, showViewAll = true, compact = false }) => {
  const displayBooks = books || [];
  const gridClass = compact 
    ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-6"
    : "grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-x-4 gap-y-8";

  return (
    <section className="mb-10">
      
      {/* Enhanced Header with "View All" */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          {title}
          <span className="text-xs font-normal text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
             {displayBooks.length}
          </span>
        </h2>
        {showViewAll && displayBooks.length > 0 && (
          <a href="#" className="text-sm font-medium text-purple-600 hover:text-purple-800 flex items-center gap-1 transition-colors">
            View all <ChevronRight size={16} />
          </a>
        )}
      </div>

      {/* Grid with Loading State Support */}
      <div className={gridClass}>
        {isLoading 
          ? [...Array(compact ? 4 : 6)].map((_, i) => <BookSkeleton key={i} />)
          : displayBooks.map((book, index) => (
              <BookCard key={book.gutenbergId || book._id || `book-${index}`} book={book} />
            ))
        }
      </div>

      {/* Empty State */}
      {!isLoading && displayBooks.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>No books found</p>
        </div>
      )}
    </section>
  );
};

export default BookSection;