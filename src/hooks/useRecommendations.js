// src/hooks/useRecommendations.js - FINAL FIXED VERSION
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
          
          // Fetch personalized recommendations (USING YOUR EMBEDDINGS SYSTEM)
          const response = await fetchRecommendations({ limit });
          console.log('📡 API response structure:', {
            success: response.success,
            dataLength: response.data?.length,
            userGenres: response.userGenres,
            source: response.source,
            message: response.message
          });
          
          // Check if we have valid recommendations
          if (response.success && response.data && response.data.length > 0) {
            console.log(`✅ Found ${response.data.length} recommendations (source: ${response.source})`);
            
            // DEBUG: Log the actual book titles
            console.log('📚 Books returned:', response.data.map(b => b.title).slice(0, 5));
            
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
          // Continue to fallback
        }
      }
      
      // Fallback 1: Try popular books from API
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
      
      // Fallback 2: Use local sample data
      console.log('🔄 Using local sample data as final fallback');
      setRecommendations(standardBooks.slice(0, limit));
      setUserGenres([]);
      setSource('local_fallback');
      
    } catch (error) {
      console.error('❌ Error in recommendation flow:', error);
      setError(error.message);
      
      // Ultimate fallback
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

  // DEBUG: Log when recommendations change
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