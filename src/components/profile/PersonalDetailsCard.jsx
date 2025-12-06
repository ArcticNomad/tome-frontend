import React from 'react';
import { Upload, Users, Calendar, TrendingUp, Clock } from 'lucide-react';

const PersonalDetailsCard = ({ 
  profile, 
  currentUser, 
  isEditing, 
  editForm, 
  setEditForm 
}) => {

  // Helper functions specific to this component
  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  const calculateAge = (birthDate) => {
    if (!birthDate) return null;
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <div className="lg:col-span-4 flex flex-col items-center lg:items-start text-center lg:text-left space-y-8">
      <div className="relative group">
        <div className="w-48 h-48 rounded-[32px] overflow-hidden shadow-2xl border border-white/10 bg-chill-bg">
          <img 
            src={profile?.personalDetails?.profilePicture || 
                 `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser?.uid}&backgroundColor=b6e3f4`}
            alt="Profile" 
            className="w-full h-full object-cover"
          />
        </div>
        
        {isEditing && (
          <label className="absolute -bottom-3 -right-3 cursor-pointer">
            <div className="w-12 h-12 bg-chill-sage rounded-2xl flex items-center justify-center shadow-lg hover:bg-chill-sand transition-colors text-black transform hover:scale-105">
              <Upload size={20} />
            </div>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={async (e) => {
                const file = e.target.files[0];
                if (file) {
                  // Implement file upload here
                }
              }}
            />
          </label>
        )}
      </div>
      
      {/* Personal Info */}
      <div className="space-y-4 w-full">
        {isEditing ? (
          <div className="space-y-4 bg-chill-bg/50 p-6 rounded-3xl border border-white/5">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
                Gender
              </label>
              <select
                value={editForm.personalDetails?.gender || ''}
                onChange={(e) => setEditForm(prev => ({
                  ...prev,
                  personalDetails: {
                    ...prev.personalDetails,
                    gender: e.target.value
                  }
                }))}
                className="w-full px-4 py-3 bg-chill-card border border-white/10 rounded-xl text-white focus:outline-none focus:border-chill-sage appearance-none"
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
                <option value="prefer-not-to-say">Prefer not to say</option>
              </select>
            </div>
            
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
                Birth Date
              </label>
              <input
                type="date"
                value={editForm.personalDetails?.birthDate?.split('T')[0] || ''}
                onChange={(e) => setEditForm(prev => ({
                  ...prev,
                  personalDetails: {
                    ...prev.personalDetails,
                    birthDate: e.target.value
                  }
                }))}
                className="w-full px-4 py-3 bg-chill-card border border-white/10 rounded-xl text-white focus:outline-none focus:border-chill-sage"
              />
            </div>
            
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
                Location
              </label>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="City"
                  value={editForm.personalDetails?.location?.city || ''}
                  onChange={(e) => setEditForm(prev => ({
                    ...prev,
                    personalDetails: {
                      ...prev.personalDetails,
                      location: {
                        ...prev.personalDetails?.location,
                        city: e.target.value
                      }
                    }
                  }))}
                  className="px-4 py-3 bg-chill-card border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-chill-sage"
                />
                <input
                  type="text"
                  placeholder="Country"
                  value={editForm.personalDetails?.location?.country || ''}
                  onChange={(e) => setEditForm(prev => ({
                    ...prev,
                    personalDetails: {
                      ...prev.personalDetails,
                      location: {
                        ...prev.personalDetails?.location,
                        country: e.target.value
                      }
                    }
                  }))}
                  className="px-4 py-3 bg-chill-card border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-chill-sage"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-3 px-4">
            {profile?.personalDetails?.gender && (
              <div className="flex items-center gap-3 text-gray-300">
                <div className="p-2 rounded-full bg-chill-bg text-chill-blue border border-white/5">
                  <Users size={16} />
                </div>
                <span className="capitalize">{profile.personalDetails.gender}</span>
              </div>
            )}
            
            {profile?.personalDetails?.birthDate && (
              <div className="flex items-center gap-3 text-gray-300">
                <div className="p-2 rounded-full bg-chill-bg text-chill-rose border border-white/5">
                  <Calendar size={16} />
                </div>
                <span>
                  {formatDate(profile.personalDetails.birthDate)}
                  {calculateAge(profile.personalDetails.birthDate) && 
                   ` (${calculateAge(profile.personalDetails.birthDate)} years)`}
                </span>
              </div>
            )}
            
            {profile?.personalDetails?.location?.city && (
              <div className="flex items-center gap-3 text-gray-300">
                <div className="p-2 rounded-full bg-chill-bg text-chill-sage border border-white/5">
                  <TrendingUp size={16} />
                </div>
                <span>
                  {profile.personalDetails.location.city}
                  {profile.personalDetails.location.country && 
                   `, ${profile.personalDetails.location.country}`}
                </span>
              </div>
            )}
            
            <div className="flex items-center gap-3 text-gray-300">
              <div className="p-2 rounded-full bg-chill-bg text-purple-400 border border-white/5">
                <Clock size={16} />
              </div>
              <span>
                Member since {formatDate(profile?.createdAt)}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PersonalDetailsCard;