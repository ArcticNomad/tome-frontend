import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, Loader2, Maximize2, Minimize2, ChevronLeft, ChevronRight, Settings, BookOpen, Bookmark, Download } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useUserProfile } from '../hooks/useUserProfile';
import { API_BASE_URL } from '../api/books';
// Import modular components
import ReaderHeader from '../components/reader/ReaderHeader';
import ReaderControls from '../components/reader/ReaderControls';
import ReaderNavigation from '../components/reader/ReaderNavigation';
import ReaderContent from '../components/reader/ReaderContent';
import QuickActions from '../components/reader/QuickActions';
import ReaderSettings from '../components/reader/ReaderSettings';
import BookInfoDetails from '../components/reader/BookInfoDetails';

const BookReaderPage = () => {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { updateReadingProgress, getBookStatus, addToBookshelf } = useUserProfile();
  
  // -- State --
  const [book, setBook] = useState(null);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingContent, setLoadingContent] = useState(false);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [wordsPerPage, setWordsPerPage] = useState(300);
  const [isReading, setIsReading] = useState(false);
  const [readingTime, setReadingTime] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [bookStatus, setBookStatus] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [fontSize, setFontSize] = useState('text-base');
  const [lineHeight, setLineHeight] = useState('leading-relaxed');
  const [pages, setPages] = useState([]);
  const [contentError, setContentError] = useState('');
  const [fullTextUrl, setFullTextUrl] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [goToPageInput, setGoToPageInput] = useState('');
  const [sliderValue, setSliderValue] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [showMinimalDock, setShowMinimalDock] = useState(true);
  
  const readingContainerRef = useRef(null);
  const timerRef = useRef(null);
  const sliderTimeoutRef = useRef(null);
  const dockTimeoutRef = useRef(null);

  // -- Data Fetching --

  const fetchBookData = useCallback(async () => {
    setLoading(true);
    setError('');
    
    try {
      // Use the new endpoint that includes fullTextUrl
     const bookResponse = await fetch(`${API_BASE_URL}/books/${bookId}/full`);
      
      if (!bookResponse.ok) {
        // Fallback to regular endpoint if new one fails
            const fallbackResponse = await fetch(`${API_BASE_URL}/books/${bookId}`);
        if (!fallbackResponse.ok) throw new Error(`Failed to fetch book: ${fallbackResponse.status}`);
        
        const fallbackData = await fallbackResponse.json();
        if (!fallbackData.success) throw new Error(fallbackData.message || 'Book not found');
        
        setBook(fallbackData.data);
        if (fallbackData.data.gutenbergId) {
          setFullTextUrl(`https://storage.googleapis.com/book_text_data/books/${fallbackData.data.gutenbergId}/full-text.txt`);
        }
      } else {
        const bookData = await bookResponse.json();
        if (!bookData.success) throw new Error(bookData.message || 'Book not found');
        
        setBook(bookData.data);
        if (bookData.data.fullTextUrl) setFullTextUrl(bookData.data.fullTextUrl);
      }
    } catch (err) {
      console.error('Error fetching book:', err);
      setError(err.message || 'Failed to load book');
    } finally {
      setLoading(false);
    }
  }, [bookId]);

  // Fetch book status
  useEffect(() => {
    const fetchBookStatus = async () => {
      if (currentUser && book) {
        try {
          const status = await getBookStatus(book._id);
          setBookStatus(status);
        } catch (statusError) {
          console.warn('Could not fetch book status:', statusError);
        }
      }
    };
    if (book) fetchBookStatus();
  }, [currentUser, book, getBookStatus]);

  // Paginate content locally (fallback)
  const paginateContent = useCallback((text) => {
    if (!text) {
      setPages([]);
      setTotalPages(0);
      return;
    }
    const words = text.split(/\s+/);
    const pagesArray = [];
    for (let i = 0; i < words.length; i += wordsPerPage) {
      const pageWords = words.slice(i, i + wordsPerPage);
      pagesArray.push(pageWords.join(' '));
    }
    setPages(pagesArray);
    setTotalPages(pagesArray.length);
  }, [wordsPerPage]);

  // Fetch book content
  const fetchBookContent = useCallback(async (page = 1) => {
    if (!fullTextUrl && !book?.gutenbergId) {
      setContentError('No full text available for this book');
      return;
    }
    setLoadingContent(true);
    setContentError('');
    
    try {
      // Use the new content endpoint with pagination
     const contentResponse = await fetch(
      `${API_BASE_URL}/books/${bookId}/content?page=${page}&wordsPerPage=${wordsPerPage}`
    );
      
      if (contentResponse.ok) {
        const contentData = await contentResponse.json();
        if (contentData.success) {
          setContent(contentData.data.content);
          setCurrentPage(contentData.data.metadata.currentPage);
          setTotalPages(contentData.data.metadata.totalPages);
          setLoadingContent(false);
          return;
        }
      }
      
      // Fallback: Direct Google Storage
      const urlToFetch = fullTextUrl || 
        `https://storage.googleapis.com/book_text_data/books/${book.gutenbergId}/full-text.txt`;
      
      const directResponse = await fetch(urlToFetch);
      if (!directResponse.ok) throw new Error('Failed to load book content from storage');
      
      const textContent = await directResponse.text();
      setContent(textContent);
      paginateContent(textContent);
      
    } catch (err) {
      console.error('Error fetching content:', err);
      setContentError(err.message || 'Failed to load content');
      if (book?.summary) {
        setContent(book.summary);
        paginateContent(book.summary);
      }
    } finally {
      setLoadingContent(false);
    }
  }, [bookId, book, fullTextUrl, wordsPerPage, paginateContent]);

  // Initial loads
  useEffect(() => { fetchBookData(); }, [fetchBookData]);
  
  useEffect(() => {
    if (book && !content && !loadingContent) fetchBookContent(1);
  }, [book, content, loadingContent, fetchBookContent]);

  // Update slider value when current page changes (only when not dragging)
  useEffect(() => {
    if (!isDragging) {
      setSliderValue(currentPage);
    }
  }, [currentPage, isDragging]);

  // Reading timer
  useEffect(() => {
    if (isReading && startTime) {
      timerRef.current = setInterval(() => {
        const elapsedMinutes = Math.floor((Date.now() - startTime) / 60000);
        setReadingTime(prev => prev + elapsedMinutes);
        setStartTime(Date.now());
      }, 60000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isReading, startTime]);

  // Fullscreen handler
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
      // Auto-hide dock after 3 seconds in fullscreen
      dockTimeoutRef.current = setTimeout(() => {
        setShowMinimalDock(false);
      }, 3000);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
      setShowMinimalDock(true);
      if (dockTimeoutRef.current) clearTimeout(dockTimeoutRef.current);
    }
  };

  // Show dock temporarily when interacting
  const showDockTemporarily = () => {
    if (isFullscreen) {
      setShowMinimalDock(true);
      if (dockTimeoutRef.current) clearTimeout(dockTimeoutRef.current);
      dockTimeoutRef.current = setTimeout(() => {
        setShowMinimalDock(false);
      }, 3000);
    }
  };

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isNowFullscreen = !!document.fullscreenElement;
      setIsFullscreen(isNowFullscreen);
      if (!isNowFullscreen) {
        setShowMinimalDock(true);
        if (dockTimeoutRef.current) clearTimeout(dockTimeoutRef.current);
      }
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      if (dockTimeoutRef.current) clearTimeout(dockTimeoutRef.current);
    };
  }, []);

  // Clean up timeouts
  useEffect(() => {
    return () => {
      if (sliderTimeoutRef.current) clearTimeout(sliderTimeoutRef.current);
      if (dockTimeoutRef.current) clearTimeout(dockTimeoutRef.current);
    };
  }, []);

  // -- Actions --

  const toggleReading = () => {
    if (!isReading) {
      setIsReading(true);
      setStartTime(Date.now());
      setMessage('Reading started... Timer active.');
    } else {
      setIsReading(false);
      setStartTime(null);
      setMessage('Reading paused');
    }
  };

  const goToPage = (pageNumber) => {
    if (pageNumber < 1) pageNumber = 1;
    if (pageNumber > totalPages) pageNumber = totalPages;
    
    if (bookId && totalPages > 50) {
      fetchBookContent(pageNumber);
    } else {
      setCurrentPage(pageNumber);
      setContent(pages[pageNumber - 1] || '');
    }
    if (readingContainerRef.current) readingContainerRef.current.scrollTop = 0;
    showDockTemporarily(); // Show dock when navigating
  };

  const handleGoToPageInput = () => {
    const pageNum = parseInt(goToPageInput);
    if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
      goToPage(pageNum);
      setGoToPageInput('');
    }
  };

  // Fixed slider handler - only navigates when user stops sliding
  const handleSliderStart = () => {
    setIsDragging(true);
    showDockTemporarily();
  };

  const handleSliderChange = (e) => {
    const pageNum = parseInt(e.target.value);
    setSliderValue(pageNum);
    
    // Clear any existing timeout
    if (sliderTimeoutRef.current) {
      clearTimeout(sliderTimeoutRef.current);
    }
    
    // Set a new timeout to navigate after 300ms of inactivity
    sliderTimeoutRef.current = setTimeout(() => {
      if (isDragging) {
        goToPage(pageNum);
      }
    }, 300);
  };

  const handleSliderEnd = () => {
    setIsDragging(false);
    
    // Navigate to the final slider position
    goToPage(sliderValue);
    
    // Clear timeout
    if (sliderTimeoutRef.current) {
      clearTimeout(sliderTimeoutRef.current);
    }
  };

  const saveProgress = async () => {
    if (!currentUser) return setMessage('Please log in to save progress');
    if (!book) return setMessage('Book data not loaded');
    
    setIsSaving(true);
    const progress = totalPages > 0 ? Math.round((currentPage / totalPages) * 100) : 0;
    
    try {
      await updateReadingProgress({
        bookId: book._id,
        gutenbergId: book.gutenbergId,
        currentPage,
        progress,
        readingTime
      });
      setMessage('✓ Progress saved successfully! Stats updated.');
      const status = await getBookStatus(book._id);
      setBookStatus(status);
    } catch (err) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleBookshelfAction = async (shelfType) => {
    if (!currentUser) return setMessage('Please log in to use bookshelf');
    if (!book) return setMessage('Book data not loaded');
    
    try {
      await addToBookshelf(book._id, shelfType, book.gutenbergId);
      setBookStatus(shelfType);
      setMessage(`✓ Added to ${shelfType.replace(/([A-Z])/g, ' $1').trim()}`);
    } catch (err) {
      setMessage(`Error: ${err.message}`);
    }
  };

  const downloadBook = () => {
    if (fullTextUrl) {
      window.open(fullTextUrl, '_blank');
    } else if (content) {
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${book?.title || 'book'}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  // -- Render --

  if (loading) {
    return (
      <div className="min-h-screen bg-chill-bg flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-chill-sage animate-spin mx-auto" />
          <p className="mt-4 text-gray-400">Loading book details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-chill-bg flex items-center justify-center">
        <div className="text-center max-w-md p-8 bg-chill-surface rounded-2xl border border-white/5 shadow-2xl">
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/20">
            <span className="text-red-400 text-2xl">!</span>
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Book Not Found</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <div className="flex gap-3 justify-center">
            <button onClick={() => navigate('/library')} className="px-6 py-2 bg-chill-sage text-black font-bold rounded-xl hover:bg-chill-sand transition-colors">Browse Library</button>
            <button onClick={() => navigate('/')} className="px-6 py-2 bg-chill-card text-gray-200 rounded-xl font-bold border border-white/5 hover:bg-white/5 transition-colors">Go Home</button>
          </div>
        </div>
      </div>
    );
  }

  const progress = totalPages > 0 ? Math.round((currentPage / totalPages) * 100) : 0;

  return (
    <div className={`min-h-screen ${isFullscreen ? 'fixed inset-0 z-50 bg-chill-bg' : 'bg-chill-bg'} font-sans text-gray-200 pb-12`}>
      {/* Regular Header (non-fullscreen) */}
      {!isFullscreen && (
        <ReaderHeader book={book} bookStatus={bookStatus} currentUser={currentUser} />
      )}

      <div className={`${isFullscreen ? 'h-screen' : 'max-w-6xl mx-auto px-4'}`}>
        {/* Regular Controls (non-fullscreen) */}
        {!isFullscreen && (
          <>
            <ReaderControls 
              currentPage={currentPage}
              totalPages={totalPages}
              progress={progress}
              readingTime={readingTime}
              isReading={isReading}
              isSaving={isSaving}
              onToggleReading={toggleReading}
              onSaveProgress={saveProgress}
            />

            <ReaderNavigation 
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={goToPage}
            />
          </>
        )}

        {/* Fullscreen Minimal Dock */}
        {isFullscreen && showMinimalDock && (
          <div className="absolute bottom-0 left-0 right-0 bg-chill-surface/90 backdrop-blur-md border-t border-white/5 p-4 z-50">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-between">
                {/* Book Info */}
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 px-4 py-2 bg-chill-card/50 rounded-xl font-bold border border-white/5 hover:bg-white/5 transition-colors"
                  >
                    <ChevronLeft size={18} />
                    Back
                  </button>
                  <div className="max-w-xs">
                    <h1 className="text-sm font-bold text-white truncate">{book?.title}</h1>
                    <p className="text-xs text-gray-400 truncate">Page {currentPage} of {totalPages} ({progress}%)</p>
                  </div>
                </div>

                {/* Navigation Controls */}
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 bg-chill-card/50 rounded-lg border border-white/5 hover:bg-white/5 disabled:opacity-50"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  
                  <div className="w-48">
                    <input
                      type="range"
                      min="1"
                      max={totalPages}
                      value={sliderValue}
                      onChange={handleSliderChange}
                      onMouseDown={handleSliderStart}
                      onMouseUp={handleSliderEnd}
                      onTouchStart={handleSliderStart}
                      onTouchEnd={handleSliderEnd}
                      className="w-full h-1.5 bg-chill-card rounded-full appearance-none cursor-pointer"
                      style={{
                        background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${(sliderValue / totalPages) * 100}%, #1f2937 ${(sliderValue / totalPages) * 100}%, #1f2937 100%)`
                      }}
                    />
                  </div>
                  
                  <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 bg-chill-card/50 rounded-lg border border-white/5 hover:bg-white/5 disabled:opacity-50"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={saveProgress}
                    disabled={isSaving}
                    className="p-2 bg-chill-card/50 rounded-lg border border-white/5 hover:bg-white/5"
                    title="Save Progress"
                  >
                    {isSaving ? <Loader2 size={18} className="animate-spin" /> : <BookOpen size={18} />}
                  </button>
                  <button
                    onClick={toggleFullscreen}
                    className="p-2 bg-chill-card/50 rounded-lg border border-white/5 hover:bg-white/5"
                    title="Exit Fullscreen"
                  >
                    <Minimize2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Fullscreen Enter Button (floating) */}
        {!isFullscreen && (
          <div className="fixed bottom-6 right-6 z-40">
            <button
              onClick={toggleFullscreen}
              className="flex items-center gap-2 px-4 py-2 bg-chill-card rounded-xl font-bold border border-white/5 hover:bg-white/5 transition-colors shadow-xl"
            >
              <Maximize2 size={18} />
              Fullscreen
            </button>
          </div>
        )}

        {/* Reading Content (fullscreen optimized) */}
        <div 
          className={`${isFullscreen ? 'h-full overflow-auto' : ''}`}
          onClick={isFullscreen ? showDockTemporarily : undefined}
        >
          <ReaderContent 
            content={content}
            loading={loadingContent}
            error={contentError}
            fontSize={fontSize}
            lineHeight={lineHeight}
            containerRef={readingContainerRef}
            isFullscreen={isFullscreen}
          />
        </div>

        {/* Regular Layout (non-fullscreen) */}
        {!isFullscreen && (
          <>
            {/* Page Navigation Section - Below Content */}
            <div className="bg-chill-surface rounded-[30px] p-6 mb-8 shadow-2xl border border-white/5">
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-lg font-bold text-white">Page Navigation</div>
                  <button
                    onClick={toggleFullscreen}
                    className="flex items-center gap-2 px-4 py-2 bg-chill-card rounded-xl font-bold border border-white/5 hover:bg-white/5 transition-colors"
                  >
                    <Maximize2 size={18} />
                    Fullscreen
                  </button>
                </div>
                
                {/* Page Slider - Fixed */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-400">Page {currentPage} of {totalPages}</span>
                    <span className="text-sm font-bold text-chill-blue">{progress}%</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max={totalPages}
                    value={sliderValue}
                    onChange={handleSliderChange}
                    onMouseDown={handleSliderStart}
                    onMouseUp={handleSliderEnd}
                    onTouchStart={handleSliderStart}
                    onTouchEnd={handleSliderEnd}
                    className="w-full h-2 bg-chill-card rounded-lg appearance-none cursor-pointer slider"
                    style={{
                      background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${(sliderValue / totalPages) * 100}%, #1f2937 ${(sliderValue / totalPages) * 100}%, #1f2937 100%)`
                    }}
                  />
                  <div className="text-xs text-gray-500 mt-1 text-center">
                    {isDragging ? `Slide to page ${sliderValue}` : `Current: ${currentPage}`}
                  </div>
                </div>
                
                {/* Go to Page Input */}
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <label className="block text-sm text-gray-400 mb-2">Go to Page</label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        min="1"
                        max={totalPages}
                        value={goToPageInput}
                        onChange={(e) => setGoToPageInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleGoToPageInput()}
                        placeholder="Enter page number"
                        className="flex-1 px-4 py-2 bg-chill-card border border-white/5 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-chill-blue"
                      />
                      <button
                        onClick={handleGoToPageInput}
                        className="px-6 py-2 bg-chill-blue text-white rounded-xl font-bold hover:bg-blue-600 transition-colors"
                      >
                        Go
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Quick Page Navigation Buttons */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => goToPage(1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-chill-card rounded-xl font-bold border border-white/5 hover:bg-white/5 disabled:opacity-50 transition-colors"
                  >
                    First
                  </button>
                  <button
                    onClick={() => goToPage(currentPage - 10)}
                    disabled={currentPage <= 10}
                    className="px-4 py-2 bg-chill-card rounded-xl font-bold border border-white/5 hover:bg-white/5 disabled:opacity-50 transition-colors"
                  >
                    -10
                  </button>
                  <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-chill-card rounded-xl font-bold border border-white/5 hover:bg-white/5 disabled:opacity-50 transition-colors"
                  >
                    ←
                  </button>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{currentPage}</div>
                  <div className="text-sm text-gray-400">Current Page</div>
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-chill-card rounded-xl font-bold border border-white/5 hover:bg-white/5 disabled:opacity-50 transition-colors"
                  >
                    →
                  </button>
                  <button
                    onClick={() => goToPage(currentPage + 10)}
                    disabled={currentPage > totalPages - 10}
                    className="px-4 py-2 bg-chill-card rounded-xl font-bold border border-white/5 hover:bg-white/5 disabled:opacity-50 transition-colors"
                  >
                    +10
                  </button>
                  <button
                    onClick={() => goToPage(totalPages)}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-chill-card rounded-xl font-bold border border-white/5 hover:bg-white/5 disabled:opacity-50 transition-colors"
                  >
                    Last
                  </button>
                </div>
              </div>
            </div>

            <QuickActions 
              onAction={handleBookshelfAction} 
              onDownload={downloadBook} 
            />

            <ReaderSettings 
              fontSize={fontSize} setFontSize={setFontSize}
              lineHeight={lineHeight} setLineHeight={setLineHeight}
              wordsPerPage={wordsPerPage} setWordsPerPage={setWordsPerPage}
            />

            {message && (
              <div className={`p-4 rounded-xl mb-8 ${
                message.includes('✓') 
                  ? 'bg-green-500/10 border border-green-500/20 text-green-400'
                  : message.includes('Error')
                    ? 'bg-red-500/10 border border-red-500/20 text-red-400'
                    : 'bg-blue-500/10 border border-blue-500/20 text-blue-400'
              }`}>
                <div className="flex items-center gap-2">
                  {message.includes('✓') && <CheckCircle size={18} />}
                  {message}
                </div>
              </div>
            )}

            <BookInfoDetails book={book} />
          </>
        )}
      </div>

      {/* Slider CSS */}
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
        }
        .slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
        }
      `}</style>
    </div>
  );
};

export default BookReaderPage;