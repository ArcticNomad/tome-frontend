// src/components/BentoGrid.jsx
import React from 'react';
import { bentoBooks } from '../../data';

const BentoGrid = () => {
  return (
    <section className="mb-10">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Featured & Trending (Bento Grid)</h2>
      {/* The magic happens here: A 4 column grid with varying spans */}
      <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[200px] gap-4">
        
        {/* Item 1: Big featured item (2x2) */}
        <div className="col-span-2 row-span-2 relative rounded-2xl overflow-hidden group">
            <img src={bentoBooks[0].cover} alt={bentoBooks[0].title} className="w-full h-full object-cover transition-transform group-hover:scale-105"/>
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-white">
                <h3 className="text-2xl font-bold">{bentoBooks[0].title}</h3>
                <p className="">{bentoBooks[0].author}</p>
            </div>
        </div>

        {/* Item 2: Tall item (1x2) */}
        <div className="col-span-1 row-span-2 relative rounded-2xl overflow-hidden group">
             <img src={bentoBooks[1].cover} alt={bentoBooks[1].title} className="w-full h-full object-cover transition-transform group-hover:scale-105"/>
             <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 p-3 text-white">
                <h3 className="font-bold leading-tight">{bentoBooks[1].title}</h3>
            </div>
        </div>

        {/* Items 3 & 4: Standard squares (1x1) */}
        <div className="col-span-1 row-span-1 relative rounded-2xl overflow-hidden group">
             <img src={bentoBooks[2].cover} alt={bentoBooks[2].title} className="w-full h-full object-cover transition-transform group-hover:scale-105"/>
        </div>
         <div className="col-span-1 row-span-1 relative rounded-2xl overflow-hidden group">
             <img src={bentoBooks[3].cover} alt={bentoBooks[3].title} className="w-full h-full object-cover transition-transform group-hover:scale-105"/>
        </div>

      </div>
    </section>
  );
};

export default BentoGrid;