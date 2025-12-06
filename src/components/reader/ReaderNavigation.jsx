import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

const ReaderNavigation = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div className="flex items-center justify-between p-4 bg-chill-card rounded-xl border border-white/5 shadow-lg">
      
      {/* Left Navigation (First, Prev) */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className="p-2 bg-chill-bg text-chill-sage rounded-lg hover:bg-white/10 disabled:opacity-30 transition-colors border border-white/5"
          aria-label="Go to first page"
        >
          <ChevronsLeft size={20} />
        </button>
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 bg-chill-bg text-white rounded-lg hover:bg-white/10 disabled:opacity-30 transition-colors border border-white/5"
          aria-label="Go to previous page"
        >
          <ChevronLeft size={20} />
        </button>
      </div>
      
      {/* Center Display */}
      <div className="flex items-center gap-4">
        <div className="text-center">
          <div className="text-3xl font-black text-chill-sage">{currentPage}</div>
          <div className="text-xs text-gray-500 uppercase tracking-wider">Current Page</div>
        </div>
        <div className="text-xl text-gray-500 font-extrabold">/</div>
        <div className="text-center">
          <div className="text-3xl font-black text-white">{totalPages}</div>
          <div className="text-xs text-gray-500 uppercase tracking-wider">Total Pages</div>
        </div>
      </div>
      
      {/* Right Navigation (Next, Last) */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 bg-chill-bg text-white rounded-lg hover:bg-white/10 disabled:opacity-30 transition-colors border border-white/5"
          aria-label="Go to next page"
        >
          <ChevronRight size={20} />
        </button>
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="p-2 bg-chill-bg text-chill-sage rounded-lg hover:bg-white/10 disabled:opacity-30 transition-colors border border-white/5"
          aria-label="Go to last page"
        >
          <ChevronsRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default ReaderNavigation;