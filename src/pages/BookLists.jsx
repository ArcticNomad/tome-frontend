// frontend/src/pages/BookLists.jsx - RESPONSIVE MOBILE VERSION
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Filter, BookOpen, Layers, Sparkles, Frown, 
  ChevronLeft, ChevronRight, Loader2, Search, 
  ArrowUpDown, X, Brain, Zap, Hash, Check,
  Menu, Grid, List
} from 'lucide-react';
import BookCard from '../components/HomePage/BookCard';
import { usePaginatedBooks } from '../hooks/usePaginatedBooks';
import { useHybridSearch } from '../hooks/useHybridSearch';

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
  const [searchMode, setSearchMode] = useState('hybrid');
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  
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
      label: 'AI Search', 
      icon: Brain, 
      description: 'Combines AI semantic understanding with keyword matching' 
    },
    { 
      value: 'simple', 
      label: 'Keyword', 
      icon: Hash, 
      description: 'Fast traditional keyword search' 
    },
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
    setIsFiltersOpen(false);
    navigate('/booklists');
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    goToPage(pageNumber);
    window.scrollTo(0, 0);
  };

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  // Responsive grid classes
  const gridClass = viewMode === 'grid' 
    ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4"
    : "flex flex-col gap-3 md:gap-4";

  // Mobile view mode switcher
  const ViewModeToggle = () => (
    <div className="flex items-center bg-chill-surface border border-white/5 rounded-xl p-1">
      <button
        onClick={() => setViewMode('grid')}
        className={`p-1.5 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'}`}
      >
        <Grid size={18} />
      </button>
      <button
        onClick={() => setViewMode('list')}
        className={`p-1.5 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'}`}
      >
        <List size={18} />
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-chill-bg text-gray-200 pb-12 pt-4 md:pt-8">
      <div className="container mx-auto px-3 sm:px-4 md:px-6">
        
        {/* --- Header Section --- */}
        <div className="flex flex-col gap-4 md:gap-6 mb-6 md:mb-10 border-b border-white/5 pb-6 md:pb-8">
          <div>
            <div className="flex items-center gap-2 mb-2 md:mb-3">
              <span className="bg-chill-sage/10 text-chill-sage p-1.5 md:p-2 rounded-lg backdrop-blur-sm">
                <Layers size={16} md:size={20} />
              </span>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                Browse Collection
              </span>
            </div>
            
            <div className="flex flex-col gap-2 md:gap-3">
              {/* Main Title */}
              <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white tracking-tight">
                {searchQuery ? 'Search Results' : category}
                {category !== 'All Books' && !searchQuery && (
                  <Sparkles className="inline-block ml-2 md:ml-3 text-chill-sage w-5 h-5 md:w-7 md:h-7 animate-pulse" />
                )}
              </h1>

              {/* Search Query + Mode Badge */}
              {searchQuery && (
                <div className="flex flex-wrap items-center gap-2">
                  {/* Query Pill */}
                  <div className="inline-flex items-center gap-2 bg-chill-surface/80 backdrop-blur-sm border border-white/10 rounded-xl md:rounded-2xl px-3 py-2 md:px-5 md:py-3 max-w-full">
                    <Search size={16} md:size={18} className="text-chill-sage flex-shrink-0" />
                    <span className="text-white font-medium text-sm md:text-lg truncate max-w-[200px] sm:max-w-md">
                      "{searchQuery}"
                    </span>
                    <button
                      onClick={() => {
                        setSearchInput('');
                        navigate('/booklists');
                      }}
                      className="ml-1 md:ml-2 text-gray-400 hover:text-white transition-colors flex-shrink-0"
                    >
                      <X size={14} md:size={16} />
                    </button>
                  </div>

                  {/* Search Mode Badge */}
                  {searchType && (
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-1 md:px-3 md:py-1.5 rounded-lg md:rounded-xl text-[10px] md:text-xs font-bold uppercase tracking-wider border backdrop-blur-sm
                      ${searchType === 'hybrid' || searchType === 'semantic'
                        ? 'bg-chill-blue/20 text-chill-blue border-chill-blue/40'
                        : 'bg-chill-lavender/20 text-chill-lavender border-chill-lavender/40'
                      }`}
                    >
                      {searchType === 'hybrid' || searchType === 'semantic' ? (
                        <>
                          <Brain size={11} md:size={13} />
                          <span className="hidden sm:inline">AI Search</span>
                          <span className="sm:hidden">AI</span>
                        </>
                      ) : (
                        <>
                          <Zap size={11} md:size={13} />
                          <span className="hidden sm:inline">Quick Search</span>
                          <span className="sm:hidden">Quick</span>
                        </>
                      )}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center justify-between md:justify-end gap-3">
            <span className="text-xs md:text-sm font-medium text-chill-sage bg-chill-surface border border-white/5 px-3 py-1.5 md:px-4 md:py-2 rounded-full shadow-sm">
              {loading && currentPage === 1
                ? 'Searching...'
                : pagination.totalBooks >= 10000
                  ? '10k+'
                  : pagination.totalBooks > 100
                    ? '100+'
                    : pagination.totalBooks || books.length} books
            </span>
            
            {/* View Mode Toggle (Mobile) */}
            <div className="md:hidden">
              <ViewModeToggle />
            </div>
            
            {pagination.totalPages > 1 && (
              <span className="text-xs text-gray-400 hidden sm:block">
                Page {currentPage} of {pagination.totalPages}
              </span>
            )}
          </div>
        </div>

        {/* --- Search Bar --- */}
        <div className="mb-6 md:mb-10">
          <form onSubmit={handleSearch} className="relative">
            <div className="relative flex items-stretch gap-0">
              {/* Search Input */}
              <div className="relative flex-1">
                <Search className="absolute left-3 md:left-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} md:size={22} />
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  placeholder="Search books..."
                  className="w-full pl-10 md:pl-14 pr-4 py-3 md:py-4 bg-chill-surface/90 backdrop-blur-xl border border-white/10 rounded-l-2xl text-white placeholder-gray-400 focus:outline-none focus:border-chill-sage/60 transition-all duration-300 shadow-xl text-sm md:text-base"
                />
                {/* Clear Button */}
                {searchInput && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchInput('');
                      navigate('/booklists');
                    }}
                    className="absolute right-3 md:right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition"
                  >
                    <X size={16} md:size={20} />
                  </button>
                )}
              </div>

              {/* Search Button */}
              <button
                type="submit"
                className="px-4 md:px-8 bg-chill-sage text-black font-bold rounded-r-2xl hover:bg-chill-sand transition-all duration-300 shadow-glow-sage flex items-center gap-1 md:gap-2 group"
              >
                <Search size={18} md:size={20} className="group-hover:scale-110 transition" />
                <span className="hidden sm:inline">Search</span>
              </button>
            </div>

            {/* Search Mode Toggle - Only when searching */}
            {searchQuery && (
              <div className="mt-3 md:mt-5 flex flex-wrap gap-2">
                <span className="text-xs md:text-sm text-gray-400 flex items-center gap-1 md:gap-2">
                  <Zap size={12} md:size={15} />
                  Mode:
                </span>
                {searchModes.map((mode) => {
                  const Icon = mode.icon;
                  const active = searchMode === mode.value;
                  return (
                    <button
                      key={mode.value}
                      onClick={() => setSearchMode(mode.value)}
                      className={`
                        px-3 py-1.5 md:px-4 md:py-2 rounded-lg md:rounded-xl text-xs md:text-sm font-medium transition-all duration-300 flex items-center gap-1 md:gap-2
                        ${active
                          ? mode.value === 'hybrid'
                            ? 'bg-chill-blue/30 text-chill-blue border border-chill-blue/50'
                            : 'bg-chill-lavender/30 text-chill-lavender border border-chill-lavender/50'
                          : 'bg-chill-surface/50 border border-white/10 text-gray-400 hover:text-white hover:bg-white/5'
                        }
                      `}
                      title={mode.description}
                    >
                      <Icon size={12} md:size={14} />
                      <span className="hidden xs:inline">{active ? mode.label : mode.label.split(' ')[0]}</span>
                      <span className="xs:hidden">{mode.label.charAt(0)}</span>
                      {active && <Check size={12} md:size={14} className="ml-0.5 md:ml-1" />}
                    </button>
                  );
                })}
              </div>
            )}
          </form>
        </div>

        {/* --- Mobile Filter Toggle --- */}
        <div className="md:hidden mb-4 flex items-center justify-between gap-3">
          <button
            onClick={() => setIsFiltersOpen(!isFiltersOpen)}
            className="flex items-center gap-2 px-4 py-2.5 bg-chill-surface border border-white/5 rounded-xl text-sm text-white hover:bg-white/5 transition-colors flex-1"
          >
            <Filter size={16} />
            <span>Filters & Sort</span>
            {(authorFilter || sortBy !== 'downloadCount') && (
              <span className="ml-auto w-2 h-2 bg-chill-sage rounded-full"></span>
            )}
          </button>
          
          {/* View Mode Toggle (Desktop) */}
          <div className="hidden md:block">
            <ViewModeToggle />
          </div>
        </div>

        {/* --- Filters and Sorting (Collapsible on Mobile) --- */}
        <div className={`${isFiltersOpen ? 'block' : 'hidden'} md:block mb-6 md:mb-12`}>
          {!searchQuery && (
            <>
              <div className="mb-4 md:mb-6 p-4 md:p-0 bg-chill-surface/50 md:bg-transparent rounded-xl md:rounded-none">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-400 font-medium">
                    <Filter size={14} />
                    <span>Filter & Sort</span>
                    {(authorFilter || sortBy !== 'downloadCount') && (
                      <button
                        onClick={clearFilters}
                        className="ml-2 text-xs text-gray-500 hover:text-white flex items-center gap-1"
                      >
                        <X size={12} /> Clear
                      </button>
                    )}
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-3">
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
                        className="px-4 py-2 bg-chill-surface border border-white/5 rounded-xl text-sm text-white focus:outline-none focus:border-chill-sage/50 transition-colors flex-1"
                      >
                        {sortOptions.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      
                      <button
                        onClick={toggleSortOrder}
                        className="p-2 bg-chill-surface border border-white/5 rounded-xl hover:bg-white/5 transition-colors flex-shrink-0"
                        title={sortOrder === 'asc' ? 'Ascending' : 'Descending'}
                      >
                        <ArrowUpDown size={16} className={sortOrder === 'asc' ? 'text-chill-sage' : 'text-gray-400'} />
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Genre Filter Chips */}
                <div className="flex flex-wrap gap-2">
                  {availableGenres.map(genre => {
                    const isActive = category === genre || (genre === 'All Books' && !category);
                    return (
                      <button
                        key={genre}
                        onClick={() => {
                          handleGenreChange(genre);
                          setIsFiltersOpen(false);
                        }}
                        className={`
                          px-3 py-1.5 md:px-5 md:py-2.5 rounded-xl md:rounded-2xl text-xs md:text-sm font-medium transition-all duration-300 ease-out
                          border
                          ${isActive 
                            ? 'bg-chill-sage text-chill-bg border-chill-sage shadow-glow-sage font-bold' 
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
            </>
          )}
        </div>

        {/* --- Content Area --- */}
        <div className="min-h-[300px]">
          
          {/* Loading State - Initial load */}
          {loading && currentPage === 1 && (
            <div className="flex flex-col justify-center items-center py-12 md:py-24 gap-3 md:gap-4">
              <div className="animate-spin rounded-full h-10 w-10 md:h-12 md:w-12 border-4 border-chill-surface border-t-chill-sage"></div>
              <p className="text-gray-500 animate-pulse text-xs md:text-sm tracking-wide text-center px-4">
                {searchQuery 
                  ? `Searching for "${searchQuery}"...`
                  : 'Fetching library data...'
                }
              </p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl md:rounded-2xl p-6 md:p-8 text-center max-w-lg mx-auto mt-4 md:mt-8 backdrop-blur-sm">
              <Frown className="w-8 h-8 md:w-10 md:h-10 text-red-400 mx-auto mb-2 md:mb-3" />
              <p className="text-white font-medium mb-1 text-sm md:text-base">Unable to load books</p>
              <p className="text-xs md:text-sm text-red-300/70 mb-3 md:mb-4">{error}</p>
              <button 
                onClick={refresh}
                className="text-white bg-red-500/20 hover:bg-red-500/30 px-4 py-2 md:px-6 md:py-2 rounded-lg md:rounded-xl text-xs md:text-sm transition-colors border border-red-500/20"
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
                <div className="flex flex-col items-center justify-center py-12 md:py-20 text-center border border-dashed border-white/5 rounded-xl md:rounded-3xl bg-chill-surface/30 p-4">
                  <div className="bg-chill-highlight p-4 md:p-5 rounded-full mb-3 md:mb-4">
                    {searchQuery ? (
                      <Search size={24} md:size={32} className="text-gray-500" />
                    ) : (
                      <BookOpen size={24} md:size={32} className="text-gray-500" />
                    )}
                  </div>
                  <h3 className="text-lg md:text-xl font-bold text-white mb-1 md:mb-2">No books found</h3>
                  <p className="text-xs md:text-sm text-gray-500 mb-4 md:mb-6 max-w-sm">
                    {searchQuery 
                      ? `No books found for "${searchQuery}"`
                      : `No books found in the "${category}" category.`
                    }
                  </p>
                  {searchQuery && (
                    <div className="mb-3 md:mb-4 p-3 bg-chill-surface/50 rounded-lg border border-white/5 w-full">
                      <p className="text-xs md:text-sm text-gray-400 mb-2">Try:</p>
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => {
                            if (searchMode === 'hybrid') {
                              setSearchMode('simple');
                              searchRefresh();
                            }
                          }}
                          className="px-3 py-1 text-xs bg-chill-surface border border-white/5 rounded hover:bg-white/5"
                        >
                          Switch to keyword
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
                    className="px-5 py-2 md:px-6 md:py-2.5 bg-chill-sage text-chill-bg font-bold rounded-lg md:rounded-xl hover:bg-[#c5d38a] transition-colors shadow-lg shadow-chill-sage/10 text-sm md:text-base"
                  >
                    {searchQuery ? 'Clear Search' : 'View All Books'}
                  </button>
                </div>
              ) : (
                <>
                  {/* Search Info Banner */}
                  {searchQuery && (
                    <div className="mb-4 md:mb-6 p-3 md:p-4 bg-gradient-to-r from-chill-blue/10 to-chill-lavender/5 rounded-xl border border-white/5">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            {searchType === 'hybrid' || searchType === 'semantic' ? (
                              <>
                                <Brain size={14} md:size={16} className="text-chill-blue" />
                                <span className="text-xs md:text-sm font-medium text-chill-blue">Hybrid AI Search</span>
                              </>
                            ) : (
                              <>
                                <Zap size={14} md:size={16} className="text-chill-lavender" />
                                <span className="text-xs md:text-sm font-medium text-chill-lavender">Quick Search</span>
                              </>
                            )}
                          </div>
                          <p className="text-xs text-gray-400">
                            Found {pagination.totalBooks} books matching "{searchQuery}"
                            {searchType === 'hybrid' && ' using AI'}
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
                    <div className="mb-4 md:mb-6 flex flex-wrap gap-2">
                      {authorFilter && (
                        <span className="px-2 py-1 md:px-3 md:py-1 bg-chill-lavender/10 text-chill-lavender text-xs rounded-full border border-chill-lavender/20">
                          Author: "{authorFilter}"
                        </span>
                      )}
                      {sortBy !== 'downloadCount' && (
                        <span className="px-2 py-1 md:px-3 md:py-1 bg-chill-sage/10 text-chill-sage text-xs rounded-full border border-chill-sage/20">
                          Sorted by: {sortOptions.find(o => o.value === sortBy)?.label}
                        </span>
                      )}
                    </div>
                  )}

                  {/* The Grid */}
                  <div className={gridClass}>
                    {books.map((book, index) => (
                      viewMode === 'grid' ? (
                        <BookCard key={`${book.gutenbergId || book._id}-${index}`} book={book} />
                      ) : (
                        // List view for mobile
                        <div key={`${book.gutenbergId || book._id}-${index}`} className="flex gap-3 p-3 bg-chill-surface/50 rounded-xl border border-white/5">
                          <div className="flex-shrink-0 w-16 md:w-20">
                            <BookCard book={book} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-bold text-white truncate">{book.title}</h3>
                            <p className="text-xs text-gray-400 truncate">{book.author}</p>
                            {book.subjects && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {book.subjects.slice(0, 2).map((subject, i) => (
                                  <span key={i} className="text-[10px] bg-white/5 text-gray-400 px-1.5 py-0.5 rounded">
                                    {subject}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    ))}
                  </div>

                  {/* Pagination Controls */}
                  <div className="mt-8 md:mt-16 flex flex-col items-center gap-4 md:gap-6">
                    
                    {/* Load More Button */}
                    {hasMore && (
                      <button
                        onClick={loadMore}
                        disabled={loading}
                        className="px-6 py-2.5 md:px-8 md:py-3 bg-chill-sage/10 hover:bg-chill-sage/20 text-chill-sage font-medium rounded-xl border border-chill-sage/30 transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm md:text-base"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="w-3 h-3 md:w-4 md:h-4 animate-spin" />
                            Loading...
                          </>
                        ) : (
                          <>
                            Load More ({pagination.totalBooks - books.length} more)
                            <ChevronRight size={14} md:size={16} />
                          </>
                        )}
                      </button>
                    )}

                    {/* Page Info */}
                    <p className="text-xs md:text-sm text-gray-500 text-center px-4">
                      Showing <span className="text-white font-medium">{
                        (currentPage - 1) * pagination.limit + 1
                      }</span> to <span className="text-white font-medium">{
                        Math.min(currentPage * pagination.limit, pagination.totalBooks)
                      }</span> of {pagination.totalBooks} results
                    </p>

                    {/* Page Navigation */}
                    {pagination.totalPages > 1 && (
                      <div className="flex items-center gap-1 md:gap-2 bg-chill-surface p-1 md:p-1.5 rounded-xl md:rounded-2xl border border-white/5 shadow-lg">
                        <button
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                          className={`
                            p-1.5 md:p-2.5 rounded-lg md:rounded-xl transition-all duration-200 flex items-center gap-1 md:gap-2
                            ${currentPage === 1 
                              ? 'text-gray-600 cursor-not-allowed' 
                              : 'text-white hover:bg-white/10 hover:text-chill-sage active:scale-95'
                            }
                          `}
                        >
                          <ChevronLeft size={16} md:size={20} />
                          <span className="hidden sm:inline text-xs md:text-sm font-medium">Prev</span>
                        </button>

                        <div className="px-3 py-1.5 md:px-4 md:py-2 bg-chill-bg rounded-lg md:rounded-xl border border-white/5 text-xs md:text-sm font-mono text-chill-sage">
                          {currentPage} <span className="text-gray-600">/</span> {pagination.totalPages}
                        </div>

                        <button
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === pagination.totalPages}
                          className={`
                            p-1.5 md:p-2.5 rounded-lg md:rounded-xl transition-all duration-200 flex items-center gap-1 md:gap-2
                            ${currentPage === pagination.totalPages 
                              ? 'text-gray-600 cursor-not-allowed' 
                              : 'text-white hover:bg-white/10 hover:text-chill-sage active:scale-95'
                            }
                          `}
                        >
                          <span className="hidden sm:inline text-xs md:text-sm font-medium">Next</span>
                          <ChevronRight size={16} md:size={20} />
                        </button>
                      </div>
                    )}

                    {/* Showing info when all books loaded */}
                    {!hasMore && currentPage > 1 && (
                      <div className="mt-4 md:mt-8 text-center py-3 md:py-4 border-t border-white/5">
                        <p className="text-xs md:text-sm text-gray-500">
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