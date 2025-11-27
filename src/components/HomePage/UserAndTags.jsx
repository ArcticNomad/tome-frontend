// src/components/UserAndTags.jsx
import React, { useState } from 'react';
import { currentUser, tags } from '../../data';
import { BookOpen } from 'lucide-react';

const UserAndTags = () => {
  const [activeTag, setActiveTag] = useState('All');

  return (
    <div className="flex flex-col lg:flex-row gap-6 mb-8">
        
      {/* --- User Quick Info Section --- */}
      <div className="lg:w-1/4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
        <img src={currentUser.avatar} alt="User" className="w-16 h-16 rounded-full" />
        <div>
            <h3 className="font-bold text-gray-800">{currentUser.name}</h3>
            <div className="flex items-center text-sm text-gray-500 mt-1">
                <BookOpen className="w-4 h-4 mr-1 text-purple-500" />
                <span>{currentUser.booksRead} Books read</span>
            </div>
        </div>
      </div>

      {/* --- Tag Bar Section --- */}
      <div className="flex-1 flex items-center overflow-x-auto pb-2 lg:pb-0 hide-scrollbar">
        <div className="flex gap-3">
            {tags.map((tag) => (
            <button
                key={tag}
                onClick={() => setActiveTag(tag)}
                className={`px-6 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                activeTag === tag 
                    ? 'bg-gray-800 text-white shadow-md' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
            >
                {tag}
            </button>
            ))}
        </div>
      </div>
    </div>
  );
};

export default UserAndTags;