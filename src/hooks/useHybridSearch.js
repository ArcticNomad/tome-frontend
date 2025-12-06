// frontend/src/hooks/useHybridSearch.js - FIXED useEffect
import { useState, useEffect, useCallback, useRef } from 'react';
import { hybridSearchBooks, simpleSearchBooks, quickSearchBooks } from '../api/books';

export const useHybridSearch = (searchQuery, options = {}) => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalBooks: 0,
    hasNext: false,
    hasPrev: false,
    limit: 24
  });
  const [searchType, setSearchType] = useState('hybrid');

  const {
    page = 1,
    limit = 24,
    searchMode = 'hybrid',
    autoFetch = true
  } = options;

  // Use ref to prevent infinite loops
  const performSearchRef = useRef();
  
  const performSearch = useCallback(async (pageNumber = page, shouldAppend = false) => {
    if (!searchQuery || searchQuery.trim().length === 0) {
      setBooks([]);
      setPagination({
        currentPage: 1,
        totalPages: 1,
        totalBooks: 0,
        hasNext: false,
        hasPrev: false,
        limit
      });
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      let response;
      
      if (searchMode === 'quick') {
        response = await quickSearchBooks(searchQuery, { limit: limit });
        
        if (response.success) {
          setBooks(response.data || []);
          setPagination({
            currentPage: 1,
            totalPages: 1,
            totalBooks: response.data?.length || 0,
            hasNext: false,
            hasPrev: false,
            limit
          });
          setSearchType('quick');
        } else {
          throw new Error(response.message || 'Quick search failed');
        }
        return;
        
      } else if (searchMode === 'simple') {
        response = await simpleSearchBooks(searchQuery, {
          page: pageNumber,
          limit: limit
        });
      } else {
        response = await hybridSearchBooks(searchQuery, {
          page: pageNumber,
          limit: limit
        });
      }

      if (response.success) {
        if (shouldAppend) {
          setBooks(prev => [...prev, ...(response.data || [])]);
        } else {
          setBooks(response.data || []);
        }
        
        setPagination(response.pagination || {
          currentPage: pageNumber,
          totalPages: 1,
          totalBooks: response.data?.length || 0,
          hasNext: false,
          hasPrev: pageNumber > 1,
          limit
        });
        
        setSearchType(response.searchType || searchMode);
      } else {
        throw new Error(response.message || 'Search failed');
      }
    } catch (err) {
      setError(err.message);
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, searchMode, limit]);

  // Store in ref
  useEffect(() => {
    performSearchRef.current = performSearch;
  }, [performSearch]);

  useEffect(() => {
    if (autoFetch && searchQuery?.trim()) {
      const timer = setTimeout(() => {
        performSearchRef.current?.(1, false);
      }, 300); // Small delay for debouncing
      
      return () => clearTimeout(timer);
    }
  }, [searchQuery, searchMode, autoFetch]);

  const loadMore = useCallback(async () => {
    if (pagination.hasNext && !loading && searchMode !== 'quick') {
      const nextPage = pagination.currentPage + 1;
      await performSearch(nextPage, true);
    }
  }, [pagination, loading, searchMode, performSearch]);

  const goToPage = useCallback(async (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= pagination.totalPages && searchMode !== 'quick') {
      await performSearch(pageNumber, false);
    }
  }, [pagination.totalPages, searchMode, performSearch]);

  const refresh = useCallback(() => {
    performSearch(1, false);
  }, [performSearch]);

  return {
    books,
    loading,
    error,
    pagination,
    searchType,
    performSearch,
    loadMore,
    goToPage,
    refresh,
    hasMore: pagination.hasNext && searchMode !== 'quick'
  };
};