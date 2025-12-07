import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Star } from 'lucide-react';

const LibraryBookListItem = ({ book, shelf,onBookRemoved }) => {
  const getShelfColor = (shelfType) => {
    switch(shelfType) {
      case 'currentlyReading': return 'border-l-chill-sage';
      case 'wantToRead': return 'border-l-chill-lavender';
      case 'read': return 'border-l-purple-400';
      default: return 'border-l-gray-600';
    }
  };

  const bookId = book.gutenbergId || book._id;
  const bookLink = bookId ? `/book/${bookId}` : '#';

  return (
    <div className={`bg-chill-card border border-white/5 rounded-xl border-l-4 ${getShelfColor(shelf)}`}>
      <Link to={bookLink}>
        <div className="p-4 hover:bg-white/2 transition-colors">
          <div className="flex items-start gap-4">
            {/* Book cover */}
            <div className="w-16 flex-shrink-0">
              <div className="aspect-[3/4] rounded overflow-hidden bg-gray-800">
                {book.coverImageUrl ? (
                  <img 
                    src={book.coverImageUrl} 
                    alt={book.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <BookOpen className="w-8 h-8 text-gray-600" />
                  </div>
                )}
              </div>
            </div>
            
            {/* Book details */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-bold text-white mb-1 line-clamp-1 hover:text-chill-sage transition-colors">
                    {book.title || 'Untitled Book'}
                  </h3>
                  <p className="text-sm text-gray-400 mb-2 line-clamp-1">
                    {book.author || 'Unknown Author'}
                  </p>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {book.subjects && Array.isArray(book.subjects) && book.subjects.slice(0, 3).map((subject, idx) => (
                      <span key={idx} className="px-2 py-0.5 bg-white/5 rounded text-xs text-gray-400">
                        {typeof subject === 'string' ? subject.split(',')[0].trim() : 'Genre'}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="flex flex-col items-end gap-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    shelf === 'currentlyReading' ? 'bg-chill-sage/20 text-chill-sage' :
                    shelf === 'wantToRead' ? 'bg-chill-lavender/20 text-chill-lavender' :
                    'bg-purple-400/20 text-purple-400'
                  }`}>
                    {shelf === 'currentlyReading' ? 'Reading Now' : 
                     shelf === 'wantToRead' ? 'Want to Read' : 'Finished'}
                  </span>
                  <div className="text-xs text-gray-500 flex items-center gap-1">
                    <Star size={10} className="fill-yellow-400 text-yellow-400" />
                    {book.downloadCount ? book.downloadCount.toLocaleString() : 0}
                  </div>
                </div>
              </div>
              
              {/* Progress indicator for currently reading */}
              {shelf === 'currentlyReading' && (
                <div className="mt-3 flex items-center gap-2 text-xs text-gray-400">
                  <div className="w-2 h-2 bg-chill-sage rounded-full animate-pulse"></div>
                  <span>Currently reading</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default LibraryBookListItem;