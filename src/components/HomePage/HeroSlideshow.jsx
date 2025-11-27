// src/components/HeroSlideshow.jsx
import React from 'react';

const HeroSlideshow = () => {
  // In a real app, use a library like 'react-slick' or 'swiper' for actual sliding functionality.
  // This is a static representation of the "main image" slot.
  return (
    <div className="relative w-full h-64 md:h-80 rounded-2xl overflow-hidden mb-8 bg-purple-900 flex items-center">
      <img 
        src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=2070&auto=format&fit=crop" 
        alt="Hero"
        className="absolute inset-0 w-full h-full object-cover opacity-50"
      />
      <div className="relative z-10 p-8 md:p-12 text-white">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Summer Reading Challenge</h2>
        <p className="text-lg mb-6 max-w-lg">Discover the hottest books to dive into this season. Get started with our curated list.</p>
        <button className="bg-white text-purple-900 px-6 py-2 rounded-full font-semibold hover:bg-gray-100 transition">
          Explore Now
        </button>
      </div>
    </div>
  );
};

export default HeroSlideshow;