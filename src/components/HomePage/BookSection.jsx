// src/components/HomePage/BookSection.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import BookCard from './BookCard';

// --- Skeleton Loader ---
const BookSkeleton = () => (
  <div className="animate-pulse w-full">
    <div className="bg-gray-700 aspect-[2/3] rounded-lg mb-2"></div>
    <div className="h-3 bg-gray-700 rounded mb-1.5 w-3/4"></div>
    <div className="h-2.5 bg-gray-700 rounded w-1/2"></div>
  </div>
);

const BookSection = ({ title, books = [], isLoading = false, showViewAll = true, compact = false }) => {
  // Responsive grid classes - centered items
  const gridClass = compact 
    ? "grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-x-4 gap-y-6 justify-items-center"
    : "grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-x-4 gap-y-8 justify-items-center";

  // Convert section title to category query param
  const category = title.toLowerCase().split(" ")[0];

  return (
    <section className="mb-8 md:mb-10">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4 md:mb-6">
        <div className="flex items-center gap-3">
          <div className="w-1 h-6 bg-chill-sage rounded-full"></div>
          <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-white">
            {title}
          </h2>
        </div>

        {showViewAll && books.length > 0 && (
          <Link
            to={`/booklists?category=${category}`}
            className="text-xs md:text-sm font-medium text-chill-sage hover:text-white flex items-center gap-1 transition-colors whitespace-nowrap px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10"
          >
            <span>View all</span>
            <ChevronRight size={14} md:size={16} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        )}
      </div>

      {/* Grid - Centered with consistent sizing */}
      <div className={gridClass}>
        {isLoading
          ? [...Array(compact ? 6 : 8)].map((_, i) => (
              <div key={i} className="w-full max-w-[140px] md:max-w-[160px]">
                <BookSkeleton />
              </div>
            ))
          : books.map((book, i) => (
              <div 
                key={book.gutenbergId || book._id || `book-${i}`}
                className="w-full max-w-[140px] md:max-w-[160px] flex justify-center"
              >
                <BookCard book={book} />
              </div>
            ))
        }
      </div>

      {/* Empty State */}
      {!isLoading && books.length === 0 && (
        <div className="text-center py-8 md:py-12">
          <div className="inline-flex flex-col items-center gap-3 px-6 py-8 rounded-2xl bg-chill-card/50 border border-white/10 max-w-md">
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
              <ChevronRight className="w-6 h-6 text-gray-400 rotate-90" />
            </div>
            <p className="text-gray-400 text-sm md:text-base">No books found in this category</p>
            <Link
              to="/books"
              className="text-xs md:text-sm text-chill-sage hover:text-white font-medium hover:underline"
            >
              Browse all books
            </Link>
          </div>
        </div>
      )}
    </section>
  );
};

export default BookSection;