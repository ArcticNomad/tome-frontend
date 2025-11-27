import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, X } from 'lucide-react';

const Navbar = () => {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <nav className="relative py-5 px-8 md:px-16 text-stone-800 bg-stone-50 border-b border-stone-200 sticky top-0 z-50 overflow-hidden ">

      {/* --- FULL WIDTH SEARCH OVERLAY --- */}
      <div
        className={`
          absolute inset-0 bg-stone-50 flex items-center px-6 md:px-16
          transition-all duration-300 ease-out
          ${searchOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
        `}
      >
        <div className="flex items-center w-full gap-3">
          <Search size={20} className="text-stone-500" />

          <input
            type="text"
            placeholder="Search books, authors, genres..."
            className="
              w-full bg-stone-100 px-4 py-2 rounded-full border border-stone-300
              text-sm outline-none
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

      {/* --- NORMAL NAVBAR CONTENT --- */}
      <div
        className={`
          flex justify-between items-center w-full
          transition-all duration-300 ease-out
          ${searchOpen ? 'opacity-0 blur-sm scale-95' : 'opacity-100'}
        `}
      >

        {/* --- LEFT: LOGO --- */}
        <a href="#" className="text-2xl font-black tracking-tighter flex items-center gap-2 hover:opacity-80 transition">
          <div className="grid grid-cols-2 gap-0.5 w-6 h-6">
            <div className="bg-stone-900 rounded-full w-full h-full"></div>
            <div className="bg-stone-900 rounded-full w-full h-full"></div>
            <div className="bg-stone-900 rounded-full w-full h-full"></div>
            <div className="bg-stone-900 rounded-full w-full h-full"></div>
          </div>
          <span>TOME</span>
        </a>

        {/* --- CENTER: LINKS --- */}
        <div className="hidden md:flex space-x-6 text-xs tracking-widest uppercase font-medium text-stone-500 absolute left-1/2 transform -translate-x-1/2">
          <a href="#" className="hover:text-stone-900 transition">Books</a>
          <a href="#" className="hover:text-stone-900 transition">Tags</a>
          <a href="#" className="hover:text-stone-900 transition">Reader</a>
        </div>

        {/* --- RIGHT: SEARCH + LOGIN + PROFILE --- */}
        <div className="flex items-center space-x-4 md:space-x-6 text-xs font-medium">

          <button
            onClick={() => setSearchOpen(true)}
            className="flex items-center gap-1 hover:text-stone-500 cursor-pointer"
          >
            <Search size={18} />
            <span className="hidden lg:inline">Search</span>
          </button>

          <div className="h-4 w-px bg-stone-300 hidden md:block"></div>

          <div className="flex items-center gap-4">
            <a href="#" className="text-stone-600 hover:text-stone-900 transition whitespace-nowrap">Log In</a>
            <a href="#" className="bg-stone-900 text-stone-50 px-5 py-2.5 rounded-full hover:bg-stone-700 transition shadow-md whitespace-nowrap">
              Sign Up
            </a>
          </div>

          <div className="relative group cursor-pointer ml-2">
            <div className="w-9 h-9 rounded-full p-0.5 border border-stone-300 hover:border-stone-900 transition">
              <img 
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200" 
                alt="Profile" 
                className="w-full h-full rounded-full object-cover"
              />
            </div>
            <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-stone-50"></div>
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;
