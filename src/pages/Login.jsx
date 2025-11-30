import { useState } from "react";
import { Loader } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import AuthSuccess from "../components/auth/AuthSuccess";
import AuthFailure from "../components/auth/AuthFailure";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [showFailure, setShowFailure] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            const userCredential = await login(email, password);
            console.log("User successfully signed in:", userCredential.user.uid);
            setShowSuccess(true);
        } catch (err) {
            let message = "An unknown error occurred.";
            if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
                message = "Invalid email or password.";
            } else {
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
            {showSuccess && <AuthSuccess message="You have successfully logged in!" onClose={handleSuccessClose} />}
            {showFailure && <AuthFailure message={error} onClose={() => setShowFailure(false)} />}
            <div className="max-w-md w-full bg-white p-8 md:p-10 shadow-2xl rounded-2xl border border-gray-100">
                <h2 className="text-3xl font-extrabold text-gray-900 mb-6 text-center">
                    Welcome Back
                </h2>
                <p className="text-sm text-gray-600 mb-6 text-center">
                    Sign in to access your personalized library.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
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
                            Password
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
                            disabled={isLoading}
                        />
                    </div>

                    <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center">
                            <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
                            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                                Remember me
                            </label>
                        </div>

                        <div className="text-sm">
                            <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                                Forgot your password?
                            </a>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition duration-200 disabled:bg-indigo-400 mt-6"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <Loader size={20} className="animate-spin" />
                        ) : (
                            "Sign In"
                        )}
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-gray-600">
                    Don't have an account?
                    <button
                        type="button"
                        onClick={() => navigate('/signup')}
                        className="font-medium text-indigo-600 hover:text-indigo-500 ml-1 transition duration-150"
                        disabled={isLoading}
                    >
                        Sign Up
                    </button>
                </p>
            </div>
        </>
    );
}
