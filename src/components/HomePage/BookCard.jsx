// frontend/src/components/BookCard.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Download, Bookmark, Plus, Check, Star } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useUserProfile } from '../../hooks/useUserProfile';

// --- StarRating Component ---
const StarRating = ({ rating = 0 }) => {
  return (
    <div className="flex items-center gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star 
          key={i} 
          size={12} 
          className={
            i < Math.round(rating) 
              ? "fill-[#D4E09B] text-[#D4E09B]" 
              : "text-gray-600"
          } 
        />
      ))}
      <span className="text-xs text-gray-500 ml-1">{rating.toFixed(1)}</span>
    </div>
  );
};

// --- Main BookCard Component ---
const BookCard = ({ book = {}, onBookshelfUpdate }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [showBookshelfMenu, setShowBookshelfMenu] = useState(false);
  const [isInBookshelf, setIsInBookshelf] = useState('');
  const [imageSrc, setImageSrc] = useState('');
  
  const { currentUser } = useAuth();
  const { 
    addToBookshelf, 
    toggleFavorite, 
    profile,
    getBookStatus,
    removeFromBookshelf
  } = useUserProfile();

  // Set initial image source

useEffect(() => {
  if (book?.coverImageUrl && typeof book.coverImageUrl === 'string' && book.coverImageUrl.trim() !== '') {
    setImageSrc(book.coverImageUrl);
  } else {
    setImageSrc('https://via.placeholder.com/300x450?text=No+Cover');
  }
}, [book]);


  // Check if book is in any bookshelf
  useEffect(() => {
    let isMounted = true;

    const checkBookshelfStatus = async () => {
      if (!currentUser || !book?._id) {
        setIsInBookshelf('');
        return;
      }
      
      try {
        const status = await getBookStatus(book._id);
        if (isMounted && status) {
          setIsInBookshelf(status);
        }
      } catch (error) {
        console.error('Error checking bookshelf status:', error);
      }
   };

    checkBookshelfStatus();

    return () => { isMounted = false; };
  }, [currentUser, book?._id]);

  // Check if book is liked/favorited
  useEffect(() => {
    if (profile?.favoriteBooks && book?._id) {
      setIsLiked(profile.favoriteBooks.includes(book._id));
    }
  }, [profile, book?._id]);

  const handleImageError = () => {
    setImageSrc('https://via.placeholder.com/300x450?text=Error+Loading+Image');
  };

  const handleAddToBookshelf = async (shelfType) => {
    if (!currentUser) {
      console.log('Please sign in to add books to your library');
      return;
    }
    
    if (!book?._id) {
      console.error('No book ID provided');
      return;
    }

    try {
      const result = await addToBookshelf(book._id, shelfType, book.gutenbergId);
      
      if (result.success) {
        setIsInBookshelf(shelfType);
        setShowBookshelfMenu(false);
        
        // Call callback if provided
        if (onBookshelfUpdate) {
          onBookshelfUpdate(book._id, shelfType);
        }
        
        console.log(`Added to ${getShelfName(shelfType)}!`);
      } else {
        console.error('Failed to add to bookshelf:', result.message);
      }
    } catch (error) {
      console.error('Error adding to bookshelf:', error);
    }
  };

  const handleToggleFavorite = async (e) => {
    e.stopPropagation();
    
    if (!currentUser) {
      console.log('Please sign in to add favorites');
      return;
    }
    
    if (!book?._id) {
      console.error('No book ID provided');
      return;
    }

    try {
      await toggleFavorite(book._id);
      setIsLiked(!isLiked);
      console.log(isLiked ? 'Removed from favorites' : 'Added to favorites!');
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

 const handleRemoveFromBookshelf = async (e) => {
  e?.stopPropagation();
  
  if (!currentUser || !book?._id) {
    console.log('No user or book ID');
    return;
  }
  
  if (!isInBookshelf) {
    console.log('Book is not in any bookshelf');
    return;
  }
  
  try {
    // Use gutenbergId (backend expects this based on logs)
    const bookIdToRemove = book.gutenbergId || book._id;
    
    // Call the API
    const result = await removeFromBookshelf(bookIdToRemove, isInBookshelf);
    
    if (result.success) {
      // Update local state
      setIsInBookshelf('');
      setShowBookshelfMenu(false);
      
      // Call callback if provided
      if (onBookshelfUpdate) {
        onBookshelfUpdate(bookIdToRemove, isInBookshelf);
      }
      
      console.log('Book removed from bookshelf');
    } else {
      console.error('Failed to remove book:', result.message);
    }
  } catch (error) {
    console.error('Error removing from bookshelf:', error);
  }
};

  const getShelfName = (shelfType) => {
    const names = {
      'currentlyReading': 'Currently Reading',
      'wantToRead': 'Want to Read',
      'read': 'Read'
    };
    return names[shelfType] || shelfType;
  };

  // Close bookshelf menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (showBookshelfMenu && !e.target.closest('.bookshelf-menu')) {
        setShowBookshelfMenu(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showBookshelfMenu]);

  if (!book) {
    return (
      <div className="flex flex-col rounded-2xl p-2 w-full max-w-[200px] animate-pulse">
        <div className="bg-gray-700 rounded-xl aspect-[2/3] mb-2"></div>
        <div className="h-4 bg-gray-700 rounded mb-1"></div>
        <div className="h-3 bg-gray-700 rounded mb-2"></div>
      </div>
    );
  }

  const {
    _id,
    title = 'Untitled',
    author = 'Unknown Author',
    gutenbergId,
    downloadCount = 0,
    subjects = [],
    downloadLinks = []
  } = book;

  const bookId = gutenbergId || _id;
  const rating = Math.min(5, 3 + (downloadCount / 10000) * 2).toFixed(1);

  return (
    <div className="flex flex-col group relative hover:border-[#D4E09B]/30 rounded-2xl p-2 transition-all duration-300 border border-transparent w-full max-w-[200px]">
      
      {/* Cover Image Container */}
      <div className="border-2 border-white/5 relative rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 mb-2 aspect-[2/3]">
        
          <img 
          src={imageSrc || 'https://via.placeholder.com/300x450?text=No+Cover'} 
          alt={title} 
          onError={handleImageError}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Status Badge based on download count */}
        {downloadCount > 50000 && (
          <span className="absolute top-2 left-2 bg-[#D4E09B] text-black text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide shadow-md">
            Popular
          </span>
        )}

        {/* Bookshelf Status Badge */}
        {isInBookshelf && (
          <span className="absolute top-2 right-2 bg-[#9CAFB7] text-black text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide shadow-md">
            {isInBookshelf === 'read' ? 'Read' : 
             isInBookshelf === 'currentlyReading' ? 'Reading' : 'Want'}
          </span>
        )}

        {/* Hover Overlay Actions */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#191A19]/90 via-[#191A19]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-3">
            
            {/* Top Right: Like & Bookshelf Buttons */}
            <div className="flex justify-between">
              {/* Bookshelf Button */}
              <div className="relative bookshelf-menu">
                <button 
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    setShowBookshelfMenu(!showBookshelfMenu);
                  }}
                  className="bg-[#191A19]/90 p-1.5 rounded-full hover:bg-[#202425] text-white hover:text-[#9CAFB7] transition-colors border border-white/10"
                >
                  {isInBookshelf ? (
                    <Bookmark size={16} fill="currentColor" className="text-[#9CAFB7]" />
                  ) : (
                    <Plus size={16} />
                  )}
                </button>

                {/* Bookshelf Dropdown Menu */}
                {showBookshelfMenu && (
                  <div className="absolute left-0 top-full mt-2 w-40 bg-[#202425] border border-white/10 rounded-lg shadow-xl z-50 py-2">
                    <div className="px-4 py-2 text-xs text-gray-400 font-medium border-b border-white/5">
                      Add to Bookshelf
                    </div>
                    {['currentlyReading', 'wantToRead', 'read'].map((shelf) => (
                      <button
                        key={shelf}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToBookshelf(shelf);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-white/5 flex items-center justify-between gap-3"
                      >
                        <span>{getShelfName(shelf)}</span>
                        {isInBookshelf === shelf && (
                          <Check size={14} className="text-[#D4E09B]" />
                        )}
                      </button>
                    ))}
                    {isInBookshelf && (
                      <>
                        <div className=" cursor-pointer border-t border-white/5 my-1"></div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveFromBookshelf();
                            setShowBookshelfMenu(false);
                          }}
                          className="cursor-pointer w-full text-left px-4 py-2 text-sm text-[#D4A5A5] hover:bg-[#D4A5A5]/10"
                        >
                          Remove
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Favorite Button */}
              <button 
                onClick={handleToggleFavorite}
                className="bg-[#191A19]/90 p-1.5 rounded-full hover:bg-[#202425] text-white hover:text-[#D4A5A5] transition-colors border border-white/10"
              >
                <Heart 
                  size={16} 
                  fill={isLiked ? "currentColor" : "none"} 
                  className={isLiked ? "text-[#D4A5A5]" : ""} 
                />
              </button>
            </div>

            {/* Bottom: Quick Action Button */}
            <div className="flex flex-col gap-2">
              <Link
                to={`/book/${bookId}`}
                className="w-full bg-[#D4E09B] py-2 rounded-lg text-xs font-bold text-black hover:bg-[#c5d38a] flex items-center justify-center gap-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-300 shadow-lg"
              >
                <ShoppingBag size={14} /> View Details
              </Link>
              
              {/* Download count */}
              {downloadCount > 0 && (
                <div className="flex items-center justify-center gap-1 text-white/80 text-xs bg-black/60 rounded px-2 py-1 backdrop-blur-sm">
                  <Download size={10} />
                  <span>{downloadCount.toLocaleString()}</span>
                </div>
              )}
            </div>
        </div>
      </div>

      {/* Book Metadata */}
      <div className="flex-1">
        <Link to={`/book/${bookId}`}>
          <h3 className="font-bold text-white text-sm line-clamp-2 group-hover:text-[#D4E09B] transition-colors mb-1 min-h-[2.5rem]">
            {title}
          </h3>
        </Link>
        <p className="text-xs text-gray-400 mb-1 line-clamp-1">{author}</p>
        
        {/* Star Ratings */}
        <StarRating rating={parseFloat(rating)} />
        
        {/* Quick Action Buttons */}
        <div className="flex gap-2 mt-2">
          {isInBookshelf ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleRemoveFromBookshelf();
              }}
              className="flex-1 text-xs bg-[#D4A5A5]/10 text-[#D4A5A5] hover:bg-[#D4A5A5]/20 py-1.5 rounded-lg transition-colors border border-[#D4A5A5]/20"
            >
              Remove
            </button>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleAddToBookshelf('wantToRead');
              }}
              className="cursor-pointer flex-1 text-xs bg-[#9CAFB7]/10 text-[#9CAFB7] hover:bg-[#9CAFB7]/20 py-1.5 rounded-lg transition-colors border border-[#9CAFB7]/20"
            >
              Save
            </button>
          )}
          
          {downloadLinks?.length > 0 && (
            <Link
              to={`/read/${bookId}`}
              className="flex-1 text-xs bg-[#D4E09B]/10 text-[#D4E09B] hover:bg-[#D4E09B]/20 py-1.5 rounded-lg transition-colors text-center border border-[#D4E09B]/20"
            >
              Read
            </Link>
          )}
        </div>
        
        {/* Subjects/Tags */}
        {subjects.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {subjects.slice(0, 2).map((subject, index) => (
              <span key={index} className="text-[10px] bg-[#2a2525] text-gray-400 px-1.5 py-0.5 rounded border border-white/5">
                {typeof subject === 'string' ? subject.split(' -- ')[0] : 'Tag'}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookCard;