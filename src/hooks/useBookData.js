import { useState, useEffect, useCallback } from 'react';
import {
  fetchAllBooks,
  fetchFantasyBooks,
  fetchRecentlyAdded,
  fetchPopularBooks,
  fetchBooksByGenre,
  fetchFeaturedBooks,
  fetchHighlyReviewedBooks,
  fetchBookById,
  searchBooks,
  fetchBookReviews,
  createBookReview,
  updateReview,
  deleteReview,
  markReviewHelpful
} from '../api/books';

export const useBookData = (category, options = {}) => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({});
  const [refreshing, setRefreshing] = useState(false);

  const {
    limit = 50,
    page = 1,
    searchQuery = '',
    sortBy = 'issuedDate',
    sortOrder = 'desc',
    autoFetch = true,
    genre = '',
    author = ''
  } = options;

  const fetchBooks = useCallback(async (refresh = false) => {
    try {
      if (refresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);
      
      let response;
      const params = { 
        limit, 
        page, 
        sortBy, 
        sortOrder,
        ...(searchQuery && { search: searchQuery }),
        ...(author && { author }),
        ...(genre && { subject: genre })
      };

      switch (category) {
        case 'fantasy':
          response = await fetchFantasyBooks(limit);
          break;
        case 'recently-added':
          response = await fetchRecentlyAdded(limit);
          break;
        case 'popular':
          response = await fetchPopularBooks(limit);
          break;
        case 'featured':
          response = await fetchFeaturedBooks(limit);
          break;
        case 'highly-reviewed':
          response = await fetchHighlyReviewedBooks(limit);
          break;
        case 'all':
          response = await fetchAllBooks(params);
          break;
        case 'search':
          response = await searchBooks(searchQuery, params);
          break;
        default:
          if (category && category !== 'search') {
            response = await fetchBooksByGenre(category, limit);
          } else {
            response = await fetchAllBooks(params);
          }
          break;
      }

      if (response.success) {
        setBooks(response.data || []);
        setPagination(response.pagination || {});
      } else {
        throw new Error(response.message || 'Failed to fetch books');
      }
    } catch (err) {
      setError(err.message);
      console.error(`Error fetching ${category} books:`, err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [category, limit, page, searchQuery, sortBy, sortOrder, author, genre]);

  const refresh = useCallback(() => {
    fetchBooks(true);
  }, [fetchBooks]);

  const loadMore = useCallback(async () => {
    if (pagination.hasNext && !loading) {
      try {
        setLoading(true);
        const nextPage = pagination.currentPage + 1;
        let response;
        
        const params = { 
          limit, 
          page: nextPage, 
          sortBy, 
          sortOrder,
          ...(searchQuery && { search: searchQuery })
        };

        switch (category) {
          case 'all':
            response = await fetchAllBooks(params);
            break;
          case 'search':
            response = await searchBooks(searchQuery, params);
            break;
          default:
            response = await fetchAllBooks(params);
            break;
        }

        if (response.success) {
          setBooks(prev => [...prev, ...(response.data || [])]);
          setPagination(response.pagination || {});
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
  }, [pagination, category, limit, searchQuery, sortBy, sortOrder, loading]);

  useEffect(() => {
    if (autoFetch && category) {
      fetchBooks();
    }
  }, [fetchBooks, autoFetch, category]);

  return {
    books,
    loading,
    refreshing,
    error,
    pagination,
    refresh,
    loadMore,
    hasMore: pagination.hasNext || false
  };
};

export const useBook = (bookId) => {
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadBook = useCallback(async () => {
    if (!bookId) return;
    try {
      setLoading(true);
      setError(null);
      const response = await fetchBookById(bookId);
      if (response.success) {
        setBook(response.data);
      } else {
        throw new Error(response.message || 'Book not found');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [bookId]);

  useEffect(() => {
    loadBook();
  }, [loadBook]);

  const refresh = () => loadBook();

  return { book, loading, error, refresh };
};

export const useHomepageData = () => {
  const [data, setData] = useState({
    recentlyAdded: [],
    popularBooks: [],
    fantasyBooks: [],
    featuredBooks: [],
    highlyReviewed: [],
    stats: null
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchHomepageData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [
        recentlyAdded,
        popularBooks,
        fantasyBooks,
        featuredBooks,
        highlyReviewed,
        stats
      ] = await Promise.allSettled([
        fetchRecentlyAdded(10),
        fetchPopularBooks(10),
        fetchFantasyBooks(10),
        fetchFeaturedBooks(8),
        fetchHighlyReviewedBooks(8),
        fetchAllBooks({ limit: 1 })
      ]);

      const processResponse = (response, fallback = []) => {
        if (response.status === 'fulfilled' && response.value.success) {
          return response.value.data;
        }
        return fallback;
      };

      setData({
        recentlyAdded: processResponse(recentlyAdded),
        popularBooks: processResponse(popularBooks),
        fantasyBooks: processResponse(fantasyBooks),
        featuredBooks: processResponse(featuredBooks),
        highlyReviewed: processResponse(highlyReviewed),
        stats: {
          totalBooks: processResponse(stats).length
        }
      });
    } catch (err) {
      setError(err.message);
      console.error('Error fetching homepage data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHomepageData();
  }, [fetchHomepageData]);

  const refresh = async () => {
    await fetchHomepageData();
  };

  return { ...data, loading, error, refresh };
};

// NEW: Hook for managing book reviews
export const useBookReviews = (bookId, currentUser) => {
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState(null);
  const [userReview, setUserReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadReviews = useCallback(async () => {
    if (!bookId) return;
    try {
      setLoading(true);
      const response = await fetchBookReviews(bookId);
      if (response.success) {
        setReviews(response.data || []);
        setStats(response.stats);
        
        // Find current user's review if logged in
        if (currentUser) {
          const myReview = response.data.find(r => r.userId === currentUser.uid);
          setUserReview(myReview || null);
        }
      }
    } catch (err) {
      console.error('Error loading reviews:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [bookId, currentUser]);

  useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  const submitReview = async (reviewData) => {
    try {
      let response;
      if (userReview) {
        // Update existing
        response = await updateReview(userReview._id, reviewData);
      } else {
        // Create new
        response = await createBookReview(bookId, reviewData);
      }

      if (response.success) {
        await loadReviews(); // Refresh list to get updated stats
        return { success: true };
      }
      throw new Error(response.message);
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const removeReview = async (reviewId) => {
    try {
      const response = await deleteReview(reviewId);
      if (response.success) {
        setReviews(prev => prev.filter(r => r._id !== reviewId));
        setUserReview(null);
        await loadReviews(); // Refresh to update stats
        return true;
      }
    } catch (err) {
      console.error('Failed to delete review:', err);
    }
    return false;
  };

  const markHelpful = async (reviewId) => {
    try {
      const response = await markReviewHelpful(reviewId);
      if (response.success) {
        // Optimistic update
        setReviews(prev => prev.map(r => {
          if (r._id === reviewId) {
            return {
              ...r,
              likes: response.data.likes,
              helpful: response.data.isHelpful 
                ? [...(r.helpful || []), currentUser?.uid] 
                : (r.helpful || []).filter(id => id !== currentUser?.uid)
            };
          }
          return r;
        }));
        return true;
      }
    } catch (err) {
      console.error('Failed to mark helpful:', err);
    }
    return false;
  };

  return {
    reviews,
    stats,
    userReview,
    loading,
    error,
    refreshReviews: loadReviews,
    submitReview,
    removeReview,
    markHelpful
  };
};