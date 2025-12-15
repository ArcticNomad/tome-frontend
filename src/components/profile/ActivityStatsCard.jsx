import React from 'react';
import { BookOpen, Award, Clock, Heart, Bookmark } from 'lucide-react';
import { Link } from 'react-router-dom';

const ActivityStatsCard = ({ 
  profile, 
  userStats, 
  isEditing, 
  editForm, 
  setEditForm,
  currentlyReadingCount,
  wantToReadCount,
  readCount
}) => {
  
  const genresList = [
      'Romance', 'Mystery/Thriller', 'Fantasy', 'Science Fiction', 
      'Historical Fiction', 'Biography', 'Self-Help', 'Young Adult',
      'Horror', 'Literary Fiction', 'Poetry', 'Drama', 'Classics',
      'Non-fiction', 'Comedy', 'Adventure'
    ]

  const handleGenreToggle = (genre) => {
    const currentGenres = editForm.readingPreferences?.favoriteGenres || [];
    const isSelected = currentGenres.includes(genre);
    const newGenres = isSelected
      ? currentGenres.filter(g => g !== genre)
      : [...currentGenres, genre];
    
    setEditForm(prev => ({
      ...prev,
      readingPreferences: {
        ...prev.readingPreferences,
        favoriteGenres: newGenres
      }
    }));
  };

  return (
    <div className="lg:col-span-5 space-y-8">
      {/* Reading Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <StatItem 
          icon={<BookOpen size={20} />} 
          value={userStats?.basic?.booksRead || 0} 
          label="Books Read" 
          colorClass="text-chill-blue" 
        />
        <StatItem 
          icon={<Award size={20} />} 
          value={userStats?.basic?.readingStreak || 0} 
          label="Day Streak" 
          colorClass="text-purple-400" 
        />
        <StatItem 
          icon={<Clock size={20} />} 
          value={userStats?.basic?.totalReadingTime || 0} 
          label="Hours Read" 
          colorClass="text-chill-sage" 
        />
      </div>

      {/* Favorite Genres */}
      <div>
        <h3 className="font-bold text-lg text-white mb-4 flex items-center gap-2">
          <Heart size={18} className="text-chill-rose fill-chill-rose" />
          Favorite Genres
        </h3>
        
        {isEditing ? (
          <div className="space-y-4 bg-chill-bg/50 p-6 rounded-3xl border border-white/5">
            <div className="flex flex-wrap gap-2">
              {genresList.map((genre) => (
                <button
                  key={genre}
                  type="button"
                  onClick={() => handleGenreToggle(genre)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    editForm.readingPreferences?.favoriteGenres?.includes(genre)
                      ? 'bg-chill-sage text-black shadow-glow-sage'
                      : 'bg-chill-card text-gray-400 border border-white/10 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  {genre}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
              Selected: {editForm.readingPreferences?.favoriteGenres?.length || 0} genres
            </p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {profile?.readingPreferences?.favoriteGenres?.map((genre, index) => (
              <span 
                key={index}
                className="px-4 py-2 bg-chill-bg border border-white/5 text-chill-blue rounded-full text-sm font-medium hover:border-chill-blue/30 transition-colors"
              >
                {genre}
              </span>
            ))}
            {(!profile?.readingPreferences?.favoriteGenres || 
              profile.readingPreferences.favoriteGenres.length === 0) && (
              <p className="text-gray-500 italic px-4">No favorite genres selected yet</p>
            )}
          </div>
        )}
      </div>

      {/* Bookshelves Links */}
      <div>
        <h3 className="font-bold text-xl text-white mb-4 flex items-center gap-2">
          <Bookmark size={20} className="text-chill-sage" />
          My Bookshelves
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <ShelfLink to="/library" label="Reading" count={currentlyReadingCount} color="text-chill-blue" />
          <ShelfLink to="/library" label="Want to Read" count={wantToReadCount} color="text-chill-sage" />
          <ShelfLink to="/library" label="Finished" count={readCount} color="text-purple-400" />
        </div>
      </div>
    </div>
  );
};

// Sub-components for internal use
const StatItem = ({ icon, value, label, colorClass }) => (
  <div className="bg-chill-card p-5 rounded-3xl border border-white/5 hover:border-white/10 transition-colors">
    <div className="flex flex-col gap-3">
      <div className={`w-10 h-10 rounded-2xl bg-chill-bg border border-white/5 flex items-center justify-center ${colorClass} shadow-inner`}>
        {icon}
      </div>
      <div>
        <span className="font-black text-3xl text-white block mb-1">
          {value}
        </span>
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</p>
      </div>
    </div>
  </div>
);

const ShelfLink = ({ to, label, count, color }) => (
  <Link
    to={to}
    className="bg-chill-card border border-white/10 p-4 rounded-2xl group hover:bg-white/5 transition-all"
  >
    <div className={`text-sm font-medium ${color} mb-1 group-hover:text-white transition-colors`}>{label}</div>
    <div className="text-2xl font-bold text-white">
      {count} <span className="text-sm font-normal text-gray-500">books</span>
    </div>
  </Link>
);

export default ActivityStatsCard;