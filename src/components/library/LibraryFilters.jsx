// frontend/src/components/library/LibraryFilters.jsx
import React from 'react';
import { SortAsc, CheckCircle, Heart, Loader2 } from 'lucide-react';

const LibraryFilters = ({
  showFilters,
  sortBy,
  setSortBy,
  sortOptions,
  selectedGenres,
  setSelectedGenres,
  allGenres,
  toggleGenre
}) => {
  if (!showFilters) return null;

  // Fixed list of genres like in GenreExplorer
  const FIXED_GENRES = [
    'Fiction', 'Science Fiction', 'Fantasy', 'Mystery', 'Thriller',
    'Romance', 'History', 'Biography', 'Science', 'Philosophy',
    'Adventure', 'Horror'
  ];

  return (
    <div className="bg-chill-card border border-white/5 rounded-2xl p-6 mb-8">
      <div className="flex flex-col gap-8">
        {/* Sort Options */}
        <div>
          <h3 className="font-bold text-white mb-3 flex items-center gap-2">
            <SortAsc size={16} />
            Sort By
          </h3>
          <div className="flex flex-wrap gap-2">
            {sortOptions.map(option => (
              <button
                key={option.id}
                onClick={() => setSortBy(option.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                  sortBy === option.id
                    ? 'bg-chill-sage text-black shadow-lg shadow-chill-sage/20'
                    : 'bg-chill-card border border-white/10 text-gray-400 hover:text-white hover:border-white/20'
                }`}
              >
                {option.label}
                {sortBy === option.id && <CheckCircle size={14} />}
              </button>
            ))}
          </div>
        </div>

        {/* Genres Filter - Now like GenreExplorer */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-white flex items-center gap-2">
              <Heart size={16} className="text-chill-rose" />
              Filter by Genres
            </h3>
            {selectedGenres.length > 0 && (
              <button
                onClick={() => setSelectedGenres([])}
                className="text-xs text-gray-400 hover:text-white"
              >
                Clear All
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2 justify-center">
            {FIXED_GENRES.map(genre => (
              <button
                key={genre}
                onClick={() => toggleGenre(genre)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                  selectedGenres.includes(genre)
                    ? 'bg-chill-blue text-black shadow-lg shadow-chill-blue/20'
                    : 'bg-chill-card border border-white/10 text-gray-400 hover:text-white hover:border-white/20'
                }`}
              >
                {genre}
                {selectedGenres.includes(genre) && (
                  <span className="text-xs ml-1">✓</span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LibraryFilters;