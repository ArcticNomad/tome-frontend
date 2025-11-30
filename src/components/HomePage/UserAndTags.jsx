import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { tags } from '../../data';
import { BookOpen, Trophy, SlidersHorizontal, Plus } from 'lucide-react';

const UserAndTags = () => {
  const { currentUser } = useAuth();
  const [activeTag, setActiveTag] = useState('All');

  // Mock calculation for the progress bar
  const readingGoal = 150;
  const progressPercentage = currentUser ? Math.min((currentUser.booksRead / readingGoal) * 100, 100) : 0;

  return (
    <div className="flex flex-col lg:flex-row gap-8 mb-10 items-stretch">
        
      {/* --- 1. User Stats "Widget" (Modernized) --- */}
      {currentUser && (
        <div className="lg:w-1/4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <img src={currentUser.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'} alt="User" className="w-16 h-16 rounded-full" />
          <div>
              <h3 className="font-bold text-gray-800">{currentUser.displayName}</h3>
              <div className="flex items-center text-sm text-gray-500 mt-1">
                  <BookOpen className="w-4 h-4 mr-1 text-purple-500" />
                  <span>0 Books read</span>
              </div>
          </div>
        </div>
      )}

      {/* --- 2. Floating Tag Bar (Modernized) --- */}
      <div className="flex-1 flex flex-col justify-center">
        <div className="flex items-center justify-between mb-3 px-1">
            <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Browse Tags</h4>
            <button className="text-gray-400 hover:text-gray-800 transition-colors">
                <SlidersHorizontal size={18} />
            </button>
        </div>

        <div className="relative group/tags">
            
            {/* Scroll Fade Mask (Right side) */}
            <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>

            <div className="flex items-center overflow-x-auto pb-4 pt-1 px-1 -mx-1 hide-scrollbar scroll-smooth">
                <div className="flex gap-3">
                    {tags.map((tag) => {
                        const isActive = activeTag === tag;
                        return (
                            <button
                                key={tag}
                                onClick={() => setActiveTag(tag)}
                                className={`
                                    relative px-6 py-2.5 rounded-2xl text-sm font-semibold whitespace-nowrap transition-all duration-300
                                    ${isActive 
                                        ? 'text-white shadow-lg shadow-purple-200 scale-105' 
                                        : 'bg-white text-gray-500 border border-gray-100 hover:border-purple-200 hover:text-purple-600 hover:bg-purple-50'
                                    }
                                `}
                            >
                                {/* Gradient Background for Active State */}
                                {isActive && (
                                    <div className="absolute inset-0 bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl -z-10"></div>
                                )}
                                {tag}
                            </button>
                        );
                    })}
                    
                    {/* Add Custom Tag Button */}
                    <button className="px-3 py-2.5 rounded-2xl border border-dashed border-gray-300 text-gray-400 hover:border-gray-400 hover:text-gray-600 transition-colors">
                        <Plus size={18} />
                    </button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default UserAndTags;