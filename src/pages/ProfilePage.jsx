import React, { useState, useEffect } from 'react';
import { Loader, LogOut, X } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useUserProfile } from '../hooks/useUserProfile';
import ErrorPage from './ErrorPage';

// Import refactored components
import ProfileHeader from '../components/profile/ProfileHeader';
import PersonalDetailsCard from '../components/profile/PersonalDetailsCard';
import ActivityStatsCard from '../components/profile/ActivityStatsCard';
import FavoriteBookCard from '../components/profile/FavoriteBookCard';
import CurrentlyReadingList from '../components/profile/CurrentlyReadingList';
import ReadingStatistics from '../components/profile/ReadingStatistics';

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  
  // Get authLoading to prevent flash of error page while checking session
  const { currentUser, logout, loading: authLoading } = useAuth();
  
  // Destructure loading as profileLoading to avoid naming conflict
  const { 
    profile, 
    loading: profileLoading, 
    error, 
    updateProfile, 
    getUserStats,
    getBookshelf 
  } = useUserProfile();
  
  const [userStats, setUserStats] = useState(null);
  const [currentlyReading, setCurrentlyReading] = useState([]);
  
  // New state for other shelf counts
  const [wantToReadCount, setWantToReadCount] = useState(0);
  const [readCount, setReadCount] = useState(0);
  
  // Fetch additional data on load
// ProfilePage.js - Update the useEffect
useEffect(() => {
  const fetchAdditionalData = async () => {
    if (profile) {
      try {
        // 1. Fetch statistics - ensure this is called
        const statsRes = await getUserStats();
        if (statsRes.success) {
          console.log('User Stats:', statsRes.data); // Debug log
          setUserStats(statsRes.data);
        } else {
          console.error('Failed to fetch stats:', statsRes);
        }
        
        // 2. Fetch bookshelves
        const [readingRes, wantRes, readRes] = await Promise.all([
          getBookshelf('currentlyReading'),
          getBookshelf('wantToRead'),
          getBookshelf('read')
        ]);

        if (readingRes.success) setCurrentlyReading(readingRes.data);
        if (wantRes.success) setWantToReadCount(wantRes.data.length);
        if (readRes.success) setReadCount(readRes.data.length);
        
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    }
  };
  
  fetchAdditionalData();
}, [profile, getUserStats, getBookshelf]); // Add dependencies
  const handleEdit = () => {
    setIsEditing(true);
    setEditForm({
      displayName: profile?.displayName || '',
      personalDetails: profile?.personalDetails || {},
      readingPreferences: profile?.readingPreferences || {}
    });
  };
  
  const handleSave = async () => {
    try {
      await updateProfile(editForm);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };
  
  const handleCancel = () => {
    setIsEditing(false);
    setEditForm({});
  };
  
  if (authLoading || (currentUser && profileLoading)) {
    return (
      <div className="min-h-screen bg-chill-bg flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-chill-sage animate-spin mx-auto" />
          <p className="mt-4 text-gray-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  // If not logged in (and not loading), show ErrorPage
  if (!currentUser) {
    return (
      <ErrorPage 
        statusCode="403" 
        message="Please log in to view your profile." 
      />
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen bg-chill-bg flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/20">
            <X className="w-8 h-8 text-red-400" />
          </div>
          <p className="mt-4 text-red-400">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-2 bg-chill-sage text-black font-bold rounded-xl hover:bg-chill-sand transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-chill-bg font-sans text-gray-200">
      
      {/* Main Content */}
      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 py-8 space-y-8">
        
        <ProfileHeader 
          profile={profile}
          isEditing={isEditing}
          editForm={editForm}
          setEditForm={setEditForm}
          handleSave={handleSave}
          handleCancel={handleCancel}
          handleEdit={handleEdit}
        />

        {/* Main Profile Information Grid */}
        <div className="bg-chill-surface rounded-[40px] p-8 shadow-2xl border border-white/5">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            <PersonalDetailsCard 
              profile={profile}
              currentUser={currentUser}
              isEditing={isEditing}
              editForm={editForm}
              setEditForm={setEditForm}
            />

            <ActivityStatsCard 
              profile={profile}
              userStats={userStats}
              isEditing={isEditing}
              editForm={editForm}
              setEditForm={setEditForm}
              currentlyReadingCount={currentlyReading?.length || 0}
              wantToReadCount={wantToReadCount}
              readCount={readCount}
            />

            <FavoriteBookCard 
              profile={profile}
              isEditing={isEditing}
              editForm={editForm}
              setEditForm={setEditForm}
              handleEdit={handleEdit}
            />
          </div>
        </div>

        <CurrentlyReadingList currentlyReading={currentlyReading} />

        <ReadingStatistics userStats={userStats} />

        {/* Logout Button */}
        <div className="flex justify-center pt-8 pb-12">
          <button 
            onClick={async () => {
              await logout();
              window.location.reload();
            }}
            className="group bg-red-500/10 text-red-400 px-10 py-3.5 rounded-full font-bold border border-red-500/20 hover:bg-red-500 hover:text-white transition-all shadow-lg flex items-center gap-3"
          >
            <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
            Sign Out
          </button>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;