import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import HorizontalCarousel from '../HomePage/HorizontalCarousel';

const CategoryHighlight = ({ 
  title, 
  description, 
  iconLetter, 
  iconBgColor, 
  iconTextColor = "text-black/70",
  books, 
  isLoading,
  linkTo 
}) => {
  return (
    <section className="space-y-6">
      <div className="bg-chill-card rounded-2xl p-6 border border-white/5">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className={`w-6 h-6 ${iconBgColor} rounded-lg flex items-center justify-center`}>
              <span className={`${iconTextColor} text-sm font-bold`}>{iconLetter}</span>
            </div>
            <h2 className="text-3xl font-bold text-white">
              {title}
            </h2>
          </div>
          {linkTo && (
            <Link 
              to={linkTo} 
              className={`text-sm font-medium ${iconBgColor.replace('bg-', 'text-')} hover:text-white flex items-center gap-1 transition-colors`}
            >
              View all <ChevronRight size={16} />
            </Link>
          )}
        </div>
        <p className="text-gray-400 text-sm max-w-2xl">
          {description}
        </p>
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