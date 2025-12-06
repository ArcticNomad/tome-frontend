import { useState } from "react";
import { Loader, CheckCircle, AlertCircle, LogIn, Lock, Mail } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth"; // Import real auth hook

// ==========================================
// MODAL COMPONENTS
// ==========================================

const AuthSuccess = ({ message, onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-chill-bg/80 backdrop-blur-sm p-4 animate-fadeIn">
    <div className="bg-chill-card border border-chill-sage/20 rounded-2xl p-8 max-w-sm w-full text-center shadow-glow-sage">
      <div className="w-16 h-16 bg-chill-sage/10 rounded-full flex items-center justify-center mx-auto mb-4">
        <CheckCircle className="w-8 h-8 text-chill-sage" />
      </div>
      <h3 className="text-xl font-bold text-white mb-2">Welcome Back!</h3>
      <p className="text-gray-400 mb-6">{message}</p>
      <button 
        onClick={onClose}
        className="w-full py-3 px-4 bg-chill-sage text-black font-bold rounded-xl hover:bg-chill-sand transition"
      >
        Go to Library
      </button>
    </div>
  </div>
);

const AuthFailure = ({ message, onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-chill-bg/80 backdrop-blur-sm p-4 animate-fadeIn">
    <div className="bg-chill-card border border-chill-rose/20 rounded-2xl p-8 max-w-sm w-full text-center shadow-lg">
      <div className="w-16 h-16 bg-chill-rose/10 rounded-full flex items-center justify-center mx-auto mb-4">
        <AlertCircle className="w-8 h-8 text-chill-rose" />
      </div>
      <h3 className="text-xl font-bold text-white mb-2">Login Failed</h3>
      <p className="text-gray-400 mb-6">{message}</p>
      <button 
        onClick={onClose}
        className="w-full py-3 px-4 bg-chill-rose text-black font-bold rounded-xl hover:bg-opacity-90 transition"
      >
        Try Again
      </button>
    </div>
  </div>
);

// ==========================================
// MAIN LOGIN COMPONENT
// ==========================================

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [showFailure, setShowFailure] = useState(false);
    const navigate = useNavigate();
    
    // Use real Firebase auth hook
    const { login, currentUser, loading: authLoading } = useAuth();

    // Redirect if already logged in
    if (currentUser && !authLoading) {
        navigate('/books');
        return null;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            // Use real Firebase login
            await login(email, password);
            setShowSuccess(true);
        } catch (err) {
            console.error("Login error:", err);
            
            // Firebase error handling
            let message = "An unknown error occurred. Please try again.";
            
            switch (err.code) {
                case 'auth/user-not-found':
                case 'auth/wrong-password':
                case 'auth/invalid-credential':
                    message = "Invalid email or password.";
                    break;
                case 'auth/user-disabled':
                    message = "This account has been disabled.";
                    break;
                case 'auth/too-many-requests':
                    message = "Too many failed attempts. Please try again later.";
                    break;
                case 'auth/network-request-failed':
                    message = "Network error. Please check your connection.";
                    break;
                case 'auth/invalid-email':
                    message = "Invalid email address.";
                    break;
                default:
                    message = err.message || "Login failed. Please try again.";
            }
            
            setError(message);
            setShowFailure(true);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSuccessClose = () => {
        setShowSuccess(false);
        navigate('/books', { replace: true });
    };

    const handleForgotPassword = async () => {
        if (!email) {
            setError('Please enter your email address first.');
            return;
        }
        
        try {
            setIsLoading(true);
            // You'll need to add resetPassword function to your useAuth hook
            // const { resetPassword } = useAuth();
            // await resetPassword(email);
            // showToast('Password reset email sent!');
        } catch (error) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    // Loading state while checking auth
    if (authLoading) {
        return (
            <div className="min-h-screen bg-chill-bg flex items-center justify-center">
                <Loader className="w-12 h-12 text-chill-sage animate-spin" />
            </div>
        );
    }

    return (
        <>
            {showSuccess && (
                <AuthSuccess 
                    message="You have successfully logged in!" 
                    onClose={handleSuccessClose} 
                />
            )}
            {showFailure && (
                <AuthFailure 
                    message={error} 
                    onClose={() => {
                        setShowFailure(false);
                        setError('');
                    }} 
                />
            )}
            
            <div className="min-h-screen bg-chill-bg font-sans text-gray-200 selection:bg-chill-sage selection:text-black flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-chill-card p-8 md:p-10 shadow-2xl rounded-3xl border border-white/5 relative overflow-hidden">
                    
                    {/* Decorative Background Elements */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-chill-sage/5 rounded-full blur-3xl transform translate-x-10 -translate-y-10"></div>
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-chill-blue/5 rounded-full blur-3xl transform -translate-x-10 translate-y-10"></div>

                    <div className="relative z-10">
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 rounded-full bg-chill-surface border border-chill-sage/20 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-chill-sage/10">
                                <LogIn className="w-8 h-8 text-chill-sage ml-1" />
                            </div>
                            <h2 className="text-3xl font-extrabold text-white mb-2">
                                Welcome Back
                            </h2>
                            <p className="text-sm text-gray-400">
                                Sign in to access your personalized library.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1.5" htmlFor="email">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 bg-chill-surface border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-chill-sage focus:ring-1 focus:ring-chill-sage transition"
                                        placeholder="Enter your email"
                                        disabled={isLoading}
                                    />
                                    <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1.5" htmlFor="password">
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        autoComplete="current-password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 bg-chill-surface border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-chill-sage focus:ring-1 focus:ring-chill-sage transition"
                                        placeholder="••••••••"
                                        disabled={isLoading}
                                    />
                                    <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                                </div>
                            </div>

                            <div className="flex items-center justify-between mt-2">
                                <div className="flex items-center">
                                    <input 
                                        id="remember-me" 
                                        name="remember-me" 
                                        type="checkbox" 
                                        className="h-4 w-4 text-chill-sage bg-chill-surface border-white/20 rounded focus:ring-chill-sage accent-chill-sage" 
                                    />
                                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-400">
                                        Remember me
                                    </label>
                                </div>

                                <div className="text-sm">
                                    <button
                                        type="button"
                                        onClick={handleForgotPassword}
                                        className="font-medium text-chill-sage hover:text-chill-sand transition-colors disabled:opacity-50"
                                        disabled={isLoading}
                                    >
                                        Forgot password?
                                    </button>
                                </div>
                            </div>

                            {/* Error message display */}
                            {error && !showFailure && (
                                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                                    <p className="text-red-400 text-sm">{error}</p>
                                </div>
                            )}

                            <button
                                type="submit"
                                className="w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-xl shadow-glow-sage text-sm font-bold text-black bg-chill-sage hover:bg-chill-sand transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                                disabled={isLoading || authLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader size={20} className="animate-spin mr-2" />
                                        Signing In...
                                    </>
                                ) : (
                                    "Sign In"
                                )}
                            </button>

                          
                        </form>

                        <div className="mt-8 pt-6 border-t border-white/5 text-center">
                            <p className="text-sm text-gray-500">
                                Don't have an account?{' '}
                                <Link
                                    to="/signup"
                                    className="font-bold text-chill-sage hover:text-chill-sand ml-1 transition duration-150"
                                >
                                    Sign Up
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Login;