// src/components/BookSection.jsx
import React, { useState } from 'react';
import { Heart, Star, ShoppingBag, ChevronRight } from 'lucide-react';

// --- Sub-Component: Star Rating Helper ---
const StarRating = ({ rating }) => {
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
      <span className="text-[10px] text-gray-400 ml-1">(42)</span>
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

  // Mock random rating for demo (in real app, this comes from DB)
  const rating = book.rating || 4.5; 

  return (
    <div className="flex flex-col group relative">
      
      {/* Cover Image Container */}
      <div className="relative rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 mb-2 aspect-[2/3]">
        
        <img 
          src={book.cover} 
          alt={book.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* 1. Status Badge (Conditional) */}
        {book.id % 3 === 0 && (
          <span className="absolute top-2 left-2 bg-yellow-400 text-yellow-900 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide">
            Best Seller
          </span>
        )}

        {/* 2. Hover Overlay Actions */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-3">
            
            {/* Top Right: Like Button */}
            <button 
              onClick={(e) => { e.stopPropagation(); setIsLiked(!isLiked); }}
              className="self-end bg-white/90 p-1.5 rounded-full hover:bg-white text-gray-700 hover:text-red-500 transition-colors"
            >
              <Heart size={16} fill={isLiked ? "currentColor" : "none"} className={isLiked ? "text-red-500" : ""} />
            </button>

            {/* Bottom: Quick Action Button */}
            <button className="w-full bg-white/90 py-2 rounded-lg text-xs font-bold text-gray-900 hover:bg-white flex items-center justify-center gap-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
               <ShoppingBag size={14} /> View Details
            </button>
        </div>
      </div>

      {/* Book Metadata */}
      <div>
        <h3 className="font-bold text-gray-800 text-sm line-clamp-1 group-hover:text-purple-600 transition-colors">
            {book.title}
        </h3>
        <p className="text-xs text-gray-500 mb-1">{book.author}</p>
        
        {/* 3. Star Ratings */}
        <StarRating rating={rating} />
      </div>
    </div>
  );
};

const BookSection = ({ title, books, isLoading = false }) => {
  return (
    <section className="mb-10">
      
      {/* 4. Enhanced Header with "View All" */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          {title}
          <span className="text-xs font-normal text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
             {books?.length || 0}
          </span>
        </h2>
        <a href="#" className="text-sm font-medium text-purple-600 hover:text-purple-800 flex items-center gap-1">
          View all <ChevronRight size={16} />
        </a>
      </div>

      {/* Grid with Loading State Support */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-x-4 gap-y-8">
        {isLoading 
          ? [...Array(6)].map((_, i) => <BookSkeleton key={i} />)
          : books.map((book) => <BookCard key={book.id} book={book} />)
        }
      </div>
    </section>
  );
};

export default BookSection;