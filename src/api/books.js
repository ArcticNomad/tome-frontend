const API_ENDPOINT = '/api/books';

/**
 * Fetches the list of books from the Railway backend via the Vercel proxy.
 * This function handles the raw fetch logic.
 * @returns {Promise<Array>} Array of book objects.
 */
export async function fetchAllBooks() {
    console.log(`[API] Fetching books from proxy endpoint: ${API_ENDPOINT}`);
    
    // We rely on the Vercel rewrite rule in vercel.json to forward this call to Railway.
    const response = await fetch(API_ENDPOINT);

    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}. Failed to reach backend.`);
    }

    const data = await response.json();
    return data;
}

// Future endpoints (e.g., semantic search, user history) would go here:
// export async function searchBooks(query) { ... }