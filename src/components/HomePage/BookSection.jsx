// src/components/HomePage/BookSection.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import BookCard from './BookCard';
import StarRating from './StarRating';

// --- Skeleton Loader ---
const BookSkeleton = () => (
  <div className="animate-pulse">
    <div className="bg-gray-200 aspect-[2/3] rounded-xl mb-2"></div>
    <div className="h-4 bg-gray-200 rounded w-3/4 mb-1"></div>
    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
  </div>
);

const BookSection = ({ title, books = [], isLoading = false, showViewAll = true, compact = false }) => {
  const gridClass = compact 
    ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-6"
    : "grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-x-4 gap-y-8";

  // Convert section title to category query param
  const category = title.toLowerCase().split(" ")[0];

  return (
    <section className="mb-10">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          {title}
          <span className="text-xs font-normal text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
            {books.length}
          </span>
        </h2>

        {showViewAll && books.length > 0 && (
          <Link
            to={`/booklists?category=${category}`}
            className="text-sm font-medium text-purple-600 hover:text-purple-800 flex items-center gap-1 transition-colors"
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
