import { useState } from "react";
import { Heart, AlertCircle, Loader } from "lucide-react";
import { createUserWithEmailAndPassword, auth } from "../services/firebaseAuth"; // Import necessary auth functions

/**
 * Renders the user registration form using Firebase Email/Password auth.
 */
export default function SignUp() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters long.");
            return;
        }

        setIsLoading(true);

        try {
            // 1. Call Firebase Authentication to create the user
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            
            // Log success and redirect
            console.log("User successfully signed up:", userCredential.user.uid);
            
            // 2. Execute success callback (e.g., redirect to home page)
            // onAuthSuccess is not passed, so we can't use it

        } catch (err) {
            let message = "An unknown error occurred.";
            
            // Handle common Firebase errors
            if (err.code === 'auth/email-already-in-use') {
                message = "This email is already registered. Please sign in.";
            } else if (err.code === 'auth/weak-password') {
                message = "The password is too weak. Choose a stronger one.";
            } else {
                 // General error handling (e.g., network issues)
                message = err.message;
            }
            
            setError(message);

        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-md w-full bg-white p-8 md:p-10 shadow-2xl rounded-2xl border border-gray-100">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-6 flex items-center justify-center gap-2">
                Create Account
                
            </h2>
            <p className="text-sm text-gray-600 mb-6 text-center">
                Sign up to unlock semantic search and personalized history.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Error Display */}
                {error && (
                    <div className="p-3 bg-red-100 text-red-700 rounded-lg flex items-center text-sm">
                        <AlertCircle size={18} className="mr-2 flex-shrink-0" />
                        {error}
                    </div>
                )}

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">
                        Email Address
                    </label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
                        disabled={isLoading}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="password">
                        Password (min 6 chars)
                    </label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="new-password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
                        disabled={isLoading}
                    />
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="confirmPassword">
                        Confirm Password
                    </label>
                    <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        autoComplete="new-password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
                        disabled={isLoading}
                    />
                </div>


                <button
                    type="submit"
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition duration-200 disabled:bg-indigo-400 mt-6"
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <Loader size={20} className="animate-spin" />
                    ) : (
                        "Sign Up"
                    )}
                </button>
            </form>
            
            <p className="mt-6 text-center text-sm text-gray-600">
                Already have an account?
                <button
                    type="button"
                    onClick={() => {console.log("navigate to sign in")}}
                    className="font-medium text-indigo-600 hover:text-indigo-500 ml-1 transition duration-150"
                    disabled={isLoading}
                >
                    Sign In
                </button>
            </p>
        </div>
    );
}