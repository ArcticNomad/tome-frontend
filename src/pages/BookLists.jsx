// frontend/src/pages/BookLists.jsx - UPDATED VERSION
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Filter, BookOpen, Layers, Sparkles, Frown, 
  ChevronLeft, ChevronRight, Loader2, Search, 
  ArrowUpDown, X, Brain, Zap, Hash, Check
} from 'lucide-react';
import BookCard from '../components/HomePage/BookCard';
import { usePaginatedBooks } from '../hooks/usePaginatedBooks';
import { useHybridSearch } from '../hooks/useHybridSearch'; // Changed from useSemanticSearch

const BookLists = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const category = searchParams.get('category') || 'All Books';
  const searchQuery = searchParams.get('search') || '';
  
  
  const [currentPage, setCurrentPage] = useState(1);
  const [searchInput, setSearchInput] = useState(searchQuery);
  const [sortBy, setSortBy] = useState('downloadCount');
  const [sortOrder, setSortOrder] = useState('desc');
  const [authorFilter, setAuthorFilter] = useState('');
  const [searchMode, setSearchMode] = useState('hybrid'); // Changed default to 'hybrid'
  const searchTimeoutRef = useRef(null);

  
  
  // Use hybrid search when there's a search query
  const {
    books: searchBooks,
    loading: searchLoading,
    error: searchError,
    pagination: searchPagination,
    searchType,
    loadMore: searchLoadMore,
    goToPage: searchGoToPage,
    refresh: searchRefresh,
    hasMore: searchHasMore
  } = useHybridSearch(searchQuery, {
    page: currentPage,
    limit: 24,
    searchMode,
    autoFetch: !!searchQuery
  });
  

  // Use regular paginated books for category browsing
  const {
    books: categoryBooks,
    loading: categoryLoading,
    error: categoryError,
    pagination: categoryPagination,
    loadMore: categoryLoadMore,
    goToPage: categoryGoToPage,
    refresh: categoryRefresh,
    hasMore: categoryHasMore
  } = usePaginatedBooks(category, {
    page: currentPage,
    limit: 24,
    search: searchQuery ? '' : undefined,
    author: authorFilter,
    sortBy,
    sortOrder,
    autoFetch: !searchQuery
  });

  // Determine which data to use
  const isSearching = !!searchQuery;
  const books = isSearching ? searchBooks : categoryBooks;
  const loading = isSearching ? searchLoading : categoryLoading;
  const error = isSearching ? searchError : categoryError;
  const pagination = isSearching ? searchPagination : categoryPagination;
  const loadMore = isSearching ? searchLoadMore : categoryLoadMore;
  const goToPage = isSearching ? searchGoToPage : categoryGoToPage;
  const refresh = isSearching ? searchRefresh : categoryRefresh;
  const hasMore = isSearching ? searchHasMore : categoryHasMore;

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
    window.scrollTo(0, 0);
  }, [category, searchQuery, authorFilter, sortBy, sortOrder, searchMode]);

  const availableGenres = [
    'All Books', 'Fiction', 'Science Fiction', 'Fantasy', 'Mystery', 
    'Romance', 'History', 'Biography', 'Science', 'Philosophy', 
    'Adventure', 'Horror'
  ];

  const sortOptions = [
    { value: 'downloadCount', label: 'Most Popular' },
    { value: 'issuedDate', label: 'Recently Added' },
    { value: 'title', label: 'Title (A-Z)' },
  ];

 const searchModes = [
  { 
    value: 'hybrid', 
    label: 'Hybrid AI Search', 
    icon: Brain, 
    description: 'Combines AI semantic understanding with keyword matching' 
  },
  { 
    value: 'simple', 
    label: 'Keyword Search', 
    icon: Hash, 
    description: 'Fast traditional keyword search in titles and authors' 
  },
  // Note: 'quick' mode is not included here as it's for autocomplete only
  {
  value: 'quick',
  label: 'Instant Search',
  icon: Zap,
  description: 'Ultra-fast title/author autocomplete'
}
];

  const handleGenreChange = (genre) => {
    if (genre === 'All Books') {
      navigate('/booklists');
    } else {
      navigate(`/booklists?category=${encodeURIComponent(genre)}`);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      navigate(`/booklists?search=${encodeURIComponent(searchInput.trim())}`);
    } else {
      navigate('/booklists');
    }
  };

  const handleSearchChange = (value) => {
    setSearchInput(value);
    
    // Debounced search
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    if (value.trim()) {
      searchTimeoutRef.current = setTimeout(() => {
        navigate(`/booklists?search=${encodeURIComponent(value.trim())}`);
      }, 500);
    } else {
      searchTimeoutRef.current = setTimeout(() => {
        navigate('/booklists');
      }, 300);
    }
  };

  const clearFilters = () => {
    setSearchInput('');
    setAuthorFilter('');
    setSortBy('downloadCount');
    setSortOrder('desc');
    setSearchMode('hybrid');
    navigate('/booklists');
  };

const handlePageChange = (pageNumber) => {
  setCurrentPage(pageNumber);
  // Let the hook handle it via ref – no stale value
  goToPage(pageNumber);
  window.scrollTo(0, 0);
};
  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  return (
    <div className="min-h-screen bg-chill-bg text-gray-200 pb-12 pt-8">
      <div className="container mx-auto px-4 sm:px-6">
        
        {/* --- Header Section --- */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 border-b border-white/5 pb-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-chill-sage/10 text-chill-sage p-2 rounded-lg backdrop-blur-sm">
                <Layers size={20} />
              </span>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                Browse Collection
              </span>
            </div>
           <div className="flex flex-col gap-3">
  {/* Main Title */}
  <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
    {searchQuery ? 'Search Results' : category}
    {category !== 'All Books' && !searchQuery && (
      <Sparkles className="inline-block ml-3 text-chill-sage w-7 h-7 animate-pulse" />
    )}
  </h1>

  {/* Search Query + Mode Badge */}
  {searchQuery && (
    <div className="flex flex-wrap items-center gap-3">
      {/* Query Pill */}
      <div className="inline-flex items-center gap-2 bg-chill-surface/80 backdrop-blur-sm border border-white/10 rounded-2xl px-5 py-3 max-w-full">
        <Search size={18} className="text-chill-sage flex-shrink-0" />
        <span className="text-white font-medium text-lg truncate max-w-md">
          "{searchQuery}"
        </span>
        <button
          onClick={() => {
            setSearchInput('');
            navigate('/booklists');
          }}
          className="ml-2 text-gray-400 hover:text-white transition-colors flex-shrink-0"
        >
          <X size={16} />
        </button>
      </div>

      {/* Search Mode Badge */}
      {searchType && (
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider border backdrop-blur-sm
          ${searchType === 'hybrid' || searchType === 'semantic'
            ? 'bg-chill-blue/20 text-chill-blue border-chill-blue/40'
            : 'bg-chill-lavender/20 text-chill-lavender border-chill-lavender/40'
          }`}
        >
          {searchType === 'hybrid' || searchType === 'semantic' ? (
            <>
              <Brain size={13} />
              AI Search
            </>
          ) : (
            <>
              <Zap size={13} />
              Quick Search
            </>
          )}
        </span>
      )}
    </div>
  )}
</div>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-chill-sage bg-chill-surface border border-white/5 px-4 py-2 rounded-full shadow-sm">
              {loading && currentPage === 1
  ? 'Searching...'
  : pagination.totalBooks >= 10000
    ? '10,000+'
    : pagination.totalBooks > 100
      ? '100+'
      : pagination.totalBooks || books.length} books found
            </span>
            {pagination.totalPages > 1 && (
              <span className="text-xs text-gray-400">
                Page {currentPage} of {pagination.totalPages}
              </span>
            )}
          </div>
        </div>

        {/* --- Search Bar --- */}
      <div className="mb-10">
  <form onSubmit={handleSearch} className="relative">
    <div className="relative flex items-stretch gap-0 max-w-4xl mx-auto">
      {/* Search Input */}
      <div className="relative flex-1">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={22} />
        <input
          type="text"
          value={searchInput}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder="Search by title, author, vibe, or meaning... (e.g., 'sad robot love story')"
          className="w-full pl-14 pr-4 py-4 bg-chill-surface/90 backdrop-blur-xl border border-white/10 rounded-l-2xl text-white placeholder-gray-400 focus:outline-none focus:border-chill-sage/60 transition-all duration-300 shadow-xl"
        />
        {/* Clear Button */}
        {searchInput && (
          <button
            type="button"
            onClick={() => {
              setSearchInput('');
              navigate('/booklists');
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition"
          >
            <X size={20} />
          </button>
        )}
      </div>

      {/* Search Button */}
      <button
        type="submit"
        className="px-8 bg-chill-sage text-black font-bold rounded-r-2xl hover:bg-chill-sand transition-all duration-300 shadow-glow-sage flex items-center gap-2 group"
      >
        <Search size={20} className="group-hover:scale-110 transition" />
        <span className="hidden sm:inline">Search</span>
      </button>
    </div>

    {/* Search Mode Toggle - Only when searching */}
    {searchQuery && (
      <div className="mt-5 flex justify-center gap-3 flex-wrap">
        <span className="text-sm text-gray-400 flex items-center gap-2">
          <Zap size={15} />
          Search Mode:
        </span>
        {searchModes.map((mode) => {
          const Icon = mode.icon;
          const active = searchMode === mode.value;
          return (
            <button
              key={mode.value}
              onClick={() => setSearchMode(mode.value)}
              className={`
                px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-2
                ${active
                  ? mode.value === 'hybrid'
                    ? 'bg-chill-blue/30 text-chill-blue border border-chill-blue/50 shadow-glow-blue'
                    : 'bg-chill-lavender/30 text-chill-lavender border border-chill-lavender/50 shadow-glow-lavender'
                  : 'bg-chill-surface/50 border border-white/10 text-gray-400 hover:text-white hover:bg-white/5'
                }
              `}
              title={mode.description}
            >
              <Icon size={14} />
              {mode.label}
              {active && <Check size={14} className="ml-1" />}
            </button>
          );
        })}
      </div>
    )}
  </form>
</div>

        {/* --- Filters and Sorting --- */}
        {!searchQuery && (
          <div className="mb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-400 font-medium">
                <Filter size={14} />
                <span>Filter & Sort</span>
                {(authorFilter || sortBy !== 'downloadCount') && (
                  <button
                    onClick={clearFilters}
                    className="ml-2 text-xs text-gray-500 hover:text-white flex items-center gap-1"
                  >
                    <X size={12} /> Clear filters
                  </button>
                )}
              </div>
              
              <div className="flex flex-wrap gap-3">
                {/* Author Filter */}
                <input
                  type="text"
                  value={authorFilter}
                  onChange={(e) => setAuthorFilter(e.target.value)}
                  placeholder="Filter by author..."
                  className="px-4 py-2 bg-chill-surface border border-white/5 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-chill-sage/50 transition-colors"
                />
                
                {/* Sort Dropdown */}
                <div className="flex items-center gap-2">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-2 bg-chill-surface border border-white/5 rounded-xl text-sm text-white focus:outline-none focus:border-chill-sage/50 transition-colors"
                  >
                    {sortOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  
                  <button
                    onClick={toggleSortOrder}
                    className="p-2 bg-chill-surface border border-white/5 rounded-xl hover:bg-white/5 transition-colors"
                    title={sortOrder === 'asc' ? 'Ascending' : 'Descending'}
                  >
                    <ArrowUpDown size={16} className={sortOrder === 'asc' ? 'text-chill-sage' : 'text-gray-400'} />
                  </button>
                </div>
              </div>
            </div>
            
            {/* Genre Filter Chips */}
            <div className="flex flex-wrap gap-3">
              {availableGenres.map(genre => {
                const isActive = category === genre || (genre === 'All Books' && !category);
                return (
                  <button
                    key={genre}
                    onClick={() => handleGenreChange(genre)}
                    className={`
                      px-5 py-2.5 rounded-2xl text-sm font-medium transition-all duration-300 ease-out
                      border
                      ${isActive 
                        ? 'bg-chill-sage text-chill-bg border-chill-sage shadow-glow-sage font-bold scale-105' 
                        : 'bg-chill-surface border-white/5 text-gray-400 hover:text-white hover:bg-chill-highlight hover:border-white/10'
                      }
                    `}
                  >
                    {genre}
                </button>
                );
              })}
            </div>
          </div>
        )}

        {/* --- Content Area --- */}
        <div className="min-h-[400px]">
          
          {/* Loading State - Initial load */}
          {loading && currentPage === 1 && (
            <div className="flex flex-col justify-center items-center py-24 gap-4">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-chill-surface border-t-chill-sage"></div>
              <p className="text-gray-500 animate-pulse text-sm tracking-wide">
                {searchQuery 
                  ? `🔍 Searching for "${searchQuery}"...`
                  : 'Fetching library data...'
                }
              </p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-8 text-center max-w-lg mx-auto mt-8 backdrop-blur-sm">
              <Frown className="w-10 h-10 text-red-400 mx-auto mb-3" />
              <p className="text-white font-medium mb-1">Unable to load books</p>
              <p className="text-sm text-red-300/70 mb-4">{error}</p>
              <button 
                onClick={refresh}
                className="text-white bg-red-500/20 hover:bg-red-500/30 px-6 py-2 rounded-xl text-sm transition-colors border border-red-500/20"
              >
                Retry
              </button>
            </div>
          )}

          {/* Book Grid */}
          {!loading && !error && (
            <>
              {books.length === 0 ? (
                // Empty State
                <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-white/5 rounded-3xl bg-chill-surface/30">
                  <div className="bg-chill-highlight p-5 rounded-full mb-4">
                    {searchQuery ? (
                      <Search size={32} className="text-gray-500" />
                    ) : (
                      <BookOpen size={32} className="text-gray-500" />
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">No books found</h3>
                  <p className="text-gray-500 mb-6 max-w-sm">
                    {searchQuery 
                      ? `No books found for "${searchQuery}"`
                      : `No books found in the "${category}" category.`
                    }
                  </p>
                  {searchQuery && (
                    <div className="mb-4 p-3 bg-chill-surface/50 rounded-lg border border-white/5">
                      <p className="text-sm text-gray-400 mb-2">Try:</p>
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => {
                            if (searchMode === 'hybrid') {
                              setSearchMode('quick');
                              searchRefresh();
                            }
                          }}
                          className="px-3 py-1 text-xs bg-chill-surface border border-white/5 rounded hover:bg-white/5"
                        >
                          Switch to quick search
                        </button>
                        <button
                          onClick={clearFilters}
                          className="px-3 py-1 text-xs bg-chill-sage/10 text-chill-sage border border-chill-sage/20 rounded hover:bg-chill-sage/20"
                        >
                          Clear search
                        </button>
                      </div>
                    </div>
                  )}
                  <button 
                    onClick={clearFilters}
                    className="px-6 py-2.5 bg-chill-sage text-chill-bg font-bold rounded-xl hover:bg-[#c5d38a] transition-colors shadow-lg shadow-chill-sage/10"
                  >
                    {searchQuery ? 'Clear Search' : 'View All Books'}
                  </button>
                </div>
              ) : (
                <>
                  {/* Search Info Banner */}
                  {searchQuery && (
                    <div className="mb-6 p-4 bg-gradient-to-r from-chill-blue/10 to-chill-lavender/5 rounded-xl border border-white/5">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            {searchType === 'hybrid' || searchType === 'semantic' ? (
                              <>
                                <Brain size={16} className="text-chill-blue" />
                                <span className="text-sm font-medium text-chill-blue">Hybrid AI Search</span>
                              </>
                            ) : (
                              <>
                                <Zap size={16} className="text-chill-lavender" />
                                <span className="text-sm font-medium text-chill-lavender">Quick Search</span>
                              </>
                            )}
                          </div>
                          <p className="text-xs text-gray-400">
                            Found {pagination.totalBooks} books matching "{searchQuery}"
                            {searchType === 'hybrid' && ' using AI semantic understanding'}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">
                            Mode: {searchMode === 'hybrid' ? 'AI+Keyword' : 'Quick'}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Active Filters Display */}
                  {(authorFilter || sortBy !== 'downloadCount') && !searchQuery && (
                    <div className="mb-6 flex flex-wrap gap-2">
                      {authorFilter && (
                        <span className="px-3 py-1 bg-chill-lavender/10 text-chill-lavender text-xs rounded-full border border-chill-lavender/20">
                          Author: "{authorFilter}"
                        </span>
                      )}
                      {sortBy !== 'downloadCount' && (
                        <span className="px-3 py-1 bg-chill-sage/10 text-chill-sage text-xs rounded-full border border-chill-sage/20">
                          Sorted by: {sortOptions.find(o => o.value === sortBy)?.label}
                        </span>
                      )}
                    </div>
                  )}

                  {/* The Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-8">
                    {books.map((book, index) => (
                      <BookCard key={`${book.gutenbergId || book._id}-${index}`} book={book} />
                    ))}
                  </div>

                  {/* Pagination Controls */}
                  <div className="mt-16 flex flex-col items-center gap-6">
                    
                    {/* Load More Button */}
                    {hasMore && (
                      <button
                        onClick={loadMore}
                        disabled={loading}
                        className="px-8 py-3 bg-chill-sage/10 hover:bg-chill-sage/20 text-chill-sage font-medium rounded-xl border border-chill-sage/30 transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Loading...
                          </>
                        ) : (
                          <>
                            Load More Books ({pagination.totalBooks - books.length} more)
                            <ChevronRight size={16} />
                          </>
                        )}
                      </button>
                    )}

                    {/* Page Info */}
                    <p className="text-sm text-gray-500">
                      Showing <span className="text-white font-medium">{
                        (currentPage - 1) * pagination.limit + 1
                      }</span> to <span className="text-white font-medium">{
                        Math.min(currentPage * pagination.limit, pagination.totalBooks)
                      }</span> of {pagination.totalBooks} results
                    </p>

                    {/* Page Navigation */}
                    {pagination.totalPages > 1 && (
                      <div className="flex items-center gap-2 bg-chill-surface p-1.5 rounded-2xl border border-white/5 shadow-lg">
                        <button
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                          className={`
                            p-2.5 rounded-xl transition-all duration-200 flex items-center gap-2
                            ${currentPage === 1 
                              ? 'text-gray-600 cursor-not-allowed' 
                              : 'text-white hover:bg-white/10 hover:text-chill-sage active:scale-95'
                            }
                          `}
                        >
                          <ChevronLeft size={20} />
                          <span className="hidden sm:inline text-sm font-medium">Prev</span>
                        </button>

                        <div className="px-4 py-2 bg-chill-bg rounded-xl border border-white/5 text-sm font-mono text-chill-sage">
                          {currentPage} <span className="text-gray-600">/</span> {pagination.totalPages}
                        </div>

                        <button
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === pagination.totalPages}
                          className={`
                            p-2.5 rounded-xl transition-all duration-200 flex items-center gap-2
                            ${currentPage === pagination.totalPages 
                              ? 'text-gray-600 cursor-not-allowed' 
                              : 'text-white hover:bg-white/10 hover:text-chill-sage active:scale-95'
                            }
                          `}
                        >
                          <span className="hidden sm:inline text-sm font-medium">Next</span>
                          <ChevronRight size={20} />
                        </button>
                      </div>
                    )}

                    {/* Showing info when all books loaded */}
                    {!hasMore && currentPage > 1 && (
                      <div className="mt-8 text-center py-4 border-t border-white/5">
                        <p className="text-sm text-gray-500">
                          🎉 You've reached the end! Showing all {pagination.totalBooks} books.
                        </p>
                      </div>
                    )}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookLists;