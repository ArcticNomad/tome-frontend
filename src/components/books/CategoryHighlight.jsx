import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import HorizontalCarousel from '../HomePage/HorizontalCarousel';

// Category-specific image mapping
const CATEGORY_IMAGES = {
  // Fantasy
  'fantasy': './fantasy.jpg',
  'Fantasy Collection': 'https://images.unsplash.com/photo-1535905557558-afc4877a26fc?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
  
  // History
  'history': './history.jpg',
  'History': './history.jpg',
  'Historical Fiction': 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
  
  // Science Fiction
  'sci-fi': 'https://images.unsplash.com/photo-1534447677768-be436bb09401?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
  'Science Fiction': 'https://images.unsplash.com/photo-1534447677768-be436bb09401?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
  
  // Mystery
  'mystery': 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
  'Mystery & Thriller': 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
  
  // Romance
  'romance': 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
  'Romance': 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
  
  // Classics
  'classics': 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
  'Classic Literature': 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
  
  // Poetry
  'poetry': 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
  'Poetry': 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
  
  // Biography
  'biography': 'https://images.unsplash.com/photo-1505664194779-8beaceb93744?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
  'Biography & Memoir': 'https://images.unsplash.com/photo-1505664194779-8beaceb93744?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
  
  // Non-fiction
  'non-fiction': 'https://images.unsplash.com/photo-1589998059171-988d887df646?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
  'Non-Fiction': 'https://images.unsplash.com/photo-1589998059171-988d887df646?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
  
  // Default fallback
  'default': 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
};

const CategoryHighlight = ({ 
  title, 
  description, 
  iconLetter, 
  iconBgColor, 
  iconTextColor = "text-black/70",
  books, 
  isLoading,
  linkTo,
  backgroundImage, // Optional: override default
  category = '' // New prop for auto-matching
}) => {
  // Get the appropriate image based on category or title
  const getBackgroundImage = () => {
    if (backgroundImage) return backgroundImage; // Use custom if provided
    
    // Try to match by category first, then by title
    const categoryKey = category?.toLowerCase() || title?.toLowerCase();
    const matchedImage = CATEGORY_IMAGES[categoryKey];
    
    // If no direct match, try partial matching
    if (!matchedImage) {
      for (const [key, image] of Object.entries(CATEGORY_IMAGES)) {
        if (title.toLowerCase().includes(key.toLowerCase()) || 
            (category && category.toLowerCase().includes(key.toLowerCase()))) {
          return image;
        }
      }
    }
    
    return matchedImage || CATEGORY_IMAGES.default;
  };

  const imageUrl = getBackgroundImage();

  return (
    <section className="space-y-6">
      <div className="relative rounded-2xl overflow-hidden border border-white/5 group hover:border-white/20 transition-all duration-300">
        {/* Background Image */}
        {imageUrl && (
          <div className="absolute inset-0 z-0">
            <img 
              src={imageUrl} 
              alt={title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent" />
            {/* Pattern Overlay */}
            <div className="absolute inset-0 bg-noise opacity-5" />
            {/* Subtle vignette */}
            <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(0,0,0,0.5)]" />
          </div>
        )}
        
        {/* Content */}
        <div className="relative z-10 p-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 ${iconBgColor} rounded-xl flex items-center justify-center backdrop-blur-lg bg-white/30 shadow-2xl group-hover:scale-110 transition-transform duration-300`}>
                <span className={`${iconTextColor} text-lg font-bold`}>{iconLetter}</span>
              </div>
              <div>
                <h2 className="text-4xl font-bold text-white drop-shadow-lg">
                  {title}
                </h2>
                <div className="h-1 w-16 bg-gradient-to-r from-white/70 to-transparent mt-2 rounded-full" />
              </div>
            </div>
            {linkTo && (
              <Link 
                to={linkTo} 
                className="group/view-all text-sm font-medium text-white hover:text-chill-rose flex items-center gap-2 transition-all backdrop-blur-lg bg-black/40 px-5 py-3 rounded-full border border-white/20 hover:border-chill-rose/40 hover:bg-black/60"
              >
                <span>Explore All</span>
                <ChevronRight size={18} className="group-hover/view-all:translate-x-1 transition-transform" />
              </Link>
            )}
          </div>
          
          <div className="mt-6 max-w-2xl">
            <p className="text-gray-200 text-base leading-relaxed backdrop-blur-sm bg-black/30 inline-block px-6 py-4 rounded-xl border border-white/10 group-hover:bg-black/40 transition-all duration-300">
              {description}
            </p>
            
            {/* Stats Badge */}
            <div className="flex items-center gap-4 mt-6">
              <div className="flex items-center gap-3 px-4 py-2 rounded-full backdrop-blur-sm bg-white/10 border border-white/20">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                <span className="text-sm text-white/90 font-medium">
                  {books?.length || 0} Books Available
                </span>
              </div>
              <div className="text-sm text-white/60 italic">
                Curated collection • Updated weekly
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <HorizontalCarousel 
        title={title} 
        books={books} 
        isLoading={isLoading}
      />
    </section>
  );
};

export default CategoryHighlight;