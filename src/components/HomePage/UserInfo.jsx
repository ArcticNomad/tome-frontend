import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useUserProfile } from '../../hooks/useUserProfile';
import { BookOpen, Zap, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import SplitText from "../SplitText";

const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.DEV ? 'http://localhost:5000/api' : 'https://tome-backend-production-5402.up.railway.app/api');

const UserInfo = () => {
  const { currentUser } = useAuth();
  const { getUserStats } = useUserProfile();

  const [streak, setStreak] = useState(0);
  const [lastBook, setLastBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchDashboardData = async () => {
      if (!currentUser) return;

      try {
        setLoading(true);
        const [statsData, historyResponse] = await Promise.all([
          getUserStats(),
          fetch(`${API_BASE_URL}/users/reading-history`, {
            headers: { 'Authorization': `Bearer ${await currentUser.getIdToken()}` }
          })
        ]);

        if (!isMounted) return;

        if (statsData?.success) {
          setStreak(statsData.data.basic?.readingStreak || 0);
        }

        if (historyResponse.ok) {
          const { data } = await historyResponse.json();
          const history = data?.history || [];
          if (history.length > 0) {
            const latest = history.sort((a, b) => new Date(b.lastRead) - new Date(a.lastRead))[0];
            setLastBook(latest);
          }
        }
      } catch (err) {
        console.error("Failed to load user info:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchDashboardData();
    return () => { isMounted = false; };
  }, [currentUser?.uid]);

  if (!currentUser) return null;

  const greetingText = `Welcome back, ${currentUser.displayName?.split(' ')[0] || 'Reader'}`;

  const handleGreetingComplete = () => {
    setHasAnimated(true);
    console.log('Greeting animation complete!');
  };

  if (loading) {
    return (
      <div className="relative p-4 sm:p-6 md:p-8 bg-chill-surface/40 backdrop-blur-2xl rounded-2xl md:rounded-3xl border border-white/8 
                      shadow-2xl overflow-hidden animate-pulse">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gray-700"></div>
          <div className="space-y-3 w-full">
            <div className="h-6 sm:h-8 w-48 sm:w-64 bg-gray-700 rounded"></div>
            <div className="h-4 sm:h-5 w-32 sm:w-48 bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative group p-4 sm:p-6 md:p-8 bg-chill-surface/40 backdrop-blur-2xl rounded-2xl md:rounded-3xl 
                    border border-white/8 shadow-2xl overflow-hidden isolate
                    before:absolute before:inset-0 before:bg-gradient-to-br 
                    before:from-chill-sage/6 before:via-chill-lavender/4 before:to-chill-rose/5 
                    before:-z-10 before:transition-all before:duration-1000
                    hover:before:from-chill-sage/12 hover:before:to-chill-rose/10">

      {/* Floating Orbs - Responsive positioning */}
      <div className="absolute -top-16 -right-16 w-48 h-48 sm:-top-20 sm:-right-20 sm:w-60 sm:h-60 md:-top-32 md:-right-32 md:w-80 md:h-80 rounded-full 
                      bg-gradient-to-br from-chill-sage/20 to-chill-blue/10 blur-2xl sm:blur-3xl animate-pulse"></div>
      <div className="absolute -bottom-20 -left-12 w-64 h-64 sm:-bottom-24 sm:-left-16 sm:w-72 sm:h-72 md:-bottom-40 md:-left-24 md:w-96 md:h-96 rounded-full 
                      bg-gradient-to-tl from-chill-rose/15 to-transparent blur-2xl sm:blur-3xl 
                      animate-pulse delay-1000"></div>

      <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center 
                      justify-between gap-6 md:gap-8">

        {/* Left: Avatar + Animated Greeting */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-5 md:gap-7 w-full lg:w-auto">
          <div className="relative">
            <img
              src={currentUser.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser.uid}`}
              alt="You"
              className="w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 rounded-full border-2 sm:border-3 md:border-4 border-white/20 shadow-lg sm:shadow-2xl object-cover 
                         ring-2 sm:ring-3 md:ring-4 ring-chill-sage/20"
            />
            <div className="absolute -inset-3 sm:-inset-3 md:-inset-4 rounded-full bg-chill-sage/20 blur-xl sm:blur-2xl md:blur-3xl -z-10 
                            animate-pulse opacity-60"></div>
          </div>

          <div className="space-y-2 sm:space-y-3 md:space-y-4 text-center sm:text-left">
            {/* Animated Greeting */}
            <div className="overflow-hidden">
              <SplitText
                text={greetingText}
                className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-white inline-block"
                delay={180}
                duration={0.8}
                ease="power4.out"
                splitType="chars"
                from={{ opacity: 0, y: 80, rotateX: -90 }}
                to={{ opacity: 1, y: 0, rotateX: 0 }}
                stagger={0.05}
                threshold={0.1}
                rootMargin="-50px"
                once={true}
                onLetterAnimationComplete={handleGreetingComplete}
              />
            </div>

            {/* Subline */}
            <p className={`text-gray-300 text-sm sm:text-base font-medium flex items-center justify-center sm:justify-start gap-2 transition-opacity duration-1000
                          ${hasAnimated ? 'opacity-100' : 'opacity-0'}`}>
              <Sparkles size={14} className="text-chill-sage flex-shrink-0" />
              <span>Ready for your next chapter?</span>
            </p>
          </div>
        </div>

        {/* Right: Stats */}
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 md:gap-8 w-full lg:w-auto mt-4 lg:mt-0">
          {/* Continue Reading */}
          <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
            <div className="relative p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-chill-card/60 backdrop-blur-xl 
                            border border-white/10 shadow-inner flex-shrink-0">
              <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-chill-sage" />
              <div className="absolute -inset-1 sm:-inset-1.5 md:-inset-2 rounded-xl sm:rounded-2xl bg-chill-sage/10 blur-lg sm:blur-xl -z-10"></div>
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Continue Reading</p>
              {lastBook ? (
                <Link to={`/read/${lastBook.bookId.gutenbergId || lastBook.bookId._id}`} className="block mt-1 group">
                  <p className="font-bold text-white truncate max-w-full sm:max-w-[180px] md:max-w-[200px] 
                                group-hover:text-chill-sage transition-colors text-sm sm:text-base">
                    {lastBook.bookId.title}
                  </p>
                  <div className="w-full h-1.5 bg-chill-bg/50 rounded-full mt-1 sm:mt-2 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-chill-sage to-chill-blue rounded-full 
                                 transition-all duration-1000 ease-out"
                      style={{ width: `${lastBook.progress || 0}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{Math.round(lastBook.progress || 0)}% complete</p>
                </Link>
              ) : (
                <p className="text-sm text-gray-500 italic mt-1">No active book</p>
              )}
            </div>
          </div>

          {/* Streak */}
          <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
            <div className="relative p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-chill-card/60 backdrop-blur-xl 
                            border border-white/10 shadow-inner flex-shrink-0">
              <Zap className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-chill-sage" fill="currentColor" />
              <div className="absolute -inset-1 sm:-inset-1.5 md:-inset-2 rounded-xl sm:rounded-2xl bg-chill-sage/10 blur-lg sm:blur-xl -z-10"></div>
            </div>

            <div className="min-w-0">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Reading Streak</p>
              <div className="flex items-baseline gap-1">
                <p className="text-2xl sm:text-3xl font-black text-white">
                  {streak}
                </p>
                <span className="text-sm sm:text-lg font-medium text-gray-400 ml-1">days</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom shimmer - Responsive */}
      <div className="absolute bottom-0 left-4 right-4 sm:left-6 sm:right-6 md:left-10 md:right-10 h-px bg-gradient-to-r 
                      from-transparent via-chill-sage/30 to-transparent"></div>
    </div>
  );
};

export default UserInfo;