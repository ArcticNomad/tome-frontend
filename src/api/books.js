// src/api/books.js
// For development, use localhost; for production, use relative path
// src/api/books.js - FIXED VERSION
// USE THIS EXACT CODE:

// Get the API URL from environment variables
// src/api/books.js - Line 3
export const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.DEV ? 'http://localhost:5000/api' : 'https://tome-backend-production-5402.up.railway.app/api');
  
console.log('🌐 API_BASE_URL configured as:', API_BASE_URL);
console.log('🔧 Environment mode:', import.meta.env.MODE);
console.log('📡 VITE_API_URL from env:', import.meta.env.VITE_API_URL);

// Helper function to get auth token
const getAuthToken = async () => {
  try {
    const { auth } = await import('../firebase/config');
    const user = auth.currentUser;
    return user ? await user.getIdToken() : null;
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
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

// Keep all your existing functions below...
// They should now work correctly
// Book API functions


// frontend/src/api/books.js - CORRECTED

export const hybridSearchBooks = async (query, params = {}) => {
  try {
    const queryString = new URLSearchParams({
      query,
      limit: params.limit || 24,
      page: params.page || 1
    }).toString();
    
    const response = await fetch(`${API_BASE_URL}/search/hybrid?${queryString}`);
    return await response.json();
  } catch (error) {
    console.error('Error performing hybrid search:', error);
    return { success: false, message: 'Failed to perform hybrid search' };
  }
};

export const simpleSearchBooks = async (query, params = {}) => {
  try {
    const queryString = new URLSearchParams({
      query,
      limit: params.limit || 24,
      page: params.page || 1
    }).toString();
    
    const response = await fetch(`${API_BASE_URL}/search/simple?${queryString}`);
    return await response.json();
  } catch (error) {
    console.error('Error performing simple search:', error);
    return { success: false, message: 'Failed to perform simple search' };
  }
};

export const quickSearchBooks = async (query, params = {}) => {
  try {
    const queryString = new URLSearchParams({
      q: query,
      limit: params.limit || 10
    }).toString();
    
    const response = await fetch(`${API_BASE_URL}/search/quick?${queryString}`);
    return await response.json();
  } catch (error) {
    console.error('Error performing quick search:', error);
    return { success: false, message: 'Failed to perform quick search' };
  }
};
// frontend/src/api/books.js - Add paginated endpoint
export const fetchBooksPaginated = async (params = {}) => {
  try {
    const queryString = new URLSearchParams({
      page: params.page || 1,
      limit: params.limit || 24,
      ...(params.search && { search: params.search }),
      ...(params.genre && { genre: params.genre }),
      ...(params.category && { category: params.category }),
      ...(params.author && { author: params.author }),
      ...(params.sortBy && { sortBy: params.sortBy }),
      ...(params.sortOrder && { sortOrder: params.sortOrder })
    }).toString();
    
    const response = await fetch(`${API_BASE_URL}/books/paginated?${queryString}`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching paginated books:', error);
    return { success: false, message: 'Failed to fetch books' };
  }
};

// Review functions
export async function fetchBookReviews(bookId, params = {}) {
  const queryString = new URLSearchParams(params).toString();
  return apiRequest(`/reviews/book/${bookId}${queryString ? `?${queryString}` : ''}`);
}
export async function fetchUserReviews(userId = '') {
  try {
    const token = await getAuthToken();
    
    const headers = {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    };
    
    // For current user's reviews
    const endpoint = '/reviews/user/mine';
    
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, { headers });
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching user reviews:', error);
    return { 
      success: false, 
      message: error.message,
      data: [] 
    };
  }
}

export async function createBookReview(bookId, reviewData) {
  return apiRequest(`/reviews/book/${bookId}`, {
    method: 'POST',
    body: JSON.stringify(reviewData),
  });
}

export async function updateReview(reviewId, reviewData) {
  return apiRequest(`/reviews/${reviewId}`, {
    method: 'PUT',
    body: JSON.stringify(reviewData),
  });
}

export async function deleteReview(reviewId) {
  return apiRequest(`/reviews/${reviewId}`, {
    method: 'DELETE',
  });
}

export async function markReviewHelpful(reviewId) {
  return apiRequest(`/reviews/${reviewId}/helpful`, {
    method: 'POST',
  });
}

// User profile functions
export async function fetchUserProfile() {
  return apiRequest('/users/profile');
}

export async function updateUserProfile(profileData) {
  return apiRequest('/users/profile', {
    method: 'PUT',
    body: JSON.stringify(profileData),
  });
}

export async function createUserProfile(profileData) {
  return apiRequest('/users/profile/create', {
    method: 'POST',
    body: JSON.stringify(profileData),
  });
}

// Bookshelf functions
export async function addToBookshelf(bookId, shelfType) {
  return apiRequest(`/users/bookshelves/${shelfType}/${bookId}`, {
    method: 'POST',
  });
}

export async function removeFromBookshelf(bookId, shelfType) {
  return apiRequest(`/users/bookshelves/${shelfType}/${bookId}`, {
    method: 'DELETE',
  });
}

export async function fetchUserBookshelf(shelfType) {
  return apiRequest(`/users/bookshelves/${shelfType}`);
}

// Check username/email availability
export async function checkAvailability(field, value) {
  return apiRequest(`/users/profile/check-availability?field=${field}&value=${encodeURIComponent(value)}`);
}


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
  try {
    const encodedGenre = encodeURIComponent(genre);
    const response = await fetch(`${API_BASE_URL}/books/genre/${encodedGenre}?limit=${limit}`);
    const data = await response.json();
    
    console.log(`API: Fetched ${data.data?.length || 0} books for genre "${genre}"`);
    
    if (!response.ok) {
      throw new Error(data.message || `Failed to fetch ${genre} books`);
    }
    
    return data;
  } catch (error) {
    console.error(`Error fetching ${genre} books:`, error);
    return { 
      success: false, 
      message: error.message,
      data: [] 
    };
  }
}
export async function fetchHighlyReviewedBooks(limit = 8) {
  return apiRequest(`/books/community/reviews?limit=${limit}`);
}

export async function fetchHomepageStats() {
  return apiRequest('/books/stats/homepage');
}

// Add to src/api/books.js
export async function fetchBecauseYouLiked(options = {}) {
  const queryString = new URLSearchParams(options).toString();
  return apiRequest(`/books/because-you-liked${queryString ? `?${queryString}` : ''}`);
}


// Recommendations functions
// In fetchRecommendations function, add more logging
// In your src/api/books.js - FIXED fetchRecommendations function
export async function fetchRecommendations(options = {}) {
  console.log('📞 fetchRecommendations called with options:', options);
  
  const token = await getAuthToken();
  const currentUser = (await import('../firebase/config')).auth.currentUser;
  
  console.log('👤 Current user:', currentUser?.uid);
  console.log('🔑 Token available:', !!token);
  
  // DON'T create custom headers - let apiRequest handle it
  // The firebaseuid header should be added in a different way
  
  const queryString = new URLSearchParams(options).toString();
  const endpoint = `/books/similar-recommendations${queryString ? `?${queryString}` : ''}`;
  
  console.log('🌐 Calling endpoint:', endpoint);
  
  // Let apiRequest handle headers - it already adds Authorization
  const response = await apiRequest(endpoint);
  console.log('✅ Response received:', response);
  
  return response;
}

export async function fetchRelatedBooks(bookId, limit = 10) {
  return apiRequest(`/books/${bookId}/related?limit=${limit}`);
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