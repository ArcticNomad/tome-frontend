import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useUserProfile } from '../../hooks/useUserProfile';
import { BookOpen, Zap, Loader } from 'lucide-react';
import { Link } from 'react-router-dom';

const UserInfo = () => {
  const { currentUser, getIdToken } = useAuth();
  const { getUserStats } = useUserProfile();
  
  const [streak, setStreak] = useState(0);
  const [lastBook, setLastBook] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchDashboardData = async () => {
      if (!currentUser) return;

      try {
        // Only set loading if we don't have data yet to prevent minor flashes on re-focus
        setLoading(true);
        
        const token = await getIdToken();
        if (!token) return;

        const [statsData, historyResponse] = await Promise.all([
          getUserStats(),
          fetch('http://localhost:5000/api/users/reading-history', {
            headers: { 'Authorization': `Bearer ${token}` }
          })
        ]);

        if (!isMounted) return;

        // 1. Process User Stats (Streak)
        if (statsData?.success) {
          setStreak(statsData.data.basic?.readingStreak || 0);
        }

        // 2. Process Reading History
        if (historyResponse.ok) {
          const historyData = await historyResponse.json();
          const history = historyData.data?.history || [];
          
          if (history.length > 0) {
            const sortedHistory = history.sort((a, b) => 
              new Date(b.lastRead) - new Date(a.lastRead)
            );
            setLastBook(sortedHistory[0]);
          }
        }
      } catch (error) {
        console.error("Failed to load user info:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchDashboardData();

    return () => {
      isMounted = false;
    };
    // FIX: Only depend on the User ID (stable string) rather than the function references
    // This prevents the infinite loop/blinking caused by hook recreation
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser?.uid]);

  if (!currentUser) {
    return null;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-between opacity-50 animate-pulse bg-white p-6 rounded-3xl border border-stone-100 shadow-sm">
         <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
            <div className="space-y-2">
              <div className="h-4 w-32 bg-gray-200 rounded"></div>
              <div className="h-3 w-48 bg-gray-200 rounded"></div>
            </div>
         </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-6 rounded-3xl border border-stone-100 shadow-sm">
      {/* User Greeting */}
      <div className="flex items-center gap-4">
        <img
          src={currentUser.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser.uid}`}
          alt="User Avatar"
          className="w-16 h-16 rounded-full border-4 border-stone-50 shadow-sm object-cover"
        />
        <div>
          <h3 className="text-xl font-bold text-stone-800">
            Welcome back, {currentUser.displayName?.split(' ')[0] || 'Reader'}!
          </h3>
          <p className="text-stone-500 text-sm">Ready to dive into a new adventure?</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-12">
        {/* Last Read Book */}
        <div className="flex items-center gap-3 min-w-[200px]">
          <div className="p-2 bg-blue-50 rounded-full text-blue-500">
            <BookOpen className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <p className="text-xs font-medium text-stone-400 uppercase tracking-wider">Continue Reading</p>
            {lastBook ? (
              <Link to={`/read/${lastBook.bookId.gutenbergId || lastBook.bookId._id}`} className="group block">
                <p className="font-bold text-stone-800 truncate max-w-[180px] group-hover:text-blue-600 transition">
                  {lastBook.bookId.title}
                </p>
                <div className="w-full bg-stone-100 rounded-full h-1.5 mt-2 overflow-hidden">
                  <div
                    className="bg-blue-500 h-1.5 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${lastBook.progress || 0}%` }}
                  ></div>
                </div>
              </Link>
            ) : (
              <p className="text-sm text-stone-500 italic">No active book</p>
            )}
          </div>
        </div>

        {/* Reading Streak */}
        <div className="flex items-center gap-3">
          <div className="p-2 bg-yellow-50 rounded-full text-yellow-500">
            <Zap className="w-6 h-6" fill="currentColor" />
          </div>
          <div>
            <p className="text-xs font-medium text-stone-400 uppercase tracking-wider">Reading Streak</p>
            <p className="font-bold text-stone-800 text-lg">
              {streak} <span className="text-sm font-normal text-stone-500">days</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserInfo;