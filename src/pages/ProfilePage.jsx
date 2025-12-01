import React, { useState, useEffect } from 'react';
import { 
  Edit3, BookOpen, Users, TrendingUp, Calendar, 
  Bookmark, Clock, Award, Star, Plus, 
  ChevronDown, Menu, X, LogOut, Heart,
  Upload, ChevronRight
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useUserProfile } from '../hooks/useUserProfile';
import { Link } from 'react-router-dom';
import ErrorPage from './ErrorPage';

const ProfilePage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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
  useEffect(() => {
    const fetchAdditionalData = async () => {
      if (profile) {
        // 1. Fetch statistics
        const statsRes = await getUserStats();
        if (statsRes.success) {
          setUserStats(statsRes.data);
        }
        
        // 2. Fetch ALL bookshelves to get accurate counts
        try {
          const [readingRes, wantRes, readRes] = await Promise.all([
            getBookshelf('currentlyReading'),
            getBookshelf('wantToRead'),
            getBookshelf('read')
          ]);

          if (readingRes.success) setCurrentlyReading(readingRes.data);
          if (wantRes.success) setWantToReadCount(wantRes.data.length);
          if (readRes.success) setReadCount(readRes.data.length);
          
        } catch (err) {
          console.error("Error fetching bookshelves:", err);
        }
      }
    };
    
    fetchAdditionalData();
  }, [profile]);
  
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
  
  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  // Calculate age from birthdate
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
  
  // Wait for both Auth and Profile to load
  // FIX: Only check profileLoading if currentUser exists.
  // If no user exists, profileLoading might be stuck at true, but it's irrelevant.
  if (authLoading || (currentUser && profileLoading)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
            <X className="w-8 h-8 text-red-500" />
          </div>
          <p className="mt-4 text-red-600">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-50 font-sans text-gray-800">
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 mt-6 space-y-8">
        
        {/* Profile Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              {isEditing ? (
                <input
                  type="text"
                  value={editForm.displayName || ''}
                  onChange={(e) => setEditForm(prev => ({ 
                    ...prev, 
                    displayName: e.target.value 
                  }))}
                  className="text-4xl font-bold border-b-2 border-blue-500 bg-transparent outline-none"
                  placeholder="Your name"
                />
              ) : (
                profile?.displayName || 'Reader'
              )}
            </h1>
            <p className="text-gray-600 mt-2">
              {profile?.personalDetails?.location?.city 
                ? `${profile.personalDetails.location.city}, ${profile.personalDetails.location.country || ''}`
                : 'Set your location'}
            </p>
          </div>
          
          {isEditing ? (
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-2.5 rounded-full text-sm font-medium hover:from-green-600 hover:to-emerald-600 transition shadow-md"
              >
                Save
              </button>
              <button
                onClick={handleCancel}
                className="bg-gradient-to-r from-gray-500 to-gray-600 text-white px-6 py-2.5 rounded-full text-sm font-medium hover:from-gray-600 hover:to-gray-700 transition"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button 
              onClick={handleEdit}
              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2.5 rounded-full text-sm font-medium items-center gap-2 hover:from-blue-600 hover:to-purple-600 transition shadow-md flex"
            >
              Edit Profile <Edit3 size={16} />
            </button>
          )}
        </div>

        {/* 1. Main Profile Card */}
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-soft border border-gray-100">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
            
            {/* Left: Profile Picture & Basic Info */}
            <div className="lg:col-span-4 flex flex-col items-center lg:items-start text-center lg:text-left space-y-6">
              <div className="relative">
                <div className="w-48 h-48 rounded-2xl overflow-hidden shadow-xl border-4 border-white bg-gradient-to-br from-blue-100 to-purple-100">
                  <img 
                    src={profile?.personalDetails?.profilePicture || 
                         `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser?.uid}&backgroundColor=b6e3f4`}
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {isEditing && (
                  <label className="absolute -bottom-3 -right-3 cursor-pointer">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg hover:from-blue-600 hover:to-purple-600 transition">
                      <Upload size={20} className="text-white" />
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
              <div className="space-y-3">
                {isEditing ? (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      >
                        <option value="">Select gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                        <option value="prefer-not-to-say">Prefer not to say</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Location
                      </label>
                      <div className="grid grid-cols-2 gap-2">
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
                          className="px-3 py-2 border border-gray-300 rounded-lg"
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
                          className="px-3 py-2 border border-gray-300 rounded-lg"
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    {profile?.personalDetails?.gender && (
                      <div className="flex items-center gap-2 text-gray-700">
                        <Users size={18} className="text-blue-500" />
                        <span>{profile.personalDetails.gender}</span>
                      </div>
                    )}
                    
                    {profile?.personalDetails?.birthDate && (
                      <div className="flex items-center gap-2 text-gray-700">
                        <Calendar size={18} className="text-pink-500" />
                        <span>
                          {formatDate(profile.personalDetails.birthDate)}
                          {calculateAge(profile.personalDetails.birthDate) && 
                           ` (${calculateAge(profile.personalDetails.birthDate)} years)`}
                        </span>
                      </div>
                    )}
                    
                    {profile?.personalDetails?.location?.city && (
                      <div className="flex items-center gap-2 text-gray-700">
                        <TrendingUp size={18} className="text-green-500" />
                        <span>
                          {profile.personalDetails.location.city}
                          {profile.personalDetails.location.country && 
                           `, ${profile.personalDetails.location.country}`}
                        </span>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-2 text-gray-700">
                      <Calendar size={18} className="text-purple-500" />
                      <span>
                        Member since {formatDate(profile?.createdAt)}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Middle: Stats & Reading Info */}
            <div className="lg:col-span-5 space-y-8">
              {/* Reading Stats */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl shadow-sm border border-blue-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center">
                      <BookOpen size={20} className="text-white" />
                    </div>
                    <div>
                      <span className="font-bold text-2xl text-slate-800">
                        {userStats?.basic?.booksRead || 0}
                      </span>
                      <p className="text-xs text-gray-600">Books Read</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl shadow-sm border border-purple-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-purple-500 flex items-center justify-center">
                      <Award size={20} className="text-white" />
                    </div>
                    <div>
                      <span className="font-bold text-2xl text-slate-800">
                        {userStats?.basic?.readingStreak || 0}
                      </span>
                      <p className="text-xs text-gray-600">Day Streak</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl shadow-sm border border-green-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-green-500 flex items-center justify-center">
                      <Clock size={20} className="text-white" />
                    </div>
                    <div>
                      <span className="font-bold text-2xl text-slate-800">
                        {userStats?.basic?.totalReadingTime || 0}
                      </span>
                      <p className="text-xs text-gray-600">Hours Read</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Favorite Genres */}
              <div>
                <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                  <Heart size={18} className="text-red-500" />
                  Favorite Genres
                </h3>
                
                {isEditing ? (
                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-2">
                      {[
                        'Romance', 'Mystery/Thriller', 'Fantasy', 'Science Fiction',
                        'Historical Fiction', 'Biography', 'Self-Help', 'Young Adult'
                      ].map((genre) => (
                        <button
                          key={genre}
                          type="button"
                          onClick={() => {
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
                          }}
                          className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                            editForm.readingPreferences?.favoriteGenres?.includes(genre)
                              ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {genre}
                        </button>
                      ))}
                    </div>
                    <p className="text-sm text-gray-500">
                      Selected: {editForm.readingPreferences?.favoriteGenres?.length || 0} genres
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {profile?.readingPreferences?.favoriteGenres?.map((genre, index) => (
                      <span 
                        key={index}
                        className="px-3 py-1.5 bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 rounded-full text-sm font-medium border border-blue-200"
                      >
                        {genre}
                      </span>
                    ))}
                    {(!profile?.readingPreferences?.favoriteGenres || 
                      profile.readingPreferences.favoriteGenres.length === 0) && (
                      <p className="text-gray-500 italic">No favorite genres selected yet</p>
                    )}
                  </div>
                )}
              </div>

              {/* Bookshelves */}
              <div>
                <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
                  <Bookmark size={20} className="text-green-500" />
                  My Bookshelves
                </h3>
                <div className="flex flex-wrap gap-3">
                  <Link
                    to="/bookshelf/currently-reading"
                    className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl text-sm font-medium hover:from-blue-600 hover:to-blue-700 transition shadow-md"
                  >
                    Currently Reading <br/> 
                    <span className="text-xs opacity-90 font-normal">
                      ({currentlyReading?.length || 0} books)
                    </span>
                  </Link>
                  
                  <Link
                    to="/bookshelf/want-to-read"
                    className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl text-sm font-medium hover:from-green-600 hover:to-emerald-700 transition shadow-md"
                  >
                    Want to Read <br/> 
                    <span className="text-xs opacity-90 font-normal">
                      ({wantToReadCount} books)
                    </span>
                  </Link>
                  
                  <Link
                    to="/bookshelf/read"
                    className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-6 py-3 rounded-xl text-sm font-medium hover:from-purple-600 hover:to-purple-700 transition shadow-md"
                  >
                    Finished <br/> 
                    <span className="text-xs opacity-90 font-normal">
                      ({readCount} books)
                    </span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Right: Favorite Book */}
            <div className="lg:col-span-3">
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 h-full flex flex-col items-center justify-center text-center shadow-md border border-amber-100">
                <div className="mb-4">
                  <h3 className="text-amber-900 font-bold text-xl mb-1">FAVORITE BOOK</h3>
                </div>
                
                {isEditing ? (
                  <div className="w-full">
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
                      placeholder="Enter your favorite book"
                      className="w-full px-4 py-3 border border-amber-300 rounded-lg mb-4"
                    />
                    <p className="text-sm text-amber-700">This will appear on your profile</p>
                  </div>
                ) : (
                  <>
                    <div className="mb-4">
                      <p className="text-amber-800 text-lg font-semibold">
                        {profile?.readingPreferences?.favoriteBook || 'Not set yet'}
                      </p>
                    </div>
                    
                    <button className="mt-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white px-6 py-2 rounded-full text-sm font-medium flex items-center gap-2 hover:from-amber-600 hover:to-amber-700 transition">
                      <Plus size={16} />
                      {profile?.readingPreferences?.favoriteBook ? 'Change' : 'Add Favorite'}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 2. Currently Reading Section */}
        {currentlyReading && currentlyReading.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <BookOpen size={24} />
              Currently Reading
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentlyReading.slice(0, 3).map((item) => (
                <div key={item._id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  {item.bookId && (
                    <>
                      <div className="flex items-start gap-4">
                        <div className="w-16 h-24 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg flex-shrink-0">
                          {item.bookId.coverImageUrl && (
                            <img src={item.bookId.coverImageUrl} alt="Cover" className="w-full h-full object-cover rounded-lg" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-bold text-lg">{item.bookId.title}</h3>
                          <p className="text-gray-600 text-sm">{item.bookId.author}</p>
                          <div className="mt-4">
                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                                style={{ width: '0%' }}
                              ></div>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">Start reading to track progress</p>
                          </div>
                        </div>
                      </div>
                      <Link 
                        to={`/read/${item.bookId.gutenbergId || item.bookId._id}`}
                        className="w-full mt-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 text-blue-600 rounded-lg font-medium hover:from-blue-100 hover:to-purple-100 transition block text-center"
                      >
                        Continue Reading
                      </Link>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. Reading Statistics */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-slate-800">Reading Statistics</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Reading Time Chart */}
            <div className="lg:col-span-2 bg-white rounded-3xl p-6 shadow-soft border border-gray-100">
              <h3 className="text-lg font-bold text-slate-800 mb-4">Weekly Reading Time</h3>
              {/* Add chart component here */}
              <div className="h-48 flex items-center justify-center text-gray-400 bg-gray-50 rounded-xl">
                [Reading time chart will appear here]
              </div>
            </div>
            
            {/* Quick Stats */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-6 border border-blue-100">
              <h3 className="text-lg font-bold text-slate-800 mb-4">Quick Stats</h3>
              <div className="space-y-4">
                {userStats?.calculated && (
                  <>
                    <div>
                      <p className="text-sm text-gray-600">Books per Month</p>
                      <p className="text-2xl font-bold">{userStats.calculated.booksPerMonth}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Reading Efficiency</p>
                      <p className="text-2xl font-bold">
                        {userStats.calculated.readingEfficiency} pages/hour
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Completion Rate</p>
                      <p className="text-2xl font-bold">
                        {userStats.calculated.completionRate}%
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <div className="flex justify-center pt-8">
          <button 
            onClick={async () => {
              await logout();
              window.location.reload();
            }}
            className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-10 py-3.5 rounded-full font-bold hover:from-red-600 hover:to-pink-600 transition shadow-lg flex items-center gap-3"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;