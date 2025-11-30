import { useState } from "react";
import { Heart, Loader } from "lucide-react";
import { useAuth } from "../hooks/useAuth"; 
import AuthSuccess from "../components/auth/AuthSuccess";
import AuthFailure from "../components/auth/AuthFailure";
import { useNavigate } from "react-router-dom";

/**
 * Renders the user registration form using Firebase Email/Password auth.
 */
export default function SignUp() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [showFailure, setShowFailure] = useState(false);
    const navigate = useNavigate();
    const { signup } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            setShowFailure(true);
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters long.");
            setShowFailure(true);
            return;
        }

        setIsLoading(true);

        try {
            // 1. Call Firebase Authentication to create the user
            const userCredential = await signup(email, password, displayName);
            
            // Log success and redirect
            console.log("User successfully signed up:", userCredential.user.uid);
            
            // 2. Execute success callback (e.g., redirect to home page)
            setShowSuccess(true);

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
            setShowFailure(true);

        } finally {
            setIsLoading(false);
        }
    };

    const handleSuccessClose = () => {
        setShowSuccess(false);
        navigate('/books');
    }

    return (
        <>
            {showSuccess && <AuthSuccess message="You have successfully signed up!" onClose={handleSuccessClose} />}
            {showFailure && <AuthFailure message={error} onClose={() => setShowFailure(false)} />}
            <div className="max-w-md w-full bg-white p-8 md:p-10 shadow-2xl rounded-2xl border border-gray-100">
                <h2 className="text-3xl font-extrabold text-gray-900 mb-6 flex items-center justify-center gap-2">
                    Create Account
                    
                </h2>
                <p className="text-sm text-gray-600 mb-6 text-center">
                    Sign up to unlock semantic search and personalized history.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="displayName">
                            Display Name
                        </label>
                        <input
                            id="displayName"
                            name="displayName"
                            type="text"
                            autoComplete="name"
                            required
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
                            disabled={isLoading}
                        />
                    </div>
                    
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
                        onClick={() => navigate('/login')}
                        className="font-medium text-indigo-600 hover:text-indigo-500 ml-1 transition duration-150"
                        disabled={isLoading}
                    >
                        Sign In
                    </button>
                </p>
            </div>
        </>
    );
}