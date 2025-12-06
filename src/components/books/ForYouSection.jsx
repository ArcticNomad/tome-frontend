import React from 'react';
import { Link } from 'react-router-dom';
import { User, Sparkles } from 'lucide-react';
import { useRecommendations } from '../../hooks/useRecommendations';
import HorizontalCarousel from '../HomePage/HorizontalCarousel';
import LoadingSpinner from '../LoadingSpinner';

const ForYouSection = ({ currentUser, popularBooks }) => {
  // Personalized recommendations logic
  const { 
    recommendations, 
    isLoading, 
    source,
    userGenres,
    refresh
  } = useRecommendations({
    limit: 20,
    showPersonalized: true,
    fallbackToPopular: true
  });

  // Determine recommendations to show
  const recsToShow = recommendations.length > 0 
    ? recommendations 
    : (isLoading ? [] : (popularBooks.length > 0 ? popularBooks.slice(0, 10) : []));

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-chill-sage to-chill-lavender rounded-xl flex items-center justify-center">
            {currentUser ? (
              <User className="w-5 h-5 text-white" />
            ) : (
              <Sparkles className="w-5 h-5 text-white" />
            )}
          </div>
          <div>
            <h2 className="text-3xl font-bold text-white">
              {currentUser ? 'For You' : 'Recommended For You'}
            </h2>
            <div className="flex items-center gap-2">
              <p className="text-sm text-gray-400">
                {currentUser 
                  ? `Based on your interests${userGenres && userGenres.length > 0 ? `: ${userGenres.join(', ')}` : ''}`
                  : 'Sign in to get personalized recommendations'
                }
              </p>
              {source && (
                <span className={`text-xs px-2 py-1 rounded-full ${
                  source === 'personalized' 
                    ? 'bg-chill-sage/20 text-chill-sage border border-chill-sage/30' 
                    : source.includes('api')
                    ? 'bg-chill-blue/20 text-chill-blue border border-chill-blue/30'
                    : 'bg-gray-800 text-gray-400 border border-gray-700'
                }`}>
                  {source.replace('_', ' ')}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500 font-medium">
            {recsToShow.length} {recsToShow.length === 1 ? 'book' : 'books'}
          </span>
          <button 
            onClick={refresh}
            className="text-sm text-chill-sage hover:text-white transition-colors p-1 hover:bg-white/5 rounded"
            title="Refresh recommendations"
          >
            ↻
          </button>
        </div>
      </div>
      
      {isLoading ? (
        <div className="h-64 flex items-center justify-center bg-chill-card/30 rounded-2xl border border-white/5">
          <div className="text-center">
            <LoadingSpinner size="md" />
            <p className="text-gray-400 text-sm mt-2">Finding recommendations for you...</p>
          </div>
        </div>
      ) : recsToShow.length > 0 ? (
        <>
          <HorizontalCarousel 
            books={recsToShow} 
            isLoading={false}
            showBadge={source === 'personalized'}
            badgeText="For You"
          />
          
          {/* Help message if no user genres */}
          {currentUser && userGenres && userGenres.length === 0 && (
            <div className="bg-chill-card/30 rounded-xl p-4 border border-white/5">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-chill-sage/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Sparkles size={14} className="text-chill-sage" />
                </div>
                <div>
                  <p className="text-sm text-gray-300 font-medium">Get better recommendations</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Add your favorite genres to your profile to get personalized recommendations tailored to your tastes.
                  </p>
                  <Link 
                    to="/profile" 
                    className="inline-block mt-2 text-xs text-chill-sage hover:text-white transition-colors font-medium"
                  >
                    Update your profile →
                  </Link>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="bg-chill-highlight rounded-2xl p-8 border border-white/5 text-center">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="w-16 h-16 bg-chill-sage/10 rounded-full flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-chill-sage" />
            </div>
            <h3 className="text-xl font-semibold text-white">
              No Recommendations Yet
            </h3>
            <p className="text-gray-400 max-w-md">
              {currentUser 
                ? "Tell us what genres you like in your profile to get personalized recommendations!"
                : "Sign in to get personalized book recommendations based on your interests."
              }
            </p>
            {currentUser ? (
              <Link 
                to="/profile"
                className="bg-chill-sage hover:bg-chill-sand text-black px-6 py-3 rounded-full font-medium transition-colors flex items-center gap-2"
              >
                <User size={16} />
                Update Your Profile
              </Link>
            ) : (
              <Link 
                to="/login"
                className="bg-chill-sage hover:bg-chill-sand text-black px-6 py-3 rounded-full font-medium transition-colors"
              >
                Sign In to Get Recommendations
              </Link>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default ForYouSection;