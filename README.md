# Tome - A Modern eBook Platform

Tome is a feature-rich, modern web application for discovering, reading, and managing your digital book collection. It's built with a React frontend and a Node.js/Express backend, leveraging Firebase for authentication and various AI/ML services for personalized recommendations.

## Features

-   **Book Discovery:** Explore a vast library of books, with sections for popular, recently added, and featured titles.
-   **Personalized Recommendations:** Get book suggestions tailored to your tastes with our "For You" section, powered by content-based filtering.
-   **"Because You Liked":** Discover new books based on titles you've enjoyed.
-   **Advanced Search:** A hybrid search engine combining traditional text search with vector-based semantic search for more relevant results.
-   **User Bookshelves:** Organize your library into "Currently Reading," "Want to Read," and "Read" shelves.
-   **User Authentication:** Secure sign-up and login functionality using Firebase Authentication.
-   **Responsive Design:** A clean, modern, and responsive UI built with React, Tailwind CSS, and custom components.

## Getting Started

### Prerequisites

-   Node.js (v18 or later recommended)
-   npm or yarn

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/ArchNomad/tome-frontend.git
    cd tome-frontend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Set up environment variables:**

    Create a `.env` file in the root of the project and add your Firebase configuration:

    ```env
    VITE_FIREBASE_API_KEY="your_api_key"
    VITE_FIREBASE_AUTH_DOMAIN="your_auth_domain"
    VITE_FIREBASE_PROJECT_ID="your_project_id"
    VITE_FIREBASE_STORAGE_BUCKET="your_storage_bucket"
    VITE_FIREBASE_MESSAGING_SENDER_ID="your_sender_id"
    VITE_FIREBASE_APP_ID="your_app_id"
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    # or
    yarn dev
    ```
    The application will be available at `http://localhost:5173`.

## Tech Stack

-   **Frontend:**
    -   React
    -   Vite
    -   Tailwind CSS
    -   React Router
-   **Authentication:**
    -   Firebase Authentication
-   **Backend Communication:**
    -   REST API calls to the Tome backend service.

## Implemented Fix

In this session, I addressed a critical bug in the "For You" recommendations feature.

### Problem

The "For You" section was displaying generic popular books instead of personalized recommendations for logged-in users. The backend logs revealed that API requests were being treated as unauthenticated (`source: "popular_no_user"`).

### Root Cause

The frontend was sending a Firebase `Authorization: Bearer <token>` header, but the specific middleware (`authFirebaseUid`) responsible for fetching user data for recommendations was expecting the user's Firebase UID to be in a custom `firebase-uid` header.

### Solution

I modified the generic `apiRequest` function in `src/api/books.js` to include the `firebase-uid` header in all authenticated requests.

**Before:**
```javascript
const config = {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...options.headers,
  },
  ...options,
};
```

**After:**
```javascript
const headers = {
  'Content-Type': 'application/json',
  ...options.headers,
};

if (token) {
  headers['Authorization'] = `Bearer ${token}`;
}

if (user) {
  headers['firebase-uid'] = user.uid;
}

const config = {
  method: 'GET',
  headers,
  ...options,
};
```
This ensures that the backend can correctly identify the user and provide personalized, AI-driven book recommendations. I also improved security by cleaning up console logs that were unnecessarily exposing token and header information.
