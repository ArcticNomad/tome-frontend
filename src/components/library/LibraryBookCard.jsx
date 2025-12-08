import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, Star, ArrowUpRight, Book, X,
  MoreVertical, Trash2, Check, Bookmark
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useUserProfile } from '../../hooks/useUserProfile';
const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.DEV ? 'http://localhost:5000/api' : 'https://tome-backend-production-5402.up.railway.app/api');


const LibraryBookCard = ({ book, shelf, onBookRemoved }) => {
  const [showRemoveMenu, setShowRemoveMenu] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  
  const { currentUser } = useAuth();
  const { profile } = useUserProfile();

  // Enhanced styling based on shelf type with hover glow effects
  const getShelfStyles = (shelfType) => {
    switch(shelfType) {
      case 'currentlyReading': 
        return {
          badge: 'bg-chill-sage/20 text-chill-sage border-chill-sage/20 backdrop-blur-md',
          glow: 'group-hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] group-hover:shadow-chill-sage/10 group-hover:border-chill-sage/30',
          textHover: 'group-hover:text-chill-sage',
          iconBg: 'bg-chill-sage text-black',
          removeBtn: 'text-chill-sage hover:bg-chill-sage/10'
        };
      case 'wantToRead': 
        return {
          badge: 'bg-chill-lavender/20 text-chill-lavender border-chill-lavender/20 backdrop-blur-md',
          glow: 'group-hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] group-hover:shadow-chill-lavender/10 group-hover:border-chill-lavender/30',
          textHover: 'group-hover:text-chill-lavender',
          iconBg: 'bg-chill-lavender text-black',
          removeBtn: 'text-chill-lavender hover:bg-chill-lavender/10'
        };
      case 'read': 
        return {
          badge: 'bg-purple-400/20 text-purple-400 border-purple-400/20 backdrop-blur-md',
          glow: 'group-hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] group-hover:shadow-purple-400/10 group-hover:border-purple-400/30',
          textHover: 'group-hover:text-purple-400',
          iconBg: 'bg-purple-400 text-black',
          removeBtn: 'text-purple-400 hover:bg-purple-400/10'
        };
      default: 
        return {
          badge: 'bg-gray-800/80 text-gray-300 border-white/10 backdrop-blur-md',
          glow: 'group-hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] group-hover:border-white/20',
          textHover: 'group-hover:text-white',
          iconBg: 'bg-white text-black',
          removeBtn: 'text-gray-400 hover:bg-white/5'
        };
    }
  };

  const getShelfLabel = (shelfType) => {
    switch(shelfType) {
      case 'currentlyReading': return 'Reading';
      case 'wantToRead': return 'Saved';
      case 'read': return 'Finished';
      default: return 'Library';
    }
  };

  const styles = getShelfStyles(shelf);
  const bookId = book.gutenbergId || book._id;
  const bookLink = bookId ? `/book/${bookId}` : '#';

  // Format downloads for cleaner display (e.g. 1.2k)
  const formatDownloads = (count) => {
    if (!count) return 0;
    return count > 999 ? (count/1000).toFixed(1) + 'k' : count;
  };
const handleRemoveFromBookshelf = async (e) => {
  e.preventDefault();
  e.stopPropagation();

  if (!currentUser || !bookId) {
    console.log('Please sign in to remove books');
    return;
  }

  if (isRemoving) return;

  setIsRemoving(true);
  setShowRemoveMenu(false);

  try {
    const token = await currentUser.getIdToken();

    // Determine the correct API endpoint based on shelf
    let backendShelf = shelf;
    if (shelf === 'currentlyReading') backendShelf = 'currently-reading';
    if (shelf === 'wantToRead') backendShelf = 'want-to-read';

    // FIX: Use backendShelf instead of shelfEndpoint
   const response = await fetch(`${API_BASE_URL}/users/bookshelves/${backendShelf}/${bookId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      const data = await response.json();
      console.log('Book removed from shelf:', data.message);

      // Call the callback function to update parent state
      if (onBookRemoved) {
        onBookRemoved(bookId, shelf);
      }

      // Show success feedback (you could add a toast notification here)
    } else {
      const errorData = await response.json();
      console.error('Failed to remove book:', errorData.message);
    }
  } catch (error) {
    console.error('Error removing book from shelf:', error);
  } finally {
    setIsRemoving(false);
  }
};

  const toggleRemoveMenu = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowRemoveMenu(!showRemoveMenu);
  };

  // Close menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (e) => {
      if (showRemoveMenu && !e.target.closest('.remove-menu')) {
        setShowRemoveMenu(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showRemoveMenu]);

  return (
    <div className="group relative h-full">
      <Link to={bookLink} className="block h-full">
        <div className={`
          relative h-full flex flex-col
          bg-chill-card border border-white/5 rounded-2xl 
          overflow-hidden
          transition-all duration-500 ease-out
          hover:-translate-y-2
          ${styles.glow}
        `}>
          
          {/* Image Container */}
          <div className="relative aspect-[2/3] overflow-hidden bg-gray-900">
            {/* Shelf Badge - Floating inside image */}
            <div className="absolute top-3 right-3 z-20 flex items-center gap-2">
              <span className={`
                px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full 
                border shadow-sm flex items-center gap-1.5
                ${styles.badge}
              `}>
                <span className={`w-1.5 h-1.5 rounded-full ${shelf === 'currentlyReading' ? 'animate-pulse bg-current' : 'bg-current'}`}></span>
                {getShelfLabel(shelf)}
              </span>

              {/* Remove Menu Button */}
              <div className="relative remove-menu">
                <button
                  onClick={toggleRemoveMenu}
                  className={`
                    p-2 rounded-full opacity-100 bg-white group-hover:opacity-100 cursor-pointer 
                    transition-all duration-300 hover:bg-chill-card
                    ${isRemoving ? 'animate-pulse' : ''}
                  `}
                  disabled={isRemoving}
                >
                  {isRemoving ? (
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <MoreVertical size={14} className="text-gray-400" />
                  )}
                </button>

                {/* Remove Menu Dropdown */}
                {showRemoveMenu && (
                  <div className="absolute right-0 top-full mt-1 w-48 bg-chill-surface border border-white/10 rounded-xl shadow-xl z-50 py-2 overflow-hidden">
                    <div className="px-4 py-2 text-xs text-gray-400 font-medium border-b border-white/5">
                      Book Options
                    </div>
                    
                    <button
                      onClick={handleRemoveFromBookshelf}
                      className={`
                        w-full text-left px-4 py-3 text-sm flex items-center gap-3
                        hover:bg-white/5 transition-colors
                        ${styles.removeBtn}
                      `}
                    >
                      <Trash2 size={14} />
                      Remove from {getShelfLabel(shelf)}
                    </button>

                    {/* Move to other shelves options */}
                    <div className="border-t border-white/5 my-1"></div>
                    <div className="px-3 py-1 text-[10px] uppercase tracking-widest text-gray-500">
                      Move to
                    </div>
                    
                    {['currentlyReading', 'wantToRead', 'read']
                      .filter(s => s !== shelf)
                      .map((targetShelf) => (
                        <button
                          key={targetShelf}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            // You can add move functionality here
                            console.log(`Move to ${targetShelf}`);
                            setShowRemoveMenu(false);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-white/5 flex items-center justify-between"
                        >
                          <span>{getShelfLabel(targetShelf)}</span>
                          <ArrowUpRight size={12} className="text-gray-500" />
                        </button>
                      ))}
                  </div>
                )}
              </div>
            </div>

            {book.coverImageUrl ? (
              <>
                <img 
                  src={book.coverImageUrl} 
                  alt={book.title}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.classList.add('flex', 'items-center', 'justify-center');
                  }}
                />
                
                {/* Hover Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Hover Action Button */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                   <div className={`
                     w-12 h-12 rounded-full border-2 border-white/20 shadow-xl
                     flex items-center justify-center transform scale-50 group-hover:scale-100 
                     transition-transform duration-300 backdrop-blur-sm
                     ${styles.iconBg}
                   `}>
                     <ArrowUpRight size={24} strokeWidth={2.5} />
                   </div>
                </div>
              </>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-gray-600 gap-3 bg-chill-surface">
                <div className="p-4 rounded-full bg-white/5">
                  <Book size={32} strokeWidth={1.5} />
                </div>
                <span className="text-xs font-medium uppercase tracking-widest opacity-50">No Cover</span>
              </div>
            )}
          </div>
          
          {/* Content Section */}
          <div className="flex-1 p-5 flex flex-col">
            <div className="flex-1 min-h-[80px]">
              <h3 className={`
                font-bold text-lg leading-snug mb-1.5 line-clamp-2 transition-colors duration-300
                text-white ${styles.textHover}
              `}>
                {book.title || 'Untitled Book'}
              </h3>
              
              <p className="text-sm text-gray-400 font-medium mb-3 line-clamp-1 flex items-center gap-2">
                <span className="w-4 h-[1px] bg-gray-600/50"></span>
                {book.author || 'Unknown Author'}
              </p>

              {/* Genre Pills */}
              <div className="flex flex-wrap gap-1.5 mb-2">
                {book.subjects && Array.isArray(book.subjects) && book.subjects.slice(0, 2).map((subject, idx) => (
                  <span 
                    key={idx} 
                    className="px-2 py-0.5 bg-white/5 border border-white/5 rounded text-[10px] font-medium text-gray-400 group-hover:border-white/10 group-hover:bg-white/10 transition-colors"
                  >
                    {typeof subject === 'string' ? subject.split(',')[0].trim() : 'Genre'}
                  </span>
                ))}
              </div>
            </div>
            
            {/* Footer Stats */}
            <div className="pt-3 mt-auto border-t border-white/5 flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center gap-1.5 group-hover:text-yellow-400/90 transition-colors">
                <Star size={13} className="fill-current text-current" />
                <span>{formatDownloads(book.downloadCount)}</span>
              </div>
              
              <span className={`flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-2 group-hover:translate-x-0 ${styles.textHover}`}>
                Details <ArrowUpRight size={12} />
              </span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default LibraryBookCard;