import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useUserProfile } from '../../hooks/useUserProfile';
import { BookOpen, Zap, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import SplitText from "../SplitText"; // ← Your GSAP text animation component
const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.DEV ? 'http://localhost:5000/api' : 'https://tome-backend-production-5402.up.railway.app/api');


const UserInfo = () => {
  const { currentUser } = useAuth();
  const { getUserStats } = useUserProfile();

  const [streak, setStreak] = useState(0);
  const [lastBook, setLastBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasAnimated, setHasAnimated] = useState(false); // Prevent re-trigger

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
      <div className="relative p-8 bg-chill-surface/40 backdrop-blur-2xl rounded-3xl border border-white/8 
                      shadow-2xl overflow-hidden animate-pulse">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-full bg-gray-700"></div>
          <div className="space-y-3">
            <div className="h-8 w-64 bg-gray-700 rounded"></div>
            <div className="h-5 w-48 bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative group p-8 bg-chill-surface/40 backdrop-blur-2xl rounded-3xl 
                    border border-white/8 shadow-2xl overflow-hidden isolate
                    before:absolute before:inset-0 before:bg-gradient-to-br 
                    before:from-chill-sage/6 before:via-chill-lavender/4 before:to-chill-rose/5 
                    before:-z-10 before:transition-all before:duration-1000
                    hover:before:from-chill-sage/12 hover:before:to-chill-rose/10">

      {/* Floating Orbs */}
      <div className="absolute -top-32 -right-32 w-80 h-80 rounded-full 
                      bg-gradient-to-br from-chill-sage/20 to-chill-blue/10 blur-3xl animate-pulse"></div>
      <div className="absolute -bottom-40 -left-24 w-96 h-96 rounded-full 
                      bg-gradient-to-tl from-chill-rose/15 to-transparent blur-3xl 
                      animate-pulse delay-1000"></div>

      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center 
                      justify-between gap-8">

        {/* Left: Avatar + Animated Greeting */}
        <div className="flex items-center gap-7">
          <div className="relative">
            <img
              src={currentUser.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser.uid}`}
              alt="You"
              className="w-20 h-20 rounded-full border-4 border-white/20 shadow-2xl object-cover 
                         ring-4 ring-chill-sage/20"
            />
            <div className="absolute -inset-4 rounded-full bg-chill-sage/20 blur-3xl -z-10 
                            animate-pulse opacity-60"></div>
          </div>

          <div className="space-y-4">
            {/* Animated Greeting */}
            <div className="overflow-hidden">
              <SplitText
                text={greetingText}
                className="text-4xl font-black tracking-tight text-white inline-block"
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

            {/* Subline – fades in after greeting */}
            <p className={`text-gray-300 text-base font-medium flex items-center gap-2 transition-opacity duration-1000
                          ${hasAnimated ? 'opacity-100' : 'opacity-0'}`}>
              <Sparkles size={16} className="text-chill-sage" />
              Ready for your next chapter?
            </p>
          </div>
        </div>

        {/* Right: Stats */}
        <div className="flex flex-col sm:flex-row gap-8">
          {/* Continue Reading */}
          <div className="flex items-center gap-4 min-w-[240px]">
            <div className="relative p-3 rounded-2xl bg-chill-card/60 backdrop-blur-xl 
                            border border-white/10 shadow-inner">
              <BookOpen className="w-7 h-7 text-chill-sage" />
              <div className="absolute -inset-2 rounded-2xl bg-chill-sage/10 blur-xl -z-10"></div>
            </div>

            <div className="flex-1">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Continue Reading</p>
              {lastBook ? (
                <Link to={`/read/${lastBook.bookId.gutenbergId || lastBook.bookId._id}`} className="block mt-1 group">
                  <p className="font-bold text-white truncate max-w-[200px] 
                                group-hover:text-chill-sage transition-colors">
                    {lastBook.bookId.title}
                  </p>
                  <div className="w-full h-1.5 bg-chill-bg/50 rounded-full mt-2 overflow-hidden">
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
          <div className="flex items-center gap-4">
            <div className="relative p-3 rounded-2xl bg-chill-card/60 backdrop-blur-xl 
                            border border-white/10 shadow-inner">
              <Zap className="w-7 h-7 text-chill-sage" fill="currentColor" />
              <div className="absolute -inset-2 rounded-2xl bg-chill-sage/10 blur-xl -z-10"></div>
            </div>

            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Reading Streak</p>
              <p className="text-3xl font-black text-white mt-1">
                {streak}
                <span className="text-lg font-medium text-gray-400 ml-1">days</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom shimmer */}
      <div className="absolute bottom-0 left-10 right-10 h-px bg-gradient-to-r 
                      from-transparent via-chill-sage/30 to-transparent"></div>
    </div>
  );
};

export default UserInfo;