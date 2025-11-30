// src/api/books.js
// For development, use localhost; for production, use relative path
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? '/api'  // Vercel will rewrite this
  : 'http://localhost:5000/api';

// Helper function to get auth token
const getAuthToken = async () => {
  const { auth } = await import('../firebase/config');
  const user = auth.currentUser;
  return user ? await user.getIdToken() : null;
};

// Generic API request function
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = await getAuthToken();
  
  const config = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  console.log(`[API] ${config.method} ${url}`);
  
  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log(`[API] Success:`, data);
    return data;
    
  } catch (error) {
    console.error(`[API] Request failed:`, error);
    throw error;
  }
}

// Book API functions
export async function fetchAllBooks(params = {}) {
  const queryString = new URLSearchParams(params).toString();
  const endpoint = `/books${queryString ? `?${queryString}` : ''}`;
  return apiRequest(endpoint);
}

export async function fetchBookById(id) {
  return apiRequest(`/books/${id}`);
}

export async function searchBooks(query, filters = {}) {
  const params = { q: query, ...filters };
  return apiRequest(`/books/search`, { params });
}


export async function fetchBooksByAuthor(author, page = 1) {
  return apiRequest(`/books/author/${author}?page=${page}`);
}

export async function fetchBookStats() {
  return apiRequest('/books/stats');
}

// User-specific book functions (require auth)
export async function updateReadingProgress(bookData) {
  return apiRequest('/users/reading-progress', {
    method: 'POST',
    body: JSON.stringify(bookData),
  });
}

export async function toggleFavoriteBook(bookId) {
  return apiRequest(`/users/favorites/${bookId}`, {
    method: 'POST',
  });
}

export async function fetchReadingHistory() {
  return apiRequest('/users/reading-history');
}

export async function fetchFavoriteBooks() {
  return apiRequest('/users/favorites');
}

// Add these functions to your existing src/api/books.js

// Homepage-specific functions
export async function fetchRecentlyAdded(limit = 10) {
  return apiRequest(`/books/recent?limit=${limit}`);
}

export async function fetchPopularBooks(limit = 10) {
  return apiRequest(`/books/popular?limit=${limit}`);
}

export async function fetchFantasyBooks(limit = 10) {
  return apiRequest(`/books/fantasy?limit=${limit}`);
}

export async function fetchFeaturedBooks(limit = 8) {
  return apiRequest(`/books/featured?limit=${limit}`);
}

export async function fetchBooksByGenre(genre, limit = 10) {
  return apiRequest(`/books/genre/${genre}?limit=${limit}`);
}

export async function fetchHighlyReviewedBooks(limit = 8) {
  return apiRequest(`/books/community/reviews?limit=${limit}`);
}

export async function fetchHomepageStats() {
  return apiRequest('/books/stats/homepage');
}

// Get all homepage data in one call
export async function fetchHomepageData() {
  try {
    console.log('[API] Fetching all homepage data...');
    
    // Fetch all data in parallel
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

    // Process responses
    const processResponse = (response, fallback = []) => {
      if (response.status === 'fulfilled' && response.value.success) {
        return response.value.data;
      }
      return fallback;
    };

    return {
      success: true,
      data: {
        allBooks: processResponse(allBooksResponse, []),
        recentlyAdded: processResponse(recentlyAddedResponse, []),
        popularBooks: processResponse(popularBooksResponse, []),
        fantasyBooks: processResponse(fantasyBooksResponse, []),
        featuredBooks: processResponse(featuredBooksResponse, []),
        highlyReviewed: processResponse(highlyReviewedResponse, []),
        stats: processResponse(statsResponse, null)
      }
    };

  } catch (error) {
    console.error('[API] Failed to fetch homepage data:', error);
    return {
      success: false,
      message: error.message,
      data: {
        allBooks: [],
        recentlyAdded: [],
        popularBooks: [],
        fantasyBooks: [],
        featuredBooks: [],
        highlyReviewed: [],
        stats: null
      }
    };
  }
}