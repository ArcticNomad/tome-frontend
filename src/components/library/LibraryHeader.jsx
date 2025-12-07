import React from 'react';
import { BookOpen, Bookmark, BookmarkCheck } from 'lucide-react';

const LibraryHeader = ({ profile, stats }) => {
  return (
    <div className="bg-gradient-to-b from-chill-surface to-chill-bg border-b border-white/5">
      <div className="container mx-auto px-4 sm:px-6 pt-8 pb-12">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-chill-blue/10 text-chill-blue p-2 rounded-lg backdrop-blur-sm">
                <BookOpen size={20} />
              </span>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                Personal Library
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-2">
              My Library
            </h1>
            <p className="text-gray-400 max-w-2xl">
              {profile?.personalDetails?.firstName 
                ? `Welcome back, ${profile.personalDetails.firstName}!`
                : 'Your personal collection of books and reading lists'
              }
            </p>
          </div>

          {/* Stats Overview */}
          <div className="flex flex-wrap gap-4">
            <div className="bg-chill-card border border-white/5 rounded-2xl p-4 min-w-[140px]">
              <div className="flex items-center gap-2 mb-2">
                <BookOpen size={16} className="text-chill-blue" />
                <span className="text-sm text-gray-400">Total Books</span>
              </div>
              <div className="text-2xl font-bold text-white">
                {stats.totalBooks}
              </div>
            </div>
            
            <div className="bg-chill-card border border-white/5 rounded-2xl p-4 min-w-[140px]">
              <div className="flex items-center gap-2 mb-2">
                <Bookmark size={16} className="text-chill-sage" />
                <span className="text-sm text-gray-400">Reading Now</span>
              </div>
              <div className="text-2xl font-bold text-white">
                {stats.readingNow}
              </div>
            </div>
            
            <div className="bg-chill-card border border-white/5 rounded-2xl p-4 min-w-[140px]">
              <div className="flex items-center gap-2 mb-2">
                <BookmarkCheck size={16} className="text-purple-400" />
                <span className="text-sm text-gray-400">Finished</span>
              </div>
              <div className="text-2xl font-bold text-white">
                {stats.finished}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LibraryHeader;