// src/components/HomePage/BookSection.jsx
import React, { useState } from 'react';
import { Heart, Star, ShoppingBag, ChevronRight, Download } from 'lucide-react';

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

// --- Main Card Component ---
const BookCard = ({ book }) => {
  const [isLiked, setIsLiked] = useState(false);

  // Handle MongoDB data structure
  const bookCover = book.coverImageUrl || '/placeholder-book.jpg';
  const bookTitle = book.title || 'Untitled';
  const bookAuthor = book.author || 'Unknown Author';
  const bookId = book.gutenbergId || book._id;
  const downloadCount = book.downloadCount || 0;
  
  // Generate rating based on download count for demo
  const rating = Math.min(5, 3 + (downloadCount / 10000) * 2).toFixed(1);

  return (
    <div className="flex flex-col group relative cursor-pointer">
      
      {/* Cover Image Container */}
      <div className="relative rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 mb-2 aspect-[2/3]">
        
        <img 
          src={bookCover} 
          alt={bookTitle} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.target.src = '/placeholder-book.jpg';
          }}
        />

        {/* Status Badge based on download count */}
        {downloadCount > 50000 && (
          <span className="absolute top-2 left-2 bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide">
            Popular
          </span>
        )}

        {/* Hover Overlay Actions */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-3">
            
            {/* Top Right: Like Button */}
            <button 
              onClick={(e) => { e.stopPropagation(); setIsLiked(!isLiked); }}
              className="self-end bg-white/90 p-1.5 rounded-full hover:bg-white text-gray-700 hover:text-red-500 transition-colors"
            >
              <Heart size={16} fill={isLiked ? "currentColor" : "none"} className={isLiked ? "text-red-500" : ""} />
            </button>

            {/* Bottom: Quick Action Button */}
            <div className="flex flex-col gap-2">
              <button className="w-full bg-white/90 py-2 rounded-lg text-xs font-bold text-gray-900 hover:bg-white flex items-center justify-center gap-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                 <ShoppingBag size={14} /> View Details
              </button>
              
              {/* Download count */}
              {downloadCount > 0 && (
                <div className="flex items-center justify-center gap-1 text-white text-xs bg-black/50 rounded px-2 py-1">
                  <Download size={10} />
                  <span>{downloadCount.toLocaleString()} downloads</span>
                </div>
              )}
            </div>
        </div>
      </div>

      {/* Book Metadata */}
      <div className="flex-1">
        <h3 className="font-bold text-gray-800 text-sm line-clamp-2 group-hover:text-purple-600 transition-colors mb-1 min-h-[2.5rem]">
            {bookTitle}
        </h3>
        <p className="text-xs text-gray-500 mb-1 line-clamp-1">{bookAuthor}</p>
        
        {/* Star Ratings */}
        <StarRating rating={parseFloat(rating)} />
        
        {/* Subjects/Tags */}
        {book.subjects && book.subjects.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {book.subjects.slice(0, 2).map((subject, index) => (
              <span key={index} className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
                {subject.split(' -- ')[0]}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

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