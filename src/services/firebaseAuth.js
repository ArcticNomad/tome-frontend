// NOTE: Firebase Client SDK must be installed: npm install firebase

import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

// --- IMPORTANT ---
// These keys must be configured on Vercel as environment variables (e.g., VITE_FIREBASE_API_KEY)
// We use placeholder values here.

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Export the authentication functions and object for use in components
export { auth, createUserWithEmailAndPassword, signInWithEmailAndPassword };

// You will eventually integrate Google/Social Sign-in here as well.