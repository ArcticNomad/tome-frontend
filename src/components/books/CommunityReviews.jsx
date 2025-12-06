import React from 'react';
import BookSection from '../HomePage/BookSection';

const CommunityReviews = ({ books, isLoading }) => {
  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-2 h-8 bg-chill-lavender rounded-full"></div>
          <h2 className="text-3xl font-bold text-white">
            Community Reviews
          </h2>
        </div>
        <button className="text-sm text-chill-lavender hover:text-white font-medium transition-colors">
          View all reviews →
        </button>
      </div>
      
      <div className="bg-chill-card rounded-2xl p-6 border border-white/5">
        <BookSection 
          title="Recently Reviewed" 
          books={books} 
          isLoading={isLoading}
          compact={true}
          showViewAll={false}
        />
      </div>
    </section>
  );
};

export default CommunityReviews;