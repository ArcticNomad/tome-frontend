// src/api/books.js
// For development, use localhost; for production, use relative path
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? '/api'  // Vercel will rewrite this
  : 'http://localhost:5000/api';

export async function fetchAllBooks() {
    const url = `${API_BASE_URL}/books`;
    console.log(`[API] Fetching books from: ${url}`);
    
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            // Add credentials if needed
            // credentials: 'include'
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log(`[API] Successfully fetched data:`, data);
        
        // Handle both direct array response and paginated response
        const books = data.books || data;
        console.log(`[API] Extracted ${books.length} books`);
        return books;
        
    } catch (error) {
        console.error('[API] Fetch failed:', error);
        throw error;
    }
}