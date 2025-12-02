import React from 'react';
import { Search, X } from 'lucide-react';

const SearchBar = ({ searchOpen, setSearchOpen }) => {
  return (
    <div
      className={`
        absolute inset-0 bg-chill-surface  flex items-center px-6 md:px-16
        transition-all duration-300 ease-out
        ${searchOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
      `}
    >
      <div className="flex items-center w-full gap-3 ">
        <Search size={20} className="text-white" />

        <input
          type="text"
          placeholder="Search books, authors, genres..."
          className="
            w-full bg-chill-surface px-4 py-2 rounded-full border border-stone-300
            text-sm outline-none text-white
          "
        />

        <button
          onClick={() => setSearchOpen(false)}
          className="text-stone-600 hover:text-stone-900 transition"
        >
          <X size={22} />
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
