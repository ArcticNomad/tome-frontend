import { useState, useEffect, useCallback } from 'react';
import { useUserProfile } from './useUserProfile';

export const useBookshelves = () => {
  const { 
    getBookshelf, 
    addToBookshelf: addToBookshelfApi,
    currentUser 
  } = useUserProfile();
  
  const [shelves, setShelves] = useState({
    'currently-reading': { books: [], loading: true },
    'want-to-read': { books: [], loading: true },
    'read': { books: [], loading: true }
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load a specific shelf
  const loadShelf = useCallback(async (shelfType) => {
    if (!currentUser) {
      setShelves(prev => ({
        ...prev,
        [shelfType]: { books: [], loading: false }
      }));
      return;
    }

    try {
      setShelves(prev => ({
        ...prev,
        [shelfType]: { ...prev[shelfType], loading: true }
      }));
      
      const response = await getBookshelf(shelfType);
      
      if (response.success) {
        setShelves(prev => ({
          ...prev,
          [shelfType]: { 
            books: response.data || [], 
            loading: false 
          }
        }));
      } else {
        throw new Error(response.message || `Failed to load ${shelfType}`);
      }
    } catch (err) {
      console.error(`Error loading ${shelfType}:`, err);
      setShelves(prev => ({
        ...prev,
        [shelfType]: { 
          books: [], 
          loading: false, 
          error: err.message 
        }
      }));
    }
  }, [currentUser, getBookshelf]);

  // Load all shelves
  const loadAllShelves = useCallback(async () => {
    if (!currentUser) {
      setShelves({
        'currently-reading': { books: [], loading: false },
        'want-to-read': { books: [], loading: false },
        'read': { books: [], loading: false }
      });
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Load all shelves in parallel
      const shelfTypes = ['currently-reading', 'want-to-read', 'read'];
      await Promise.all(shelfTypes.map(loadShelf));
      
    } catch (err) {
      setError(err.message);
      console.error('Error loading bookshelves:', err);
    } finally {
      setLoading(false);
    }
  }, [currentUser, loadShelf]);

  // Add book to shelf
  const addBookToShelf = useCallback(async (bookId, shelfType, bookData = {}) => {
    if (!currentUser) {
      return { 
        success: false, 
        message: 'Please sign in to add books to your library' 
      };
    }

    try {
      const response = await addToBookshelfApi(bookId, shelfType, bookData.gutenbergId);
      
      if (response.success) {
        // Refresh the shelf
        await loadShelf(shelfType);
        return { success: true, data: response.data };
      }
      
      return { success: false, message: response.message };
    } catch (err) {
      console.error(`Error adding to ${shelfType}:`, err);
      return { success: false, message: err.message };
    }
  }, [currentUser, addToBookshelfApi, loadShelf]);

  // Remove book from shelf (you'll need to add this API endpoint)
  const removeBookFromShelf = useCallback(async (bookId, shelfType) => {
    if (!currentUser) {
      return { success: false, message: 'User not logged in' };
    }

    try {
      // You need to create this API endpoint
      const response = await fetch(`/api/users/bookshelves/${shelfType}/${bookId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await getIdToken()}`
        }
      });

      if (response.ok) {
        await loadShelf(shelfType);
        return { success: true };
      }
      
      const errorData = await response.json();
      return { success: false, message: errorData.message };
    } catch (err) {
      console.error(`Error removing from ${shelfType}:`, err);
      return { success: false, message: err.message };
    }
  }, [currentUser, loadShelf]);

  // Check if book is in a shelf
  const isBookInShelf = useCallback((bookId, shelfType) => {
    const shelf = shelves[shelfType];
    if (!shelf || !shelf.books) return false;
    
    return shelf.books.some(book => 
      book._id === bookId || 
      book.bookId === bookId || 
      book.gutenbergId === bookId ||
      (book.book && (book.book._id === bookId || book.book.gutenbergId === bookId))
    );
  }, [shelves]);

  // Get book status across all shelves
  const getBookShelfStatus = useCallback((bookId) => {
    const status = {
      'currently-reading': false,
      'want-to-read': false,
      'read': false
    };
    
    Object.keys(status).forEach(shelfType => {
      status[shelfType] = isBookInShelf(bookId, shelfType);
    });
    
    return status;
  }, [isBookInShelf]);

  // Get book counts
  const counts = {
    'currently-reading': shelves['currently-reading']?.books?.length || 0,
    'want-to-read': shelves['want-to-read']?.books?.length || 0,
    'read': shelves['read']?.books?.length || 0,
    'all': (shelves['currently-reading']?.books?.length || 0) +
           (shelves['want-to-read']?.books?.length || 0) +
           (shelves['read']?.books?.length || 0)
  };

  // Load shelves on mount
  useEffect(() => {
    loadAllShelves();
  }, [loadAllShelves]);

  return {
    shelves,
    loading,
    error,
    counts,
    refresh: loadAllShelves,
    loadShelf,
    addBookToShelf,
    removeBookFromShelf,
    isBookInShelf,
    getBookShelfStatus
  };
};