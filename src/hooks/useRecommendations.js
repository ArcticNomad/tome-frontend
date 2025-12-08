// src/hooks/useRecommendations.js
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { fetchRecommendations, fetchPopularBooks } from '../api/books';
import { standardBooks } from '../data';

export const useRecommendations = (options = {}) => {
  const { currentUser, loading: authLoading } = useAuth();
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [source, setSource] = useState('fallback');
  const [userGenres, setUserGenres] = useState([]);
  
  const {
    limit = 20,
    fallbackToPopular = true,
    showPersonalized = true,
    autoFetch = true
  } = options;

  const fetchRecommendationsData = useCallback(async () => {
    if (!autoFetch) return;
    
    try {
      setIsLoading(true);
      setError(null);
      console.log('🔄 Starting recommendations fetch...');
      
      // If user is logged in and we want personalized recommendations
      if (currentUser && showPersonalized) {
        try {
          console.log('👤 User is logged in, fetching personalized recommendations...');
          
          // Use the API function from books.js
          const response = await fetchRecommendations({ limit });
          
          console.log('📡 API response structure:', {
            success: response.success,
            dataLength: response.data?.length,
            userGenres: response.userGenres,
            source: response.source,
            message: response.message
          });
          
          if (response.success && response.data && response.data.length > 0) {
            console.log(`✅ Found ${response.data.length} recommendations (source: ${response.source})`);
            
            setRecommendations(response.data);
            setUserGenres(response.userGenres || []);
            setSource(response.source || 'personalized');
            setIsLoading(false);
            return;
          } else {
            console.log('⚠️ API returned empty or invalid data:', response);
          }
        } catch (recError) {
          console.error('❌ Personalized recommendations failed:', recError);
        }
      }
      
      // Fallback to popular books
      if (fallbackToPopular) {
        try {
          console.log('📊 Falling back to popular books from API...');
          const popularResponse = await fetchPopularBooks(limit);
          
          if (popularResponse.success && popularResponse.data && popularResponse.data.length > 0) {
            console.log(`✅ Found ${popularResponse.data.length} popular books`);
            setRecommendations(popularResponse.data);
            setUserGenres([]);
            setSource('popular_api');
            setIsLoading(false);
            return;
          }
        } catch (popularError) {
          console.warn('⚠️ API popular books failed:', popularError.message);
        }
      }
      
      // Final fallback to local data
      console.log('🔄 Using local sample data as final fallback');
      setRecommendations(standardBooks.slice(0, limit));
      setUserGenres([]);
      setSource('local_fallback');
      
    } catch (error) {
      console.error('❌ Error in recommendation flow:', error);
      setError(error.message);
      setRecommendations(standardBooks.slice(0, Math.min(limit, 10)));
      setUserGenres([]);
      setSource('error_fallback');
    } finally {
      setIsLoading(false);
    }
  }, [currentUser, limit, fallbackToPopular, showPersonalized, autoFetch]);

  const refresh = useCallback(() => {
    fetchRecommendationsData();
  }, [fetchRecommendationsData]);

  useEffect(() => {
    if (!authLoading) {
      fetchRecommendationsData();
    }
  }, [fetchRecommendationsData, authLoading]);

  useEffect(() => {
    if (recommendations.length > 0) {
      console.log('🎯 Recommendations updated:', {
        count: recommendations.length,
        source,
        userGenres,
        books: recommendations.slice(0, 3).map(b => b.title)
      });
    }
  }, [recommendations, source, userGenres]);

  return {
    recommendations,
    isLoading,
    error,
    source,
    userGenres,
    isPersonalized: source === 'personalized' || source.includes('embeddings'),
    hasRecommendations: recommendations.length > 0,
    refresh,
    isEmpty: !isLoading && recommendations.length === 0
  };
};