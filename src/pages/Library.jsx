// frontend/src/pages/Library.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  BookOpen, Bookmark, BookmarkCheck, Calendar, User, 
  BookmarkPlus, SortAsc, TrendingUp, X, Loader2
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useUserProfile } from '../hooks/useUserProfile';
import LoadingSpinner from '../components/LoadingSpinner';

// Imported modular components
import LibraryHeader from '../components/library/LibraryHeader';
import LibraryControls from '../components/library/LibraryControls';
import LibraryFilters from '../components/library/LibraryFilters';
import LibraryTabs from '../components/library/LibraryTabs';
import LibraryBookCard from '../components/library/LibraryBookCard';
import LibraryBookListItem from '../components/library/LibraryBookListItem';

const getShelfColor = (shelfType) => {
  switch(shelfType) {
    case 'currentlyReading': return 'border-chill-sage bg-chill-sage/10';
    case 'wantToRead': return 'border-chill-lavender bg-chill-lavender/10';
    case 'read': return 'border-purple-400 bg-purple-400/10';
    default: return 'border-gray-600 bg-gray-600/10';
  }
};



const Library = () => {
  const { currentUser } = useAuth();
  const { getBookshelf, profile } = useUserProfile();
  const location = useLocation();
  
  const queryParams = new URLSearchParams(location.search);
  const initialShelf = queryParams.get('shelf') || 'all';
  
  // Map URL shelf names to schema names
  const getShelfType = (urlShelf) => {
    switch(urlShelf) {
      case 'currently-reading': return 'currentlyReading';
      case 'want-to-read': return 'wantToRead';
      case 'read': return 'read';
      default: return 'all';
    }
  };
  const handleBookRemoved = (bookId, shelfType) => {
  // Refresh your bookshelf data
  loadBookshelves();
  
  // Or update local state if you want
  setShelves(prev => ({
    ...prev,
    [shelfType]: {
      ...prev[shelfType],
      books: prev[shelfType].books.filter(book => 
        book._id !== bookId && 
        book.bookId !== bookId
      )
    }
  }));
};


  
  
  const [activeTab, setActiveTab] = useState(initialShelf);
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('recently-added');
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [shelves, setShelves] = useState({
    'currentlyReading': { books: [], loading: true },
    'wantToRead': { books: [], loading: true },
    'read': { books: [], loading: true }
  });
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalBooks: 0,
    readingNow: 0,
    finished: 0,
    readingTime: 0
  });

  // Load bookshelves
  const loadBookshelves = async () => {
    if (!currentUser) {
      setShelves({
        'currentlyReading': { books: [], loading: false },
        'wantToRead': { books: [], loading: false },
        'read': { books: [], loading: false }
      });
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      // Use the correct shelf types from your schema
      const shelfTypes = ['currentlyReading', 'wantToRead', 'read'];
      const shelfPromises = shelfTypes.map(async (shelfType) => {
        try {
          const response = await getBookshelf(shelfType);
          console.log(`Bookshelf ${shelfType} response:`, response);
          
          // Handle different response formats
          let books = [];
          if (response.success) {
            if (response.data && Array.isArray(response.data)) {
              books = response.data;
            } else if (response.books && Array.isArray(response.books)) {
              books = response.books;
            }
          }
          
          return {
            type: shelfType,
            books: books,
            error: response.success ? null : response.message
          };
        } catch (error) {
          console.error(`Error loading ${shelfType}:`, error);
          return {
            type: shelfType,
            books: [],
            error: error.message
          };
        }
      });

      const results = await Promise.all(shelfPromises);
      
      const newShelves = {};
      let totalBooks = 0;
      let readingNow = 0;
      let finished = 0;
      
      results.forEach(result => {
        newShelves[result.type] = {
          books: result.books,
          loading: false,
          error: result.error
        };
        
        const count = result.books.length;
        totalBooks += count;
        
        if (result.type === 'currentlyReading') {
          readingNow = count;
        } else if (result.type === 'read') {
          finished = count;
        }
      });
      
      console.log('Loaded shelves:', newShelves);
      console.log('Stats:', { totalBooks, readingNow, finished });
      
      setShelves(newShelves);
      setStats({
        totalBooks,
        readingNow,
        finished,
        readingTime: Math.floor(totalBooks * 8) // Estimate: 8 hours per book
      });
      
    } catch (error) {
      console.error('Error loading bookshelves:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load shelves on mount and when user changes
  useEffect(() => {
    loadBookshelves();
  }, [currentUser]);

  // Combine all books from shelves
  const allBooks = useMemo(() => {
    const books = [];
    
    // Add books from each shelf
    ['currentlyReading', 'wantToRead', 'read'].forEach(shelfType => {
      const shelf = shelves[shelfType];
      if (shelf && shelf.books && !shelf.loading) {
        shelf.books.forEach(item => {
          // Handle different response formats
          const bookData = item.book || item.bookId || item;
          if (bookData) {
            books.push({
              ...bookData,
              _shelf: shelfType,
              _addedDate: item.addedAt || item.finishedAt || new Date(),
              _shelfColor: getShelfColor(shelfType)
            });
          }
        });
      }
    });
    
    console.log('All books combined:', books.length);
    return books;
  }, [shelves]);

  // Extract unique genres from all books
  const allGenres = useMemo(() => {
    const genres = new Set();
    allBooks.forEach(book => {
      if (book.subjects) {
        if (Array.isArray(book.subjects)) {
          book.subjects.forEach(subject => {
            if (subject && typeof subject === 'string') {
              const mainGenre = subject.split(',')[0].trim();
              if (mainGenre && mainGenre.length > 2) {
                genres.add(mainGenre);
              }
            }
          });
        }
      } else if (book.genre) {
        if (Array.isArray(book.genre)) {
          book.genre.forEach(g => {
            if (g && typeof g === 'string') {
              genres.add(g.trim());
            }
          });
        } else if (typeof book.genre === 'string') {
          genres.add(book.genre.trim());
        }
      }
    });
    return Array.from(genres).sort().slice(0, 15); // Limit to 15 genres
  }, [allBooks]);

  // Filter and sort books
  const filteredBooks = useMemo(() => {
    let filtered = [...allBooks];
    
    // Filter by active tab (convert URL shelf to schema shelf)
    if (activeTab !== 'all') {
      const shelfType = getShelfType(activeTab);
      filtered = filtered.filter(book => book._shelf === shelfType);
    }
    
    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(book => {
        return (
          (book.title && book.title.toLowerCase().includes(query)) ||
          (book.author && book.author.toLowerCase().includes(query)) ||
          (book.subjects && Array.isArray(book.subjects) && book.subjects.some(subject => 
            subject && typeof subject === 'string' && subject.toLowerCase().includes(query)
          ))
        );
      });
    }
    
    // Filter by genres
    if (selectedGenres.length > 0) {
      filtered = filtered.filter(book => {
        if (book.subjects && Array.isArray(book.subjects)) {
          return book.subjects.some(subject =>
            subject && selectedGenres.some(genre => 
              subject.toLowerCase().includes(genre.toLowerCase())
            )
          );
        }
        return false;
      });
    }
    
    // Sort books
    filtered.sort((a, b) => {
      const aDate = a._addedDate ? new Date(a._addedDate) : new Date(0);
      const bDate = b._addedDate ? new Date(b._addedDate) : new Date(0);
      
      switch(sortBy) {
        case 'recently-added':
          return bDate - aDate;
        case 'title-asc':
          return (a.title || '').localeCompare(b.title || '');
        case 'title-desc':
          return (b.title || '').localeCompare(a.title || '');
        case 'author-asc':
          return (a.author || '').localeCompare(b.author || '');
        case 'popular':
          return (b.downloadCount || 0) - (a.downloadCount || 0);
        default:
          return bDate - aDate;
      }
    });
    
    return filtered;
  }, [allBooks, activeTab, searchQuery, selectedGenres, sortBy]);

  // Helper functions

  // Map URL shelf to display name
  const getShelfDisplayName = (urlShelf) => {
    switch(urlShelf) {
      case 'currently-reading': return 'Reading Now';
      case 'want-to-read': return 'Want to Read';
      case 'read': return 'Finished';
      case 'all': return 'All Books';
      default: return urlShelf;
    }
  };

  // Tab configurations
  const tabs = [
    { 
      id: 'all', 
      label: 'All Books', 
      icon: BookOpen, 
      color: 'text-chill-blue',
      count: allBooks.length
    },
    { 
      id: 'currently-reading', 
      label: 'Reading Now', 
      icon: Bookmark, 
      color: 'text-chill-sage',
      count: shelves['currentlyReading']?.books?.length || 0
    },
    { 
      id: 'want-to-read', 
      label: 'Want to Read', 
      icon: BookmarkPlus, 
      color: 'text-chill-lavender',
      count: shelves['wantToRead']?.books?.length || 0
    },
    { 
      id: 'read', 
      label: 'Finished', 
      icon: BookmarkCheck, 
      color: 'text-purple-400',
      count: shelves['read']?.books?.length || 0
    }
  ];

  // Sort options
  const sortOptions = [
    { id: 'recently-added', label: 'Recently Added', icon: Calendar },
    { id: 'title-asc', label: 'Title (A-Z)', icon: SortAsc },
    { id: 'title-desc', label: 'Title (Z-A)', icon: SortAsc },
    { id: 'author-asc', label: 'Author (A-Z)', icon: User },
    { id: 'popular', label: 'Most Popular', icon: TrendingUp }
  ];

  // Handle tab change
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    window.history.pushState({}, '', `/library${tabId !== 'all' ? `?shelf=${tabId}` : ''}`);
  };

  // Toggle genre filter
  const toggleGenre = (genre) => {
    setSelectedGenres(prev =>
      prev.includes(genre)
        ? prev.filter(g => g !== genre)
        : [...prev, genre]
    );
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery('');
    setSelectedGenres([]);
    setSortBy('recently-added');
  };

  // Refresh data
  const handleRefresh = () => {
    loadBookshelves();
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-chill-bg flex items-center justify-center">
        <div className="text-center max-w-md p-8">
          <div className="w-20 h-20 mx-auto mb-6 bg-chill-card rounded-full flex items-center justify-center">
            <User className="w-10 h-10 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">Sign In Required</h2>
          <p className="text-gray-400 mb-6">
            Please sign in to access your personal library and track your reading progress.
          </p>
          <Link
            to="/login"
            className="inline-block bg-chill-sage text-black px-6 py-3 rounded-full font-medium hover:bg-chill-sand transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-chill-bg font-sans text-gray-200 pb-16">
      <LibraryHeader profile={profile} stats={stats} />

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 py-8">
        <LibraryControls 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          showFilters={showFilters}
          setShowFilters={setShowFilters}
          selectedGenres={selectedGenres}
          sortBy={sortBy}
          viewMode={viewMode}
          setViewMode={setViewMode}
          handleRefresh={handleRefresh}
          loading={loading}
        />

        <LibraryFilters 
          showFilters={showFilters}
          sortBy={sortBy}
          setSortBy={setSortBy}
          sortOptions={sortOptions}
          selectedGenres={selectedGenres}
          setSelectedGenres={setSelectedGenres}
          allGenres={allGenres}
          toggleGenre={toggleGenre}
        />

        <LibraryTabs 
          tabs={tabs}
          activeTab={activeTab}
          handleTabChange={handleTabChange}
        />

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-16">
            <LoadingSpinner size="lg" />
            <p className="text-gray-400 mt-4">Loading your library...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredBooks.length === 0 && (
          <div className="bg-chill-card/50 rounded-2xl p-12 text-center border border-white/5">
            <div className="w-20 h-20 mx-auto mb-6 bg-chill-bg rounded-full flex items-center justify-center">
              {activeTab === 'all' ? (
                <BookOpen className="w-10 h-10 text-gray-400" />
              ) : activeTab === 'currently-reading' ? (
                <Bookmark className="w-10 h-10 text-chill-sage" />
              ) : activeTab === 'want-to-read' ? (
                <BookmarkPlus className="w-10 h-10 text-chill-lavender" />
              ) : (
                <BookmarkCheck className="w-10 h-10 text-purple-400" />
              )}
            </div>
            <h3 className="text-xl font-bold text-white mb-3">
              {activeTab === 'all' 
                ? 'Your Library is Empty'
                : `No ${getShelfDisplayName(activeTab)}`
              }
            </h3>
            <p className="text-gray-400 max-w-md mx-auto mb-6">
              {activeTab === 'all' 
                ? "Start building your library by adding books to your reading lists."
                : searchQuery
                ? `No books found matching "${searchQuery}"`
                : `You haven't added any books to ${getShelfDisplayName(activeTab).toLowerCase()} yet.`
              }
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link
                to="/booklists"
                className="bg-chill-sage text-black px-6 py-3 rounded-full font-medium hover:bg-chill-sand transition-colors flex items-center gap-2"
              >
                <BookOpen size={16} />
                Browse Books
              </Link>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="bg-chill-card border border-white/5 text-white px-6 py-3 rounded-full font-medium hover:bg-white/5 transition-colors flex items-center gap-2"
                >
                  <X size={16} />
                  Clear Search
                </button>
              )}
            </div>
          </div>
        )}

        {/* Books Grid/List */}
        {!loading && filteredBooks.length > 0 && (
          <>
            <div className="mb-6 flex items-center justify-between">
              <div className="text-sm text-gray-400">
                Showing <span className="text-white font-medium">{filteredBooks.length}</span> book{filteredBooks.length !== 1 ? 's' : ''}
                {searchQuery && (
                  <span> for "<span className="text-white">{searchQuery}</span>"</span>
                )}
              </div>
              
              {(selectedGenres.length > 0 || sortBy !== 'recently-added' || searchQuery) && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-gray-400 hover:text-white flex items-center gap-1"
                >
                  <X size={14} />
                  Clear filters
                </button>
              )}
            </div>
            
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredBooks.map((book) => (
  <LibraryBookCard 
    key={book._id} 
    book={book} 
    shelf={book._shelf}
    onBookRemoved={handleBookRemoved}
  />
))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredBooks.map((book, index) => (
                  <LibraryBookListItem 
                    key={`${book._id || book.gutenbergId || index}`} 
                    book={book} 
                    shelf={book._shelf}
                  />
                ))}
              </div>
            )}

            {/* Last Updated */}
            <div className="mt-12 text-center">
              <div className="inline-flex items-center gap-2 text-sm text-gray-400">
                <Calendar size={14} />
                Last updated: {new Date().toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Library;