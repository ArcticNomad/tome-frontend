import React from 'react';
import { Star, BookOpen } from 'lucide-react';

const UserReviewsPrompt = () => {
  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-2 h-8 bg-chill-rose rounded-full"></div>
          <h2 className="text-3xl font-bold text-white">
            Your Reviews
          </h2>
        </div>
        <button className="text-sm text-chill-rose hover:text-white font-medium transition-colors">
          Write a review →
        </button>
      </div>
      
      <div className="bg-chill-highlight rounded-2xl p-8 border border-chill-rose/20 text-center">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="w-16 h-16 bg-chill-rose/10 rounded-full flex items-center justify-center">
            <Star className="w-8 h-8 text-chill-rose" />
          </div>
          <h3 className="text-xl font-semibold text-white">No Reviews Yet</h3>
          <p className="text-gray-400 max-w-md">
            You haven't reviewed any books yet. Start exploring our collection and share your thoughts with the community!
          </p>
          <button className="bg-chill-rose hover:bg-opacity-90 text-black px-6 py-3 rounded-full font-medium transition-colors flex items-center gap-2">
            <BookOpen size={18} />
            Start Reading
          </button>
        </div>
      </div>
    </section>
  );
};

export default UserReviewsPrompt;