import React from 'react';
import { ArrowLeft } from 'lucide-react';

const ReaderHeader = ({ book, bookStatus, currentUser, onBack }) => {

  // Helper function to format book status
  const formatStatus = (status) => {
    switch (status) {
      case 'Currently Reading':
        return 'Reading Now';
      case 'Want to Read':
        return 'Want to Read';
      case 'Read':
        return 'Finished';
      default:
        return status;
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-6 sticky top-0 z-30 bg-chill-bg/80 backdrop-blur-lg border-b border-white/5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          
          {/* Back Button */}
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 bg-chill-card rounded-xl text-chill-sage border border-white/10 hover:bg-white/10 transition-colors"
          >
            <ArrowLeft size={20} />
            Back
          </button>
          
          {/* Book Info */}
          <div className="max-w-xl truncate">
            <h1 className="text-xl font-bold text-white truncate">{book?.title}</h1>
            <p className="text-gray-500 text-sm truncate">{book?.author}</p>
          </div>
        </div>
        
        {/* Status and User Info */}
        <div className="flex items-center gap-4">
          {bookStatus && (
            <span className="px-3 py-1 bg-chill-sage/20 text-chill-sage rounded-full text-sm font-medium border border-chill-sage/30">
              {formatStatus(bookStatus)}
            </span>
          )}
          <div className="text-sm text-gray-400 hidden sm:block">
            {currentUser ? `Reader: ${currentUser.displayName || currentUser.uid?.substring(0, 8)}...` : 'Guest Reader'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReaderHeader;