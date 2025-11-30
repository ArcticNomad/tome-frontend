// src/hooks/useHomepageData.js
import { useState, useEffect } from 'react';
import { 
  fetchAllBooks,
  fetchRecentlyAdded,
  fetchPopularBooks,
  fetchFantasyBooks,
  fetchFeaturedBooks,
  fetchBooksByGenre,
  fetchHighlyReviewedBooks,
  fetchHomepageStats
} from '../api/books';
import { standardBooks, genreCollections } from '../data';

export function useHomepageData() {
  const [data, setData] = useState({
    allBooks: [],
    recentlyAdded: [],
    popularBooks: [],
    fantasyBooks: [],
    featuredBooks: [],
    highlyReviewed: [],
    stats: null,
    isLoading: true,
    error: null,
    backendStatus: 'checking'
  });

  useEffect(() => {
    let mounted = true;

    const loadHomepageData = async () => {
      try {
        setData(prev => ({ ...prev, isLoading: true, error: null }));

        console.log('[Homepage Hook] Loading homepage data...');

        // Fetch all data in parallel for better performance
        const [
          allBooksResponse,
          recentlyAddedResponse,
          popularBooksResponse,
          fantasyBooksResponse,
          featuredBooksResponse,
          highlyReviewedResponse,
          statsResponse
        ] = await Promise.allSettled([
          fetchAllBooks({ limit: 50, sortBy: 'issuedDate', sortOrder: 'desc' }),
          fetchRecentlyAdded(10),
          fetchPopularBooks(10),
          fetchFantasyBooks(10),
          fetchFeaturedBooks(8),
          fetchHighlyReviewedBooks(8),
          fetchHomepageStats()
        ]);

        if (!mounted) return;

        // Process responses
        const processResponse = (response, fallback = []) => {
          if (response.status === 'fulfilled' && response.value.success) {
            return response.value.data;
          }
          return fallback;
        };

        const newData = {
          allBooks: processResponse(allBooksResponse, standardBooks.slice(0, 50)),
          recentlyAdded: processResponse(recentlyAddedResponse, []),
          popularBooks: processResponse(popularBooksResponse, []),
          fantasyBooks: processResponse(fantasyBooksResponse, []),
          featuredBooks: processResponse(featuredBooksResponse, []),
          highlyReviewed: processResponse(highlyReviewedResponse, []),
          stats: processResponse(statsResponse, null),
          isLoading: false,
          error: null,
          backendStatus: 'connected'
        };

        // If any API call failed, use fallback data
        const hasApiFailures = [
          allBooksResponse,
          recentlyAddedResponse,
          popularBooksResponse
        ].some(response => response.status === 'rejected');

        if (hasApiFailures) {
          console.warn('[Homepage Hook] Some API calls failed, using fallback data');
          newData.backendStatus = 'partial';
          
          // Enhance fallback data with mock data where needed
          if (newData.recentlyAdded.length === 0) {
            newData.recentlyAdded = [...standardBooks]
              .sort((a, b) => new Date(b.issuedDate || 0) - new Date(a.issuedDate || 0))
              .slice(0, 10);
          }
          
          if (newData.popularBooks.length === 0) {
            newData.popularBooks = standardBooks
              .filter(book => book.downloadCount > 1000)
              .slice(0, 10);
          }
          
          if (newData.fantasyBooks.length === 0) {
            newData.fantasyBooks = standardBooks
              .filter(book => 
                book.subjects?.some(subject => 
                  subject.toLowerCase().includes('fantasy') ||
                  subject.toLowerCase().includes('magic')
                )
              )
              .slice(0, 10);
          }
        }

        setData(newData);
        console.log('[Homepage Hook] Homepage data loaded successfully');

      } catch (error) {
        if (!mounted) return;
        
        console.error('[Homepage Hook] Failed to load homepage data:', error);
        
        // Complete fallback to mock data
        setData({
          allBooks: standardBooks.slice(0, 50),
          recentlyAdded: [...standardBooks]
            .sort((a, b) => new Date(b.issuedDate || 0) - new Date(a.issuedDate || 0))
            .slice(0, 10),
          popularBooks: standardBooks
            .filter(book => book.downloadCount > 1000)
            .slice(0, 10),
          fantasyBooks: standardBooks
            .filter(book => 
              book.subjects?.some(subject => 
                subject.toLowerCase().includes('fantasy') ||
                subject.toLowerCase().includes('magic')
              )
            )
            .slice(0, 10),
          featuredBooks: standardBooks.slice(0, 8),
          highlyReviewed: standardBooks
            .filter(book => book.downloadCount > 5000)
            .slice(0, 8),
          stats: null,
          isLoading: false,
          error: error.message,
          backendStatus: 'disconnected'
        });
      }
    };

    loadHomepageData();

    return () => {
      mounted = false;
    };
  }, []);

  return data;
}
