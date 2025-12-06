// src/hooks/useBecauseYouLiked.js
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { standardBooks } from '../data';

// API function to add to your books.js
const fetchBecauseYouLiked = async (options = {}) => {
  const { limit = 10 } = options;
  
  const { auth } = await import('../firebase/config');
  const currentUser = auth.currentUser;
  
  const headers = {
    'Content-Type': 'application/json',
    ...(currentUser?.uid && { 'firebaseuid': currentUser.uid }),
  };
  
  const queryString = new URLSearchParams({ limit }).toString();
  const response = await fetch(`/api/books/because-you-liked${queryString ? `?${queryString}` : ''}`, {
    headers
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  
  return response.json();
};

export const useBecauseYouLiked = (options = {}) => {
  const { currentUser, loading: authLoading } = useAuth();
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [source, setSource] = useState('fallback');
  const [sourceBook, setSourceBook] = useState(null);
  const [message, setMessage] = useState('');
  
  const {
    limit = 10,
    autoFetch = true
  } = options;

  const fetchBecauseYouLikedData = useCallback(async () => {
    if (!autoFetch) return;
    
    try {
      setIsLoading(true);
      setError(null);
      console.log('🔄 Fetching "Because You Liked" recommendations...');
      
      if (currentUser) {
        try {
          const response = await fetchBecauseYouLiked({ limit });
          
          if (response.success && response.data && response.data.length > 0) {
            console.log(`✅ Found ${response.data.length} "Because You Liked" recommendations`);
            console.log(`📚 Source: ${response.message}`);
            
            setRecommendations(response.data);
            setSource(response.source);
            setSourceBook(response.sourceBook || null);
            setMessage(response.message || '');
            setIsLoading(false);
            return;
          }
        } catch (apiError) {
          console.error('❌ Because You Liked API error:', apiError);
        }
      }
      
      // Fallback for non-logged-in users or API failure
      console.log('🔄 Using sample data as fallback');
      setRecommendations(standardBooks.slice(0, limit));
      setSource('sample_fallback');
      setSourceBook(null);
      setMessage('Popular books you might like');
      
    } catch (error) {
      console.error('❌ Error in Because You Liked flow:', error);
      setError(error.message);
      setRecommendations(standardBooks.slice(0, Math.min(limit, 10)));
      setSource('error_fallback');
    } finally {
      setIsLoading(false);
    }
  }, [currentUser, limit, autoFetch]);

  const refresh = useCallback(() => {
    fetchBecauseYouLikedData();
  }, [fetchBecauseYouLikedData]);

  useEffect(() => {
    if (!authLoading) {
      fetchBecauseYouLikedData();
    }
  }, [fetchBecauseYouLikedData, authLoading]);

  return {
    recommendations,
    isLoading,
    error,
    source,
    sourceBook,
    message,
    hasRecommendations: recommendations.length > 0,
    refresh,
    isEmpty: !isLoading && recommendations.length === 0
  };
};