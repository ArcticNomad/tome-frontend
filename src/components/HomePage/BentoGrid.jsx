// src/components/HomePage/BentoGrid.jsx
import React, { useState, useEffect } from 'react';

const BentoImage = ({ src, alt }) => {
  const [imageSrc, setImageSrc] = useState(src);

  useEffect(() => {
    setImageSrc(src);
  }, [src]);

  const handleError = () => {
    setImageSrc('https://tome-frontend-arc.vercel.app/placeholder-book.jpg');
  };

  return (
    <img 
      src={imageSrc} 
      alt={alt} 
      onError={handleError}
      className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500"
    />
  );
};

const BentoGrid = ({ featuredBooks = [] }) => {
  // Use provided featured books or show loading state
  const displayBooks = featuredBooks.slice(0, 4);

  if (displayBooks.length === 0) {
    return (
      <section className="mb-10">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Featured & Trending</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[200px] gap-4">
          {[...Array(5)].map((_, i) => (
            <div 
              key={i} 
              className={`${
                i === 0 ? 'col-span-2 row-span-2' : 
                i === 1 ? 'col-span-1 row-span-2' : 'col-span-1 row-span-1'
              } bg-gray-200 rounded-2xl animate-pulse`}
            ></div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="mb-10">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Featured & Trending</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[200px] gap-4">
        
        {/* Item 1: Big featured item (2x2) */}
        <div className="col-span-2 row-span-2 relative rounded-2xl overflow-hidden group cursor-pointer">
            <BentoImage 
              src={displayBooks[0]?.coverImageUrl || '/placeholder-book.jpg'} 
              alt={displayBooks[0]?.title} 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-0 inset-x-0 p-4 text-white">
                <h3 className="text-2xl font-bold drop-shadow-lg">{displayBooks[0]?.title}</h3>
                <p className="text-white/90 drop-shadow-lg">{displayBooks[0]?.author}</p>
                {displayBooks[0]?.downloadCount > 0 && (
                  <p className="text-white/80 text-sm mt-1">
                    {displayBooks[0].downloadCount.toLocaleString()} downloads
                  </p>
                )}
            </div>
        </div>

        {/* Item 2: Tall item (1x2) */}
        <div className="col-span-1 row-span-2 relative rounded-2xl overflow-hidden group cursor-pointer">
             <BentoImage 
               src={displayBooks[1]?.coverImageUrl || '/placeholder-book.jpg'} 
               alt={displayBooks[1]?.title} 
             />
             <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
             <div className="absolute bottom-0 inset-x-0 p-3 text-white">
                <h3 className="font-bold leading-tight text-sm drop-shadow-lg">{displayBooks[1]?.title}</h3>
                <p className="text-white/80 text-xs drop-shadow-lg">{displayBooks[1]?.author}</p>
             </div>
        </div>

        {/* Items 3 & 4: Standard squares (1x1) */}
        <div className="col-span-1 row-span-1 relative rounded-2xl overflow-hidden group cursor-pointer">
             <BentoImage 
               src={displayBooks[2]?.coverImageUrl || '/placeholder-book.jpg'} 
               alt={displayBooks[2]?.title} 
             />
        </div>
         <div className="col-span-1 row-span-1 relative rounded-2xl overflow-hidden group cursor-pointer">
             <BentoImage 
               src={displayBooks[3]?.coverImageUrl || '/placeholder-book.jpg'} 
               alt={displayBooks[3]?.title} 
             />
        </div>

      </div>
    </section>
  );
};

export default BentoGrid;