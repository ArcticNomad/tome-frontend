// src/hooks/useUserProfile.js
import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';

export const useUserProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser, getIdToken } = useAuth();


 const createProfile = async (profileData) => {
    try {
      setLoading(true);
      if (!currentUser) throw new Error("No user logged in");
      
      const token = await getIdToken();
      
      // 👇 CHANGE THIS LINE: Use the full http://localhost:5000 URL
      const response = await fetch('http://localhost:5000/api/users/profile/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profileData)
      });

      if (!response.ok) {
        // If we still get a 404 here, the backend route truly doesn't exist
        const errorText = await response.text();
        console.error("Backend Error Response:", errorText); 
        throw new Error(`Server responded with ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      setProfile(data.data);
      return data;
    } catch (err) {
      console.error("Profile Creation Failed:", err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  const fetchProfile = async () => {
    if (!currentUser) {
      setProfile(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const token = await getIdToken();
      
      const response = await fetch('/api/users/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }

      const data = await response.json();
      setProfile(data.data);
      setError(null);
    } catch (err) {
      setError(err.message);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates) => {
    try {
      const token = await getIdToken();
      
      const response = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updates)
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const data = await response.json();
      setProfile(data.data);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const addToBookshelf = async (bookId, shelfType, gutenbergId) => {
    try {
      const token = await getIdToken();
      
      const response = await fetch('/api/users/bookshelves', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ bookId, shelfType, gutenbergId })
      });

      if (!response.ok) {
        throw new Error('Failed to add to bookshelf');
      }

      return await response.json();
    } catch (err) {
      throw err;
    }
  };

  const getBookshelf = async (shelfType) => {
    // ✅ Safety Check: If not logged in, return empty/null immediately
    if (!currentUser) return { success: true, data: [] };
    try {
      const token = await getIdToken();
      
      const response = await fetch(`/api/users/bookshelves/${shelfType}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch bookshelf');
      }

      return await response.json();
    } catch (err) {
      throw err;
    }
  };

  const updateReadingProgress = async (progressData) => {
    try {
      const token = await getIdToken();
      
      const response = await fetch('/api/users/reading-progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(progressData)
      });

      if (!response.ok) {
        throw new Error('Failed to update reading progress');
      }

      return await response.json();
    } catch (err) {
      throw err;
    }
  };

  const toggleFavorite = async (bookId) => {
    try {
      const token = await getIdToken();
      
      const response = await fetch(`/api/users/favorites/${bookId}/toggle`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to toggle favorite');
      }

      return await response.json();
    } catch (err) {
      throw err;
    }
  };

   // ✅ NEW FUNCTION: Check status in one call
  const getBookStatus = async (bookId) => {
    if (!currentUser) return null;
    try {
      const token = await getIdToken();
      if (!token) return null;

      const response = await fetch(`http://localhost:5000/api/users/books/${bookId}/status`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        return data.status; // Returns 'currentlyReading', 'wantToRead', etc.
      }
      return null;
    } catch (err) {
      console.error("Status check failed:", err);
      return null;
    }
  };

  const getUserStats = async () => {
    try {
      const token = await getIdToken();
      
      const response = await fetch('/api/users/statistics', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch statistics');
      }

      return await response.json();
    } catch (err) {
      throw err;
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchProfile();
    }
  }, [currentUser]);

  return {
    profile,
    loading,
    error,
    fetchProfile,
    createProfile,
    updateProfile,
    addToBookshelf,
    getBookshelf,
    updateReadingProgress,
    toggleFavorite,
    getUserStats,
    getBookStatus,
    refetch: fetchProfile
  };
};