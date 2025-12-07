import React from 'react';
import { Link } from 'react-router-dom';
import { ThumbsUp, Star } from 'lucide-react';
import { useBecauseYouLiked } from '../../hooks/useBecauseYouLiked';
import HorizontalCarousel from '../HomePage/HorizontalCarousel';
import LoadingSpinner from '../LoadingSpinner';
import { BookOpen, Sparkles } from 'lucide-react';

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
    <div className="relative group p-8 bg-chill-surface/40 backdrop-blur-2xl rounded-3xl 
                border border-white/8 shadow-2xl overflow-hidden isolate
                before:absolute before:inset-0 before:bg-gradient-to-br 
                before:from-chill-sage/5 before:via-chill-lavender/3 before:to-chill-rose/5 
                before:-z-10 before:transition-all before:duration-1000
                hover:before:from-chill-sage/10 hover:before:to-chill-rose/8">

  {/* Soft Floating Orbs – tuned to your palette */}
  <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full 
                  bg-gradient-to-br from-chill-sage/30 to-chill-blue/20 blur-3xl 
                  animate-pulse"></div>
  <div className="absolute -bottom-40 -left-20 w-96 h-96 rounded-full 
                  bg-gradient-to-tl from-chill-rose/20 via-chill-lavender/10 to-transparent 
                  blur-3xl animate-pulse delay-700"></div>

  {/* Subtle Floating Dust (feels like calm night air) */}
  <div className="absolute inset-0 opacity-20 pointer-events-none">
    {[...Array(7)].map((_, i) => (
      <div
        key={i}
        className="absolute w-1 h-1 bg-chill-sage rounded-full animate-float"
        style={{
          left: `${15 + i * 13}%`,
          top: `${10 + i * 11}%`,
          animationDelay: `${i * 1.4}s`,
          animationDuration: `${20 + i * 5}s`
        }}
      />
    ))}
  </div>

  <div className="relative z-10 flex items-center gap-9">

    {/* Icon: Elegant Open Book with Gentle Glow */}
    <div className="relative">
      <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-chill-sage/20 via-chill-lavender/10 to-chill-rose/20
                      p-1 shadow-xl backdrop-blur-md border border-white/10
                      transition-all duration-700 group-hover:scale-110 group-hover:rotate-6">
        <div className="w-full h-full rounded-2xl bg-chill-card/80 backdrop-blur-xl 
                        flex items-center justify-center border border-white/10">
          <BookOpen className="w-10 h-10 text-chill-sage drop-shadow-lg" />
          
          {/* Tiny floating sparkles – very subtle */}
          <Sparkles className="absolute top-1 right-1 w-4 h-4 text-chill-sage/80 animate-pulse" />
          <Sparkles className="absolute bottom-1 left-1 w-3 h-3 text-chill-rose/70 animate-ping delay-500" />
        </div>
      </div>

      {/* Soft outer halo */}
      <div className="absolute -inset-6 rounded-full bg-chill-sage/10 blur-3xl -z-10 
                      animate-pulse opacity-60"></div>
    </div>

    {/* Text – clean, luxurious, perfectly readable */}
    <div className="space-y-3">
      <h2 className="text-4xl font-black tracking-tight text-white">
        Because You Loved
      </h2>

      <div className="flex items-center gap-4 flex-wrap">
        <p className="text-gray-300 text-base font-medium leading-relaxed">
          {sourceBook ? message : 'Hand-picked from your reading soul'}
        </p>

        {source && (
          <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full
                          bg-chill-card/50 border border-white/10 backdrop-blur-md
                          hover:bg-chill-card/70 transition-all duration-300">
            <div className="w-1.5 h-1.5 bg-chill-sage rounded-full animate-ping"></div>
            <span className="text-chill-sage text-sm font-semibold tracking-wider uppercase">
              {source.replace(/_/g, ' ')}
            </span>
          </div>
        )}
      </div>
    </div>
  </div>

  {/* Minimal bottom accent */}
  <div className="absolute bottom-0 left-8 right-8 h-px bg-gradient-to-r 
                  from-transparent via-chill-sage/30 to-transparent"></div>
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