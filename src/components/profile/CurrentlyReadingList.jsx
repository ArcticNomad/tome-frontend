import { useCallback } from "react";
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useUserProfile } from '../../hooks/useUserProfile';
import { BookOpen, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';




const CurrentlyReadingList = ({ currentlyReading }) => {
  const { currentUser } = useAuth();
  const { getReadingHistory } = useUserProfile();
  
  const [readingProgressMap, setReadingProgressMap] = useState({});
  const [loading, setLoading] = useState(true);

  const hasFetched = useRef(false);
  const lastCount = useRef(0); // tracks number of books to detect real changes

  useEffect(() => {
    if (!currentUser) return;
    if (!currentlyReading) return;

    // Only refetch when the number of books changes
    if (lastCount.current !== currentlyReading.length) {
      hasFetched.current = false;
      lastCount.current = currentlyReading.length;
    }

    if (hasFetched.current) return;

    if (currentlyReading.length === 0) {
      setLoading(false);
      return;
    }

    const fetchProgress = async () => {
      setLoading(true);

      const history = await getReadingHistory();

      if (history?.success) {
        const map = {};

        history.data.history.forEach(item => {
          const bookId = item.bookId?._id || item.bookId;

          map[bookId] = {
            progress: item.progress || 0,
            currentPage: item.currentPage,
            totalPages: item.totalPages
          };
        });

        setReadingProgressMap(map);
      }

      hasFetched.current = true;
      setLoading(false);
    };

    fetchProgress();
  }, [currentUser, currentlyReading]); // SAFE now

  const getBookProgress = (bookId) => {
    const progressData = readingProgressMap[bookId];
    if (!progressData) return 0;
    return Math.min(100, Math.max(0, progressData.progress || 0));
  };

  const getProgressData = (bookId) => readingProgressMap[bookId] || {};

  const getProgressLabel = (percentage) => {
    if (percentage === 0) return 'Not started';
    if (percentage < 10) return 'Just started';
    if (percentage < 30) return 'Getting into it';
    if (percentage < 50) return 'Halfway there';
    if (percentage < 80) return 'Making progress';
    if (percentage < 100) return 'Almost done';
    return 'Completed';
  };

  if (!currentlyReading || currentlyReading.length === 0) return null;

  if (loading) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
          <BookOpen size={24} className="text-chill-blue" />
          Currently Reading
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-chill-card rounded-[24px] p-6 border border-white/5 animate-pulse">
              <div className="flex items-start gap-5">
                <div className="w-20 h-28 bg-gray-700 rounded-xl"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-700 rounded w-1/2"></div>
                  <div className="space-y-1">
                    <div className="h-2 bg-gray-700 rounded w-full"></div>
                    <div className="h-2 bg-gray-700 rounded w-2/3"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white flex items-center gap-3">
        <BookOpen size={24} className="text-chill-blue" />
        Currently Reading
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentlyReading.slice(0, 3).map((item) => {
          const book = item.bookId || item;
          const bookId = book._id || book.toString();

          const progress = getBookProgress(bookId);
          const progressData = getProgressData(bookId);
          const progressLabel = getProgressLabel(progress);

          return (
            <div key={item._id || bookId} className="bg-chill-card rounded-[24px] p-6 border border-white/5 hover:border-white/10 transition-colors group">
              <div className="flex items-start gap-5">
                <div className="w-20 h-28 bg-chill-bg rounded-xl overflow-hidden border border-white/5 group-hover:scale-105 transition-transform duration-500">
                  {book.coverImageUrl && (
                    <img 
                      src={book.coverImageUrl} 
                      alt="Cover" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/150x225?text=No+Cover';
                      }}
                    />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-lg text-white truncate">{book.title}</h3>
                  <p className="text-gray-400 text-sm mb-4">{book.author}</p>

                  <div>
                    <div className="flex justify-between text-xs text-gray-500 mb-1.5">
                      <span>{progressLabel}</span>
                      <span>{progress}%</span>
                    </div>

                    <div className="h-1.5 bg-chill-bg rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${
                          progress < 30 ? 'bg-chill-rose' :
                          progress < 70 ? 'bg-chill-sage' :
                          'bg-chill-blue'
                        }`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>

                    {progressData.currentPage && (
                      <div className="text-xs text-gray-500 mt-1">
                        Page {progressData.currentPage}
                        {progressData.totalPages && ` of ${progressData.totalPages}`}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <Link 
                to={`/read/${book.gutenbergId || bookId}`}
                className="w-full mt-6 py-3 bg-white/5 text-white rounded-xl font-bold hover:bg-chill-sage hover:text-black transition-all flex items-center justify-center gap-2 group/btn"
              >
                {progress >= 100 ? 'Re-read' : 'Continue Reading'} 
                <ChevronRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CurrentlyReadingList;
