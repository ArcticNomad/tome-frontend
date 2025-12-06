import React from 'react';
import { Star, Plus } from 'lucide-react';

const FavoriteBookCard = ({ 
  profile, 
  isEditing, 
  editForm, 
  setEditForm, 
  handleEdit 
}) => {
  return (
    <div className="lg:col-span-3">
      <div className="bg-gradient-to-br from-amber-900/20 to-orange-900/20 rounded-[32px] p-8 h-full flex flex-col items-center justify-center text-center border border-amber-500/10 relative overflow-hidden group">
        <div className="absolute inset-0 bg-noise opacity-5"></div>
        
        <div className="relative z-10 mb-6">
          <Star className="w-12 h-12 text-amber-500 fill-amber-500/20 mx-auto mb-4" />
          <h3 className="text-amber-500 font-bold text-sm tracking-widest uppercase mb-2">Favorite Book</h3>
        </div>
        
        {isEditing ? (
          <div className="w-full relative z-10">
            <input
              type="text"
              value={editForm.readingPreferences?.favoriteBook || ''}
              onChange={(e) => setEditForm(prev => ({
                ...prev,
                readingPreferences: {
                  ...prev.readingPreferences,
                  favoriteBook: e.target.value
                }
              }))}
              placeholder="Enter title..."
              className="w-full px-4 py-3 bg-black/30 border border-amber-500/30 rounded-xl text-amber-100 placeholder-amber-500/50 focus:outline-none focus:border-amber-500 mb-4 text-center"
            />
            <p className="text-xs text-amber-500/70">This will appear on your profile</p>
          </div>
        ) : (
          <div className="relative z-10">
            <div className="mb-6">
              <p className="text-white text-xl font-bold italic font-serif leading-relaxed">
                "{profile?.readingPreferences?.favoriteBook || 'Not set yet'}"
              </p>
            </div>
            
            {!profile?.readingPreferences?.favoriteBook && (
              <button onClick={handleEdit} className="mt-4 bg-amber-500/20 text-amber-500 px-6 py-2 rounded-full text-sm font-bold flex items-center gap-2 hover:bg-amber-500 hover:text-black transition-all mx-auto">
                <Plus size={16} />
                Add Favorite
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoriteBookCard;