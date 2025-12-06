// frontend/src/hooks/usePaginatedBooks.js
import { useState, useEffect, useCallback } from 'react';
import { fetchBooksPaginated } from '../api/books';

export const usePaginatedBooks = (category, options = {}) => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalBooks: 0,
    hasNext: false,
    hasPrev: false,
    limit: 24
  });

  const {
    page = 1,
    limit = 24,
    search,
    author,
    sortBy = 'downloadCount',
    sortOrder = 'desc',
    autoFetch = true
  } = options;

  const fetchBooks = useCallback(async (pageNumber = page, shouldAppend = false) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetchBooksPaginated({
        page: pageNumber,
        limit,
        category: category === 'All Books' ? '' : category,
        search,
        author,
        sortBy,
        sortOrder
      });

      if (response.success) {
        if (shouldAppend) {
          // Append new books for "Load More"
          setBooks(prev => [...prev, ...response.data]);
        } else {
          // Replace books for new search/page
          setBooks(response.data);
        }
        setPagination(response.pagination || {
          currentPage: pageNumber,
          totalPages: 1,
          totalBooks: response.data.length,
          hasNext: false,
          hasPrev: false,
          limit
        });
      } else {
        throw new Error(response.message || 'Failed to fetch books');
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching paginated books:', err);
    } finally {
      setLoading(false);
    }
  }, [category, page, limit, search, author, sortBy, sortOrder]);

  const loadMore = useCallback(async () => {
    if (pagination.hasNext && !loading) {
      const nextPage = pagination.currentPage + 1;
      await fetchBooks(nextPage, true);
    }
  }, [pagination, loading, fetchBooks]);

  const goToPage = useCallback(async (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= pagination.totalPages) {
      await fetchBooks(pageNumber, false);
    }
  }, [pagination.totalPages, fetchBooks]);

  const refresh = useCallback(() => {
    fetchBooks(1, false);
  }, [fetchBooks]);

  useEffect(() => {
    if (autoFetch && category) {
      fetchBooks(1, false);
    }
  }, [fetchBooks, autoFetch, category]);

  return {
    books,
    loading,
    error,
    pagination,
    fetchBooks,
    loadMore,
    goToPage,
    refresh,
    hasMore: pagination.hasNext
  };
};