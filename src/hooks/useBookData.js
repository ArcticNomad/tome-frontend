// src/hooks/useBookData.js
import { useState, useEffect } from 'react';
import { fetchAllBooks } from '../api/books';
import { standardBooks } from '../data';

/**
 * Custom hook to fetch all book data from the API
 */
export function useBookData() {
    const [books, setBooks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let mounted = true;

        const loadBooks = async () => {
            try {
                setIsLoading(true);
                setError(null);
                
                console.log('[Hook] Starting book data fetch...');
                const liveData = await fetchAllBooks();
                
                if (mounted) {
                    if (liveData && liveData.length > 0) {
                        setBooks(liveData);
                        console.log(`[Hook] Successfully loaded ${liveData.length} books from API`);
                    } else {
                        throw new Error('No data received from API');
                    }
                }
            } catch (err) {
                if (mounted) {
                    console.warn('[Hook] API fetch failed, using mock data:', err.message);
                    setError(err);
                    setBooks(standardBooks.slice(0, 20));
                }
            } finally {
                if (mounted) {
                    setIsLoading(false);
                }
            }
        };

        loadBooks();

        return () => {
            mounted = false;
        };
    }, []);

    return { books, isLoading, error };
}

export default useBookData;