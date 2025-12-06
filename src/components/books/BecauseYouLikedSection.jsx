import React from 'react';
import { Link } from 'react-router-dom';
import { ThumbsUp, Star } from 'lucide-react';
import { useBecauseYouLiked } from '../../hooks/useBecauseYouLiked';
import HorizontalCarousel from '../HomePage/HorizontalCarousel';
import LoadingSpinner from '../LoadingSpinner';

const BecauseYouLikedSection = ({ currentUser }) => {
  const {
    recommendations,
    isLoading,
    source,
    sourceBook,
    message,
    refresh
  } = useBecauseYouLiked({
    limit: 10,
    autoFetch: true
  });

  if (!currentUser || recommendations.length === 0) return null;

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-chill-blue to-chill-lavender rounded-xl flex items-center justify-center">
            <ThumbsUp className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-white">
              Because You Liked
            </h2>
            <div className="flex items-center gap-2">
              <p className="text-sm text-gray-400">
                {sourceBook ? message : 'Based on your ratings'}
              </p>
              {source && (
                <span className="text-xs px-2 py-1 rounded-full bg-chill-blue/20 text-chill-blue border border-chill-blue/30">
                  {source.replace(/_/g, ' ')}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500 font-medium">
            {recommendations.length} books
          </span>
          <button 
            onClick={refresh}
            className="text-sm text-chill-blue hover:text-white transition-colors p-1 hover:bg-white/5 rounded"
            title="Get new recommendations"
          >
            ↻
          </button>
        </div>
      </div>
      
      {/* Source book card if available */}
      {sourceBook && (
        <div className="bg-gradient-to-r from-chill-card/40 to-chill-card/20 rounded-xl p-3 border border-white/5 mb-4 flex gap-4 items-center backdrop-blur-md">
          {/* Book Cover / Fallback */}
          <div className="relative w-10 h-14 rounded bg-gray-800 shadow-md border border-white/10 overflow-hidden flex-shrink-0 group">
            {sourceBook.coverImageUrl ? (
              <img src={sourceBook.coverImageUrl} alt={sourceBook.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-900">
                <Star size={16} className="text-gray-600" />
              </div>
            )}
          </div>

          <div className="flex-1">
            <div className="flex items-baseline gap-2">
              <span className="text-xs text-chill-blue font-medium">Recommendation Source</span>
            </div>
            
            <p className="text-sm text-gray-200 mt-0.5 leading-snug">
              Based on your <span className="font-bold text-white">{sourceBook.rating}-star</span> rating of <span className="italic text-gray-300">"{sourceBook.title}"</span>
            </p>

            <div className="flex gap-2 mt-2">
              {sourceBook.subjects?.slice(0, 2).map((tag, i) => (
                <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-gray-400 border border-white/5">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {isLoading ? (
        <div className="h-48 flex items-center justify-center bg-chill-card/30 rounded-2xl border border-white/5">
          <div className="text-center">
            <LoadingSpinner size="md" />
            <p className="text-gray-400 text-sm mt-2">Finding similar books...</p>
          </div>
        </div>
      ) : (
        <>
          <HorizontalCarousel 
            books={recommendations} 
            isLoading={false}
            showBadge={true}
            badgeText="Similar"
          />
          
          {/* Link to rate more books if no source book */}
          {!sourceBook && (
            <div className="bg-chill-card/30 rounded-xl p-4 border border-white/5">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-chill-blue/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Star size={14} className="text-chill-blue" />
                </div>
                <div>
                  <p className="text-sm text-gray-300 font-medium">Rate more books for better recommendations</p>
                  <p className="text-xs text-gray-400 mt-1">
                    The more books you rate, the better our AI can recommend similar books you'll love.
                  </p>
                  <Link 
                    to="/reviews" 
                    className="inline-block mt-2 text-xs text-chill-blue hover:text-white transition-colors font-medium"
                  >
                    View your reviews →
                  </Link>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </section>
  );
};

export default BecauseYouLikedSection;