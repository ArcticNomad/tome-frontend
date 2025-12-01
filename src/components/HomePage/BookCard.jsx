// src/components/HomePage/BookCard.jsx
import React, { useState, useEffect } from 'react';
import { Heart, ShoppingBag, Download, Bookmark, Plus, Check } from 'lucide-react';
import StarRating from './StarRating';
import { useUserProfile } from '../../hooks/useUserProfile';
import { useAuth } from '../../hooks/useAuth';
import { Link } from 'react-router-dom';

const BookCard = ({ book }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [showBookshelfMenu, setShowBookshelfMenu] = useState(false);
  const [isInBookshelf, setIsInBookshelf] = useState('');
  const [imageSrc, setImageSrc] = useState(book.coverImageUrl || 'https://tome-frontend-arc.vercel.app/placeholder-book.jpg');
  
  const { currentUser } = useAuth();
  const { 
    addToBookshelf, 
    toggleFavorite, 
    profile,
    getBookStatus 
  } = useUserProfile();

  // Check if book is in any bookshelf
  useEffect(() => {
    let isMounted = true;

    const checkStatus = async () => {
      if (!currentUser || !book._id) return;
      
      try {
        const status = await getBookStatus(book._id);
        if (isMounted && status) {
          setIsInBookshelf(status);
        }
      } catch (error) {
        console.error('Error checking bookshelf status:', error);
      }
   };

    checkStatus();

    return () => { isMounted = false; };
  }, [currentUser, book._id]);

  // Handle case where the book prop might change
  useEffect(() => {
    setImageSrc(book.coverImageUrl || 'https://tome-frontend-arc.vercel.app/placeholder-book.jpg');
  }, [book.coverImageUrl]);

  const handleError = () => {
    setImageSrc('https://tome-frontend-arc.vercel.app/placeholder-book.jpg');
  };

  const handleAddToBookshelf = async (shelfType) => {
    if (!currentUser) {
      // Redirect to login or show login modal
      window.location.href = '/login';
      return;
    }

    try {
      await addToBookshelf(book._id, shelfType, book.gutenbergId);
      setIsInBookshelf(shelfType);
      setShowBookshelfMenu(false);
      // Show success toast
      showToast(`Added to ${getShelfName(shelfType)}!`);
    } catch (error) {
      console.error('Error adding to bookshelf:', error);
      showToast('Failed to add to bookshelf', 'error');
    }
  };

  const handleToggleFavorite = async (e) => {
    e.stopPropagation();
    if (!currentUser) {
      window.location.href = '/login';
      return;
    }

    try {
      await toggleFavorite(book._id);
      setIsLiked(!isLiked);
      showToast(isLiked ? 'Removed from favorites' : 'Added to favorites!');
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const handleRemoveFromBookshelf = async () => {
    try {
      // You'll need to implement this endpoint in your backend
      const response = await fetch(`/api/users/bookshelves/${isInBookshelf}/${book._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${await currentUser.getIdToken()}`
        }
      });

      if (response.ok) {
        setIsInBookshelf('');
        showToast('Removed from bookshelf');
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

  const showToast = (message, type = 'success') => {
    // Implement your toast notification system
    console.log(`${type}: ${message}`);
  };

  // Handle MongoDB data structure
  const bookTitle = book.title || 'Untitled';
  const bookAuthor = book.author || 'Unknown Author';
  const bookId = book.gutenbergId || book._id;
  const downloadCount = book.downloadCount || 0;
  
  // Generate rating based on download count for demo
  const rating = Math.min(5, 3 + (downloadCount / 10000) * 2).toFixed(1);

  return (
    <div className="flex flex-col group relative cursor-pointer hover:border-stone-600 rounded-2xl p-2 transition-all duration-300 border border-transparent">
      
      {/* Cover Image Container */}
      <div className="border-2 border-black relative rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 mb-2 aspect-[2/3]">
        
        <img 
          src={imageSrc} 
          alt={bookTitle} 
          onError={handleError}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Status Badge based on download count */}
        {downloadCount > 50000 && (
          <span className="absolute top-2 left-2 bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide">
            Popular
          </span>
        )}

        {/* Bookshelf Status Badge */}
        {isInBookshelf && (
          <span className="absolute top-2 right-2 bg-blue-500 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide">
            {isInBookshelf === 'read' ? 'Read' : isInBookshelf === 'currentlyReading' ? 'Reading' : 'Want'}
          </span>
        )}

        {/* Hover Overlay Actions */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-3">
            
            {/* Top Right: Like & Bookshelf Buttons */}
            <div className="flex justify-between">
              {/* Bookshelf Button */}
              <div className="relative">
                <button 
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    setShowBookshelfMenu(!showBookshelfMenu);
                  }}
                  className="bg-white/90 p-1.5 rounded-full hover:bg-white text-gray-700 hover:text-blue-500 transition-colors"
                >
                  {isInBookshelf ? (
                    <Bookmark size={16} fill="currentColor" className="text-blue-500" />
                  ) : (
                    <Plus size={16} />
                  )}
                </button>

                {/* Bookshelf Dropdown Menu */}
                {showBookshelfMenu && (
                  <div className="absolute left-0 top-full mt-2 w-auto bg-white rounded-lg shadow-lg z-50 py-2">
                    <div className="px-4 py-2 text-xs text-gray-500 font-medium border-b">
                      Add to Bookshelf
                    </div>
                    {['currentlyReading', 'wantToRead', 'read'].map((shelf) => (
                      <button
                        key={shelf}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToBookshelf(shelf);
                        }}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center justify-between"
                      >
                        <span>{getShelfName(shelf)}</span>
                        {isInBookshelf === shelf && (
                          <Check size={14} className="text-green-500" />
                        )}
                      </button>
                    ))}
                    {isInBookshelf && (
                      <>
                        <div className="border-t my-1"></div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveFromBookshelf();
                            setShowBookshelfMenu(false);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                        >
                          Remove from Bookshelf
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Favorite Button */}
              <button 
                onClick={handleToggleFavorite}
                className="bg-white/90 p-1.5 rounded-full hover:bg-white text-gray-700 hover:text-red-500 transition-colors"
              >
                <Heart 
                  size={16} 
                  fill={isLiked || (profile?.favoriteBooks?.includes(book._id)) ? "currentColor" : "none"} 
                  className={(isLiked || profile?.favoriteBooks?.includes(book._id)) ? "text-red-500" : ""} 
                />
              </button>
            </div>

            {/* Bottom: Quick Action Button */}
            <div className="flex flex-col gap-2">
              <Link
                to={`/book/${bookId}`}
                className="w-full bg-white/90 py-2 rounded-lg text-xs font-bold text-gray-900 hover:bg-white flex items-center justify-center gap-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-300"
              >
                <ShoppingBag size={14} /> View Details
              </Link>
              
              {/* Download count */}
              {downloadCount > 0 && (
                <div className="flex items-center justify-center gap-1 text-white text-xs bg-black/50 rounded px-2 py-1">
                  <Download size={10} />
                  <span>{downloadCount.toLocaleString()} downloads</span>
                </div>
              )}
            </div>
        </div>
      </div>

      {/* Book Metadata */}
      <div className="flex-1">
        <h3 className="font-bold text-gray-800 text-sm line-clamp-2 group-hover:text-purple-600 transition-colors mb-1 min-h-[2.5rem]">
          {bookTitle}
        </h3>
        <p className="text-xs text-gray-500 mb-1 line-clamp-1">{bookAuthor}</p>
        
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
              className="flex-1 text-xs bg-red-50 text-red-600 hover:bg-red-100 py-1.5 rounded-lg transition-colors"
            >
              Remove
            </button>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (currentUser) {
                  handleAddToBookshelf('wantToRead');
                } else {
                  window.location.href = '/login';
                }
              }}
              className="flex-1 text-xs bg-blue-50 text-blue-600 hover:bg-blue-100 py-1.5 rounded-lg transition-colors"
            >
              Save
            </button>
          )}
          
          {book.downloadLinks?.length > 0 && (
            <Link
              to={`/read/${bookId}`}
              className="flex-1 text-xs bg-green-50 text-green-600 hover:bg-green-100 py-1.5 rounded-lg transition-colors text-center"
            >
              Read
            </Link>
          )}
        </div>
        
        {/* Subjects/Tags */}
        {book.subjects && book.subjects.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {book.subjects.slice(0, 2).map((subject, index) => (
              <span key={index} className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
                {subject.split(' -- ')[0]}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Close bookshelf menu when clicking outside */}
      {showBookshelfMenu && (
        <div 
          className="fixed inset-0 z-40"
          onClick={() => setShowBookshelfMenu(false)}
        />
      )}
    </div>
  );
};

export default BookCard;