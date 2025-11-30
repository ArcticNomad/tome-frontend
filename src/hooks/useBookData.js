import { useState, useEffect } from 'react';
import {
  fetchAllBooks,
  fetchFantasyBooks,
  fetchRecentlyAdded,
  fetchPopularBooks,
  fetchBooksByGenre,
} from '../api/books';

export const useBookData = (category) => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        let response;
        switch (category) {
          case 'fantasy':
            response = await fetchFantasyBooks(50);
            break;
          case 'recently-added':
            response = await fetchRecentlyAdded(50);
            break;
          case 'popular':
            response = await fetchPopularBooks(50);
            break;
          case 'all':
            response = await fetchAllBooks({ limit: 50 });
            break;
          default:
            response = await fetchBooksByGenre(category, 50);
            break;
        }
        if (response.success) {
          setBooks(response.data);
        } else {
          setError(response.message);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (category) {
      fetchBooks();
    }
  }, [category]);

  return { books, loading, error };
};