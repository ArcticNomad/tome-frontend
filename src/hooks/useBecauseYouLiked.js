// src/hooks/useBecauseYouLiked.js
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { standardBooks } from '../data';
import { fetchBecauseYouLiked } from '../api/books';

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
      console.log('👤 Current user:', currentUser?.uid);
      
      // Check if user is logged in
      if (!currentUser) {
        console.log('👤 No user logged in, using sample data');
        setRecommendations(standardBooks.slice(0, limit));
        setSource('no_user');
        setMessage('Sign in to get personalized recommendations');
        setIsLoading(false);
        return;
      }
      
      try {
        console.log('📡 Calling because-you-liked API...');
        const response = await fetchBecauseYouLiked({ limit });
        
        console.log('📡 Because You Liked API Response:', {
          success: response.success,
          dataLength: response.data?.length,
          source: response.source,
          message: response.message,
          sourceBook: response.sourceBook,
          userRegistered: response.userRegistered
        });
        
        if (response.success && response.data && response.data.length > 0) {
          console.log(`✅ Found ${response.data.length} "Because You Liked" recommendations`);
          console.log(`📚 Source: ${response.source}, Message: ${response.message}`);
          
          setRecommendations(response.data);
          setSource(response.source || 'unknown');
          setSourceBook(response.sourceBook || null);
          setMessage(response.message || '');
          setIsLoading(false);
          return;
        } else if (response.success && (!response.data || response.data.length === 0)) {
          // API succeeded but returned empty data
          console.log('⚠️ API returned empty data');
          setRecommendations(standardBooks.slice(0, limit));
          setSource(response.source || 'empty_response');
          setMessage(response.message || 'Rate more books to get personalized recommendations');
          setIsLoading(false);
          return;
        } else {
          // API returned failure
          console.log('⚠️ API returned failure:', response.message);
          throw new Error(response.message || 'API request failed');
        }
      } catch (apiError) {
        console.error('❌ Because You Liked API error:', apiError.message);
        console.error('Error stack:', apiError.stack);
        
        // Fallback to sample data on API error
        setRecommendations(standardBooks.slice(0, limit));
        setSource('api_error_fallback');
        setMessage('Popular books you might like');
        setIsLoading(false);
        return;
      }
      
    } catch (error) {
      console.error('❌ Error in Because You Liked flow:', error);
      setError(error.message);
      setRecommendations(standardBooks.slice(0, Math.min(limit, 10)));
      setSource('error_fallback');
      setMessage('Something went wrong');
    } finally {
      // Ensure loading is set to false
      if (isLoading) {
        setIsLoading(false);
      }
    }
  }, [currentUser, limit, autoFetch, isLoading]);

  const refresh = useCallback(() => {
    console.log('🔄 Refreshing Because You Liked recommendations...');
    fetchBecauseYouLikedData();
  }, [fetchBecauseYouLikedData]);

  useEffect(() => {
    if (!authLoading) {
      fetchBecauseYouLikedData();
    }
  }, [fetchBecauseYouLikedData, authLoading]);

  // Log when recommendations update
  useEffect(() => {
    if (recommendations.length > 0) {
      console.log('🎯 Recommendations updated:', {
        count: recommendations.length,
        source,
        hasSourceBook: !!sourceBook,
        message,
        books: recommendations.slice(0, 3).map(b => b.title)
      });
    }
  }, [recommendations, source, sourceBook, message]);

  return {
    recommendations,
    isLoading,
    error,
    source,
    sourceBook,
    message,
    hasRecommendations: recommendations.length > 0,
    refresh,
    isEmpty: !isLoading && recommendations.length === 0,
    hasUser: !!currentUser
  };
};