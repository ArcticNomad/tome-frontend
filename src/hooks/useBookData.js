import { useState, useEffect } from 'react';
import { fetchAllBooks } from '../api/books'; // Assuming an API utility file exists
import { standardBooks } from '../data'; // Mock data fallback (Assuming data.js is one level up from hooks/)

/**
 * Custom hook to fetch all book data from the API and manage loading state.
 * @returns {{books: Array, isLoading: boolean, error: Error|null}}
 */
export function useBookData() {
    const [books, setBooks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadBooks = async () => {
            try {
                const liveData = await fetchAllBooks();
                setBooks(liveData);
                setError(null);
            } catch (err) {
                console.error("[Hook Error] Falling back to mock data.", err);
                setError(err);
                // Fallback to mock data slice on failure
                setBooks(standardBooks.slice(0, 20)); 
            } finally {
                setIsLoading(false);
            }
        };

        loadBooks();
    }, []);

    return { books, isLoading, error };
}