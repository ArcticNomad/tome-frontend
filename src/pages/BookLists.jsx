import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import BookCard from '../components/HomePage/BookCard';
import UserAndTags from '../components/HomePage/UserAndTags';
import TagsBar from '../components/HomePage/TagsBar';
import { useBookData } from '../hooks/useBookData';

const BookLists = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const category = searchParams.get('category') || 'All Books';

  const { books, loading, error } = useBookData(category);

  // Available genres for the filter chips
  const availableGenres = [
    'All Books', 'Fiction', 'Science Fiction', 'Fantasy', 'Mystery', 
    'Romance', 'History', 'Biography', 'Science', 'Philosophy', 
    'Adventure', 'Horror'
  ];

  // Handle genre filter change
  const handleGenreChange = (genre) => {
    if (genre === 'All Books') {
      navigate('/booklists');
    } else {
      navigate(`/booklists?category=${encodeURIComponent(genre)}`);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Heading */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold capitalize">
          {category} Books
        </h1>
        <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
          {books.length} books
        </span>
      </div>

      {/* Genre Filter Chips */}
      <div className="flex flex-wrap gap-2 mb-6">
        {availableGenres.map(genre => (
          <button
            key={genre}
            onClick={() => handleGenreChange(genre)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              category === genre || (genre === 'All Books' && !category)
                ? 'bg-blue-600 text-white shadow-md' 
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            {genre}
          </button>
        ))}
      </div>

      {/* Tags Filter Bar - Optional, you can remove if not needed */}
      {/* <TagsBar /> */}

      {/* Loading and Error States */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-center">
          <p>Error loading books: {error}</p>
        </div>
      )}

      {/* Book Grid */}
      {!loading && !error && (
        <>
          {books.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No books found for "{category}" category.</p>
              <button 
                onClick={() => navigate('/booklists')}
                className="mt-4 text-blue-600 hover:text-blue-800 font-medium"
              >
                View all books
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {books.map((book) => (
                <BookCard key={book.gutenbergId || book.id} book={book} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default BookLists;