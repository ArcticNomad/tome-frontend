import React from 'react';
import { X, Filter, ArrowUpDown } from 'lucide-react';

const FilterDrawer = ({
  isOpen,
  onClose,
  availableGenres,
  category,
  handleGenreChange,
  sortOptions,
  sortBy,
  setSortBy,
  toggleSortOrder,
  sortOrder,
  authorFilter,
  setAuthorFilter,
  clearFilters,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 md:hidden">
      <div className="fixed left-0 top-0 h-full w-full max-w-xs bg-chill-bg-darker border-r border-white/10 shadow-2xl flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-white/5">
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-chill-sage" />
            <h2 className="font-bold text-lg text-white">Filters & Sort</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {/* Sort Options */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Sort By</h3>
            <div className="flex items-center gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-2.5 bg-chill-surface border border-white/5 rounded-xl text-sm text-white focus:outline-none focus:border-chill-sage/50 transition-colors"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <button
                onClick={toggleSortOrder}
                className="p-3 bg-chill-surface border border-white/5 rounded-xl hover:bg-white/5 transition-colors"
                title={sortOrder === 'asc' ? 'Ascending' : 'Descending'}
              >
                <ArrowUpDown size={18} className={sortOrder === 'asc' ? 'text-chill-sage' : 'text-gray-400'} />
              </button>
            </div>
          </div>

          {/* Author Filter */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Filter by Author</h3>
            <input
              type="text"
              value={authorFilter}
              onChange={(e) => setAuthorFilter(e.target.value)}
              placeholder="e.g., Jane Austen"
              className="w-full px-4 py-2.5 bg-chill-surface border border-white/5 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-chill-sage/50 transition-colors"
            />
          </div>

          {/* Genre Filter */}
          <div>
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Genre</h3>
            <div className="flex flex-wrap gap-2">
              {availableGenres.map(genre => {
                const isActive = category === genre || (genre === 'All Books' && !category);
                return (
                  <button
                    key={genre}
                    onClick={() => {
                      handleGenreChange(genre);
                      onClose();
                    }}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-chill-sage text-chill-bg shadow-md'
                        : 'bg-chill-surface border border-white/5 text-gray-300 hover:bg-white/10'
                    }`}
                  >
                    {genre}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-white/5">
          <button
            onClick={() => {
              clearFilters();
              onClose();
            }}
            className="w-full text-center py-3 bg-red-500/10 text-red-400 rounded-xl hover:bg-red-500/20 transition-colors text-sm font-medium"
          >
            Clear All Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterDrawer;