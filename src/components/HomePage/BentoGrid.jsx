import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, TrendingUp, ArrowRight, Sparkles } from 'lucide-react';

// --- Image Component (Maintains your aesthetic blur/loading) ---
const BentoImage = ({ src, alt, className = "" }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setIsLoaded(false);
    setHasError(false);
    const img = new Image();
    img.src = src;
    img.onload = () => setIsLoaded(true);
    img.onerror = () => setHasError(true);
  }, [src]);

  const finalSrc = hasError ? '/placeholder-book.jpg' : src;

  return (
    <div className="absolute inset-0 h-full w-full overflow-hidden bg-[#191A19]">
        {/* Blur Placeholder */}
        <div 
            className={`absolute inset-0 bg-cover bg-center blur-xl scale-110 opacity-100 transition-opacity duration-1000 ease-in-out ${isLoaded ? '!opacity-0' : ''}`}
            style={{ backgroundImage: `url(${finalSrc})` }}
        />
        {/* Main Image */}
        <img 
            src={finalSrc} 
            alt={alt} 
            className={`
                h-full w-full object-cover object-center 
                transition-all duration-700 ease-out-circ 
                group-hover:scale-105 brightness-[0.85] group-hover:brightness-100
                ${isLoaded ? 'opacity-100 blur-0' : 'opacity-0 blur-sm'} 
                ${className}
            `}
        />
        {/* Inner Ring/Glow for "Glass" feel */}
        <div className="absolute inset-0 rounded-[inherit] ring-1 ring-inset ring-white/10 shadow-[inset_0_0_20px_rgba(0,0,0,0.5)] pointer-events-none z-10"></div>
    </div>
  );
};

const BentoGrid = ({ featuredBooks = [] }) => {
  const displayBooks = featuredBooks.slice(0, 4);

  // Helper to match BookCard logic
  const getBookId = (book) => book?.gutenbergId || book?._id;

  // --- Loading State ---
  if (displayBooks.length === 0) {
    return (
      <section className="mb-16">
         <div className="flex items-center gap-3 mb-8 animate-pulse">
            <div className="w-8 h-8 bg-white/10 rounded-full" />
            <div className="h-8 w-48 bg-white/10 rounded-lg" />
         </div>
        <div className="grid grid-cols-2 md:grid-cols-4 grid-rows-[240px_240px] gap-4 md:gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className={`relative overflow-hidden rounded-[2rem] bg-[#202425] border border-white/5 ${i === 0 ? 'col-span-2 row-span-2' : i === 1 ? 'col-span-1 row-span-2' : 'col-span-1 row-span-1'}`}>
                 <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent animate-[pulse_3s_infinite]"></div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="mb-16">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
            <div className="bg-[#D4E09B]/20 p-2 rounded-xl">
                 <TrendingUp className="text-[#D4E09B] w-6 h-6" />
            </div>
            <h2 className="text-3xl font-bold text-white tracking-tight">Featured & Trending</h2>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-2 md:grid-cols-4 grid-rows-[240px_240px] gap-4 md:gap-6">
        
        {/* --- Item 1: HERO (Big Square) --- */}
        <Link 
          to={`/book/${getBookId(displayBooks[0])}`}
          className="col-span-2 row-span-2 relative group rounded-[2rem] overflow-hidden cursor-pointer ring-1 ring-white/10 hover:ring-[#D4E09B]/50 transition-all duration-500 shadow-2xl shadow-black/40 hover:shadow-[#D4E09B]/10 block"
        >
            <BentoImage src={displayBooks[0]?.coverImageUrl} alt={displayBooks[0]?.title} />
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#191A19] via-[#191A19]/40 to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-80 z-20" />
            
            <div className="absolute inset-0 p-8 flex flex-col justify-between z-30">
                <div className="flex justify-between items-start">
                     <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/40 text-xs font-bold text-white backdrop-blur-md border border-white/10 shadow-sm">
                        <Sparkles size={12} className="text-yellow-300" /> #1 Top Pick
                    </span>
                </div>
                
                <div className="transform transition-all duration-500 ease-out-circ translate-y-4 group-hover:translate-y-0">
                    <h3 className="text-3xl md:text-4xl font-extrabold text-white mb-2 leading-tight drop-shadow-lg line-clamp-2">
                      {displayBooks[0]?.title}
                    </h3>
                    <p className="text-lg text-gray-300 font-medium mb-6 drop-shadow-md">
                      by {displayBooks[0]?.author}
                    </p>
                    
                    {/* Fake Button (Visual Only) */}
                    <div className="inline-flex opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100 transform translate-y-4 group-hover:translate-y-0">
                        <div className="flex items-center gap-2 bg-[#D4E09B] text-black font-bold px-6 py-3 rounded-xl hover:bg-[#c5d38a] transition-colors shadow-lg">
                            View Details <ArrowRight size={18} />
                        </div>
                    </div>
                </div>
            </div>
        </Link>

        {/* --- Item 2: PORTRAIT (Tall) --- */}
        <Link 
          to={`/book/${getBookId(displayBooks[1])}`}
          className="col-span-1 row-span-2 relative group rounded-[2rem] overflow-hidden cursor-pointer ring-1 ring-white/10 hover:ring-[#D4A5A5]/50 transition-all duration-500 shadow-xl shadow-black/40 block"
        >
             <BentoImage src={displayBooks[1]?.coverImageUrl} alt={displayBooks[1]?.title} />
             
             <div className="absolute inset-0 bg-gradient-to-t from-[#191A19] via-[#D4A5A5]/10 to-transparent opacity-80 z-20" />
             
             <div className="absolute bottom-0 inset-x-0 p-6 z-30 transform transition-all duration-500 translate-y-2 group-hover:translate-y-0">
                <h3 className="text-xl font-bold text-white leading-snug mb-1 line-clamp-3 drop-shadow-md">
                  {displayBooks[1]?.title}
                </h3>
                <p className="text-gray-400 text-sm font-medium line-clamp-1">{displayBooks[1]?.author}</p>
             </div>
        </Link>

        {/* --- Items 3 & 4: SQUARES --- */}
        {[displayBooks[2], displayBooks[3]].map((book, index) => (
             <Link 
                key={index + 2} 
                to={`/book/${getBookId(book)}`}
                className="col-span-1 row-span-1 relative group rounded-[2rem] overflow-hidden cursor-pointer ring-1 ring-white/10 hover:ring-white/30 transition-all duration-500 shadow-lg shadow-black/40 block"
             >
                <BentoImage src={book?.coverImageUrl} alt={book?.title} />
                
                {/* Standard Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent opacity-100 group-hover:opacity-0 transition-opacity duration-500 z-20" />
                
                {/* Hover Overlay (Glass) */}
                <div className="absolute inset-0 bg-[#191A19]/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-500 z-30 flex items-center justify-center p-6 text-center">
                    <div>
                        <BookOpen className="text-white mx-auto mb-3 scale-90 group-hover:scale-100 transition-transform delay-100 duration-500" size={24} />
                        <h4 className="text-white font-bold leading-tight line-clamp-3 translate-y-2 group-hover:translate-y-0 transition-all delay-75 duration-500">
                            {book?.title}
                        </h4>
                    </div>
                 </div>

                 {/* Default Label */}
                 <div className="absolute bottom-0 inset-x-0 p-4 z-30 group-hover:opacity-0 transition-opacity duration-300">
                     <p className="text-sm font-bold text-white truncate">{book?.title}</p>
                 </div>
            </Link>
        ))}
      </div>
    </section>
  );
};

export default BentoGrid;