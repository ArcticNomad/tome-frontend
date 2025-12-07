import React from 'react';
import { Search, X, Filter, Grid, List, Loader2 } from 'lucide-react';

const LibraryControls = ({
  searchQuery,
  setSearchQuery,
  showFilters,
  setShowFilters,
  selectedGenres,
  sortBy,
  viewMode,
  setViewMode,
  handleRefresh,
  loading
}) => {
  return (
    <div className="flex flex-col lg:flex-row gap-4 mb-8">
      {/* Search Bar */}
      <div className="flex-1 relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search in your library..."
          className="w-full pl-12 pr-10 py-3 bg-chill-card border border-white/5 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-chill-sage/50 transition-colors"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2 ${
            showFilters || selectedGenres.length > 0 || sortBy !== 'recently-added'
              ? 'bg-chill-sage/20 text-chill-sage border border-chill-sage/30'
              : 'bg-chill-card border border-white/5 text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Filter size={16} />
          Filters
          {(selectedGenres.length > 0 || sortBy !== 'recently-added') && (
            <span className="w-2 h-2 bg-chill-sage rounded-full"></span>
          )}
        </button>
        
        <div className="flex items-center gap-1 bg-chill-card border border-white/5 rounded-xl p-1">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'grid'
                ? 'bg-chill-sage/20 text-chill-sage'
                : 'text-gray-400 hover:text-white'
            }`}
            title="Grid view"
          >
            <Grid size={18} />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'list'
                ? 'bg-chill-sage/20 text-chill-sage'
                : 'text-gray-400 hover:text-white'
            }`}
            title="List view"
          >
            <List size={18} />
          </button>
        </div>
        
        <button
          onClick={handleRefresh}
          disabled={loading}
          className="p-3 bg-chill-card border border-white/5 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
          title="Refresh library"
        >
          {loading ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            '↻'
          )}
        </button>
      </div>
    </div>
  );
};

export default LibraryControls;