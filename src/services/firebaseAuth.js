// Mock firebase auth service

export const auth = {};

export const createUserWithEmailAndPassword = async (auth, email, password) => {
  console.log('Mock createUserWithEmailAndPassword', { email, password });
  if (email === 'exists@example.com') {
    const error = new Error('This email is already registered. Please sign in.');
    error.code = 'auth/email-already-in-use';
    throw error;
  }
  if (password.length < 6) {
    const error = new Error('The password is too weak. Choose a stronger one.');
    error.code = 'auth/weak-password';
    throw error;
  }
  return {
    user: {
      uid: 'mock-uid-' + Math.random().toString(36).substring(2, 15),
    },
  };
};
