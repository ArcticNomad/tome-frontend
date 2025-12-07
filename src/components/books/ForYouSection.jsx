import React from 'react';
import { Link } from 'react-router-dom';
import { User, Sparkles, RefreshCw } from 'lucide-react';
import { useRecommendations } from '../../hooks/useRecommendations';
import HorizontalCarousel from '../HomePage/HorizontalCarousel';
import LoadingSpinner from '../LoadingSpinner';

const ForYouSection = ({ currentUser, popularBooks }) => {
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

  const recsToShow = recommendations.length > 0
    ? recommendations
    : (isLoading ? [] : (popularBooks.length > 0 ? popularBooks.slice(0, 10) : []));

  return (
    <section className="space-y-8">

      {/* Premium Header Card */}
      <div className="relative group p-8 bg-chill-surface/40 backdrop-blur-2xl rounded-3xl 
                      border border-white/8 shadow-2xl overflow-hidden isolate
                      before:absolute before:inset-0 before:bg-gradient-to-br 
                      before:from-chill-sage/6 before:via-chill-lavender/4 before:to-chill-rose/5 
                      before:-z-10 before:transition-all before:duration-1000
                      hover:before:from-chill-sage/12 hover:before:to-chill-rose/10">

        {/* Floating Orbs – soft & dreamy */}
        <div className="absolute -top-32 -right-28 w-80 h-80 rounded-full 
                        bg-gradient-to-br from-chill-sage/25 to-chill-blue/15 blur-3xl 
                        animate-pulse"></div>
        <div className="absolute -bottom-40 -left-20 w-96 h-96 rounded-full 
                        bg-gradient-to-tl from-chill-rose/20 to-transparent blur-3xl 
                        animate-pulse delay-1000"></div>

        <div className="relative z-10 flex items-center justify-between">

          {/* Left: Icon + Title + Subtitle */}
          <div className="flex items-center gap-7">
            {/* Icon – Elegant & Glowing */}
            <div className="relative">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-chill-sage/20 via-chill-lavender/10 to-chill-rose/20
                              p-1.5 shadow-xl backdrop-blur-md border border-white/10
                              transition-all duration-700 group-hover:scale-110 group-hover:rotate-6">
                <div className="w-full h-full rounded-2xl bg-chill-card/80 backdrop-blur-xl 
                                flex items-center justify-center border border-white/10">
                  {currentUser ? (
                    <User className="w-10 h-10 text-chill-sage drop-shadow-lg" />
                  ) : (
                    <Sparkles className="w-10 h-10 text-chill-sage drop-shadow-lg" />
                  )}
                  <Sparkles className="absolute top-1 right-1 w-4 h-4 text-chill-sage/80 animate-pulse" />
                </div>
              </div>
              <div className="absolute -inset-6 rounded-full bg-chill-sage/10 blur-3xl -z-10 
                              animate-pulse opacity-60"></div>
            </div>

            {/* Text */}
            <div className="space-y-3">
              <h2 className="text-4xl font-black tracking-tight text-white">
                {currentUser ? 'Just For You' : 'Discover Your Next Read'}
              </h2>

              <div className="flex items-center gap-4 flex-wrap">
                <p className="text-gray-300 text-base font-medium leading-relaxed">
                  {currentUser
                    ? userGenres?.length > 0
                      ? `Curated for your love of ${userGenres.slice(0, 3).join(', ')}${userGenres.length > 3 ? '...' : ''}`
                      : 'Start building your taste profile'
                    : 'Sign in to unlock personalized magic'}
                </p>

                {source && (
                  <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full
                                  bg-chill-card/50 border border-white/10 backdrop-blur-md
                                  hover:bg-chill-card/70 transition-all duration-300">
                    <div className="w-1.5 h-1.5 bg-chill-sage rounded-full animate-ping"></div>
                    <span className="text-chill-sage text-sm font-semibold tracking-wider uppercase">
                      {source === 'personalized' ? 'Your Taste' : 
                       source.includes('api') ? 'Smart Match' : 
                       'Trending'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right: Count + Refresh */}
          <div className="flex items-center gap-5 text-sm">
            <span className="text-gray-400 font-medium">
              {recsToShow.length} {recsToShow.length === 1 ? 'book' : 'books'}
            </span>
            <button
              onClick={refresh}
              className="p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-chill-sage/10 
                         hover:border-chill-sage/30 text-chill-sage transition-all duration-300
                         hover:rotate-180"
              title="Refresh recommendations"
            >
              <RefreshCw size={18} className="transition-transform" />
            </button>
          </div>
        </div>

        {/* Bottom subtle line */}
        <div className="absolute bottom-0 left-8 right-8 h-px bg-gradient-to-r 
                        from-transparent via-chill-sage/30 to-transparent"></div>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="h-80 flex items-center justify-center bg-chill-card/30 rounded-3xl border border-white/5">
          <div className="text-center space-y-4">
            <LoadingSpinner size="lg" />
            <p className="text-gray-400 text-sm">Reading your soul for the perfect books...</p>
          </div>
        </div>
      ) : recsToShow.length > 0 ? (
        <>
          <HorizontalCarousel
            books={recsToShow}
            isLoading={false}
            showBadge={source === 'personalized'}
            badgeText="Made For You"
          />

          {/* Gentle nudge if no genres set */}
          {currentUser && (!userGenres || userGenres.length === 0) && (
            <div className="bg-chill-card/40 backdrop-blur-md rounded-2xl p-6 border border-white/8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-chill-sage/10 flex items-center justify-center flex-shrink-0">
                  <Sparkles size={20} className="text-chill-sage" />
                </div>
                <div className="flex-1">
                  <p className="text-white font-semibold">Want even better recommendations?</p>
                  <p className="text-gray-400 text-sm mt-1">
                    Tell us your favorite genres — we’ll find books that feel like they were written just for you.
                  </p>
                  <Link
                    to="/profile"
                    className="inline-flex items-center gap-2 mt-3 text-chill-sage hover:text-white 
                               font-medium text-sm transition-colors"
                  >
                    Update Your Profile
                    <span className="text-xs">→</span>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        /* Empty State – Beautiful & Encouraging */
        <div className="bg-chill-card/40 backdrop-blur-md rounded-3xl p-12 border border-white/8 text-center">
          <div className="max-w-md mx-auto space-y-6">
            <div className="w-20 h-20 mx-auto rounded-full bg-chill-sage/10 flex items-center justify-center">
              <Sparkles className="w-10 h-10 text-chill-sage" />
            </div>
            <h3 className="text-2xl font-bold text-white">No Recommendations Yet</h3>
            <p className="text-gray-400">
              {currentUser
                ? "Help us understand your taste by adding your favorite genres in your profile."
                : "Sign in to get book recommendations that feel personal."}
            </p>
            {currentUser ? (
              <Link
                to="/profile"
                className="inline-flex items-center gap-3 px-8 py-4 bg-chill-sage hover:bg-chill-sand 
                           text-black font-bold rounded-full transition-all duration-300"
              >
                <User size={18} />
                Complete Your Profile
              </Link>
            ) : (
              <Link
                to="/login"
                className="inline-block px-8 py-4 bg-chill-sage hover:bg-chill-sand 
                           text-black font-bold rounded-full transition-all duration-300"
              >
                Sign In to Start
              </Link>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default ForYouSection;