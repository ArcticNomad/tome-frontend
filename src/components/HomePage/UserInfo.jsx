import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { BookOpen, Zap } from 'lucide-react';

const UserInfo = () => {
  const { currentUser } = useAuth();

  // Mock data for now
  const lastBook = {
    title: 'The Hobbit',
    author: 'J.R.R. Tolkien',
    progress: 75,
    coverImageUrl: 'https://covers.openlibrary.org/b/id/10302192-L.jpg',
  };

  if (!currentUser) {
    return null;
  }

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <img
          src={currentUser.photoURL || `https://api.dicebear.com/6.x/initials/svg?seed=${currentUser.displayName}`}
          alt="User Avatar"
          className="w-16 h-16 rounded-full border-4 border-white shadow-md"
        />
        <div>
          <h3 className="text-xl font-bold text-gray-800">
            Welcome back, {currentUser.displayName}!
          </h3>
          <p className="text-gray-500">Ready to dive into a new adventure?</p>
        </div>
      </div>
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-3">
          <BookOpen className="w-8 h-8 text-blue-500" />
          <div>
            <p className="text-sm text-gray-500">Continue Reading</p>
            <p className="font-bold text-gray-800">{lastBook.title}</p>
            <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
              <div
                className="bg-blue-500 h-1.5 rounded-full"
                style={{ width: `${lastBook.progress}%` }}
              ></div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Zap className="w-8 h-8 text-yellow-500" />
          <div>
            <p className="text-sm text-gray-500">Reading Streak</p>
            <p className="font-bold text-gray-800">5 days</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
