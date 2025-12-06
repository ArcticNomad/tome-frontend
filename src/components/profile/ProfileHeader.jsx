import React from 'react';
import { Edit3 } from 'lucide-react';

const ProfileHeader = ({ 
  profile, 
  isEditing, 
  editForm, 
  setEditForm, 
  handleSave, 
  handleCancel, 
  handleEdit 
}) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-4xl font-black text-white">
          {isEditing ? (
            <input
              type="text"
              value={editForm.displayName || ''}
              onChange={(e) => setEditForm(prev => ({ 
                ...prev, 
                displayName: e.target.value 
              }))}
              className="bg-transparent border-b-2 border-chill-sage outline-none text-white w-full max-w-md focus:border-chill-sand transition-colors"
              placeholder="Your name"
            />
          ) : (
            profile?.displayName || 'Reader'
          )}
        </h1>
        <p className="text-chill-sage mt-2 text-lg font-medium">
          {profile?.personalDetails?.location?.city 
            ? `${profile.personalDetails.location.city}, ${profile.personalDetails.location.country || ''}`
            : 'Set your location'}
        </p>
      </div>
      
      {isEditing ? (
        <div className="flex gap-3">
          <button
            onClick={handleSave}
            className="bg-chill-sage text-black px-6 py-2.5 rounded-xl font-bold hover:bg-chill-sand transition-colors shadow-glow-sage"
          >
            Save Changes
          </button>
          <button
            onClick={handleCancel}
            className="bg-chill-card border border-white/10 text-gray-300 px-6 py-2.5 rounded-xl font-medium hover:bg-white/5 transition-colors"
          >
            Cancel
          </button>
        </div>
      ) : (
        <button 
          onClick={handleEdit}
          className="bg-chill-card border border-white/10 text-chill-sage px-6 py-2.5 rounded-xl font-medium flex items-center gap-2 hover:bg-white/5 hover:text-white transition-all shadow-lg"
        >
          Edit Profile <Edit3 size={16} />
        </button>
      )}
    </div>
  );
};

export default ProfileHeader;