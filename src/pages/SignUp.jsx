import { useState, useEffect } from "react";
import { 
  Loader, 
  BookOpen, 
  Heart, 
  MapPin, 
  Calendar, 
  Star,
  ChevronRight,
  ChevronLeft,
  Upload,
  X
} from "lucide-react";
import { useAuth } from "../hooks/useAuth"; 
import AuthSuccess from "../components/auth/AuthSuccess";
import AuthFailure from "../components/auth/AuthFailure";
import { useNavigate, Link } from "react-router-dom";

// Genre options matching profile page
const GENRES = [
  'Romance', 'Mystery/Thriller', 'Fantasy', 'Science Fiction', 
  'Historical Fiction', 'Biography', 'Self-Help', 'Young Adult',
  'Horror', 'Literary Fiction', 'Poetry', 'Drama'
];

export default function SignUp() {
    const navigate = useNavigate();
    const { signup } = useAuth();
    
    // Step states
    const [currentStep, setCurrentStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showSuccess, setShowSuccess] = useState(false);
    const [showFailure, setShowFailure] = useState(false);

    // Form Data - All info needed for profile
    const [formData, setFormData] = useState({
        // Step 1: Account Info
        email: '',
        password: '',
        confirmPassword: '',
        displayName: '',
        
        // Step 2: Personal Details
        gender: '',
        birthDate: '',
        city: '',
        country: '',
        profilePicture: null,
        
        // Step 3: Reading Preferences
        favoriteGenres: [],
        readingGoal: 'casual', // casual, regular, avid
        readingFrequency: 'daily', // daily, weekly, monthly
        
        // Step 4: Initial Setup
        favoriteBook: '',
        bookshelves: {
            currentlyReading: [],
            wantToRead: [],
            read: []
        }
    });

    // Handle Step 1: Basic Info
    const handleStep1 = async (e) => {
        e.preventDefault();
        setError(null);

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        if (formData.password.length < 6) {
            setError("Password must be at least 6 characters long.");
            return;
        }

        setCurrentStep(2);
    };

    // Handle Step 2: Personal Details
    const handleStep2 = (e) => {
        e.preventDefault();
        setCurrentStep(3);
    };

    // Handle Step 3: Preferences
    const handleStep3 = (e) => {
        e.preventDefault();
        setCurrentStep(4);
    };

    // Handle Final Step: Complete Signup
  // src/pages/SignUp.jsx (modify the handleFinalSubmit function)
const handleFinalSubmit = async (e) => {
  e.preventDefault();
  setIsLoading(true);
  setError(null);

  try {
    // 1. Create user in Firebase
    const userCredential = await signup(
      formData.email, 
      formData.password, 
      formData.displayName
    );
    
    // 2. Get Firebase ID token
    const idToken = await userCredential.user.getIdToken();
    
    // 3. Create user profile in your backend
    const profileResponse = await fetch('/api/users/profile/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${idToken}`
      },
      body: JSON.stringify({
        displayName: formData.displayName,
        personalDetails: {
          gender: formData.gender,
          birthDate: formData.birthDate,
          location: {
            city: formData.city,
            country: formData.country
          }
        },
        readingPreferences: {
          favoriteGenres: formData.favoriteGenres,
          readingGoal: formData.readingGoal,
          readingFrequency: formData.readingFrequency,
          favoriteBook: formData.favoriteBook
        }
      })
    });

    if (!profileResponse.ok) {
      throw new Error('Failed to create user profile');
    }

    setShowSuccess(true);

  } catch (err) {
    console.error('Signup error:', err);
    setError(err.message || "Signup failed. Please try again.");
    setShowFailure(true);
  } finally {
    setIsLoading(false);
  }
};
    // Update form data
    const updateFormData = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    // Handle genre selection
    const toggleGenre = (genre) => {
        setFormData(prev => {
            const updatedGenres = prev.favoriteGenres.includes(genre)
                ? prev.favoriteGenres.filter(g => g !== genre)
                : [...prev.favoriteGenres, genre];
            
            return { ...prev, favoriteGenres: updatedGenres };
        });
    };

    // Handle profile picture
    const handleProfilePicture = (e) => {
        const file = e.target.files[0];
        if (file) {
            updateFormData('profilePicture', file);
        }
    };

    // Progress calculation
    const progress = (currentStep / 4) * 100;

    // Render current step
    const renderStep = () => {
        switch(currentStep) {
            case 1:
                return (
                    <Step1 
                        formData={formData}
                        updateFormData={updateFormData}
                        onSubmit={handleStep1}
                        isLoading={isLoading}
                    />
                );
            case 2:
                return (
                    <Step2 
                        formData={formData}
                        updateFormData={updateFormData}
                        onSubmit={handleStep2}
                        onBack={() => setCurrentStep(1)}
                        handleProfilePicture={handleProfilePicture}
                    />
                );
            case 3:
                return (
                    <Step3 
                        formData={formData}
                        toggleGenre={toggleGenre}
                        updateFormData={updateFormData}
                        onSubmit={handleStep3}
                        onBack={() => setCurrentStep(2)}
                    />
                );
            case 4:
                return (
                    <Step4 
                        formData={formData}
                        updateFormData={updateFormData}
                        onSubmit={handleFinalSubmit}
                        onBack={() => setCurrentStep(3)}
                        isLoading={isLoading}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <>
            {showSuccess && <AuthSuccess message="Profile created successfully!" onClose={() => navigate('/books')} />}
            {showFailure && <AuthFailure message={error} onClose={() => setShowFailure(false)} />}
            
            <div className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-50 font-sans">
                <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
                    {/* Progress Bar */}
                    <div className="mb-8">
                        <div className="flex justify-between mb-2">
                            <span className="text-sm font-medium text-gray-700">
                                Step {currentStep} of 4
                            </span>
                            <span className="text-sm font-medium text-gray-700">
                                {progress.toFixed(0)}%
                            </span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
                                style={{ width: `${progress}%` }}
                            ></div>
                        </div>
                        <div className="flex justify-between mt-2">
                            <span className="text-xs text-gray-500">Account</span>
                            <span className="text-xs text-gray-500">Profile</span>
                            <span className="text-xs text-gray-500">Preferences</span>
                            <span className="text-xs text-gray-500">Complete</span>
                        </div>
                    </div>

                    {/* Form Container */}
                    <div className="bg-white rounded-3xl shadow-soft border border-gray-100 p-8">
                        {renderStep()}
                    </div>
                </main>
            </div>
        </>
    );
}

// ========== STEP 1: Account Information ==========
function Step1({ formData, updateFormData, onSubmit, isLoading }) {
    return (
        <div>
            <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Create Your Account</h2>
                <p className="text-gray-600 mt-2">Let's start with the basics</p>
            </div>

            <form onSubmit={onSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Display Name
                    </label>
                    <input
                        type="text"
                        required
                        value={formData.displayName}
                        onChange={(e) => updateFormData('displayName', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                        placeholder="How other readers will see you"
                    />
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                    </label>
                    <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => updateFormData('email', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                        placeholder="your.email@example.com"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Password (min 6 characters)
                    </label>
                    <input
                        type="password"
                        required
                        value={formData.password}
                        onChange={(e) => updateFormData('password', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                        placeholder="Create a strong password"
                    />
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Confirm Password
                    </label>
                    <input
                        type="password"
                        required
                        value={formData.confirmPassword}
                        onChange={(e) => updateFormData('confirmPassword', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                        placeholder="Re-enter your password"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full flex justify-center items-center py-3.5 px-4 rounded-xl text-lg font-bold text-white bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transition mt-6"
                    disabled={isLoading}
                >
                    Continue to Profile Details <ChevronRight className="ml-2" />
                </button>
            </form>
        </div>
    );
}

// ========== STEP 2: Personal Details ==========
function Step2({ formData, updateFormData, onSubmit, onBack, handleProfilePicture }) {
    return (
        <div>
            <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center mx-auto mb-4">
                    <Heart className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Tell Us About Yourself</h2>
                <p className="text-gray-600 mt-2">This helps us personalize your experience</p>
            </div>

            <form onSubmit={onSubmit} className="space-y-6">
                {/* Profile Picture Upload */}
                <div className="flex flex-col items-center mb-6">
                    <div className="relative mb-4">
                        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gradient-to-br from-blue-100 to-purple-100">
                            {formData.profilePicture ? (
                                <img 
                                    src={URL.createObjectURL(formData.profilePicture)} 
                                    alt="Preview" 
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <span className="text-gray-400">No image</span>
                                </div>
                            )}
                        </div>
                        <label htmlFor="profile-upload" className="absolute bottom-2 right-2 w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-600 transition shadow-md">
                            <Upload size={20} className="text-white" />
                            <input
                                id="profile-upload"
                                type="file"
                                accept="image/*"
                                onChange={handleProfilePicture}
                                className="hidden"
                            />
                        </label>
                    </div>
                    <p className="text-sm text-gray-500">Add a profile picture (optional)</p>
                </div>

                {/* Gender */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Gender
                    </label>
                    <select
                        value={formData.gender}
                        onChange={(e) => updateFormData('gender', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    >
                        <option value="">Select gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                        <option value="prefer-not-to-say">Prefer not to say</option>
                    </select>
                </div>

                {/* Birth Date */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Calendar size={16} className="inline mr-2" />
                        Date of Birth
                    </label>
                    <input
                        type="date"
                        value={formData.birthDate}
                        onChange={(e) => updateFormData('birthDate', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    />
                </div>

                {/* Location */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        <MapPin size={16} className="inline mr-2" />
                        Location
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                        <input
                            type="text"
                            value={formData.city}
                            onChange={(e) => updateFormData('city', e.target.value)}
                            className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                            placeholder="City"
                        />
                        <input
                            type="text"
                            value={formData.country}
                            onChange={(e) => updateFormData('country', e.target.value)}
                            className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                            placeholder="Country"
                        />
                    </div>
                </div>

                {/* Navigation Buttons */}
                <div className="flex gap-4 pt-6">
                    <button
                        type="button"
                        onClick={onBack}
                        className="flex-1 flex justify-center items-center py-3.5 px-4 rounded-xl text-lg font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition"
                    >
                        <ChevronLeft className="mr-2" /> Back
                    </button>
                    <button
                        type="submit"
                        className="flex-1 flex justify-center items-center py-3.5 px-4 rounded-xl text-lg font-bold text-white bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transition"
                    >
                        Continue to Preferences <ChevronRight className="ml-2" />
                    </button>
                </div>
            </form>
        </div>
    );
}

// ========== STEP 3: Reading Preferences ==========
function Step3({ formData, toggleGenre, updateFormData, onSubmit, onBack }) {
    return (
        <div>
            <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center mx-auto mb-4">
                    <Star className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Reading Preferences</h2>
                <p className="text-gray-600 mt-2">Help us recommend the right books for you</p>
            </div>

            <form onSubmit={onSubmit} className="space-y-6">
                {/* Favorite Genres */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-4">
                        Select your favorite genres (select 3-5)
                    </label>
                    <div className="flex flex-wrap gap-3">
                        {GENRES.map((genre) => (
                            <button
                                key={genre}
                                type="button"
                                onClick={() => toggleGenre(genre)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                                    formData.favoriteGenres.includes(genre)
                                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                {genre}
                            </button>
                        ))}
                    </div>
                    <p className="text-sm text-gray-500 mt-3">
                        Selected: {formData.favoriteGenres.length} genres
                    </p>
                </div>

                {/* Reading Goal */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-4">
                        What's your reading goal?
                    </label>
                    <div className="grid grid-cols-3 gap-4">
                        {[
                            { value: 'casual', label: 'Casual Reader', desc: 'A few books a year' },
                            { value: 'regular', label: 'Regular Reader', desc: '1-2 books per month' },
                            { value: 'avid', label: 'Avid Reader', desc: '3+ books per month' }
                        ].map((option) => (
                            <label
                                key={option.value}
                                className={`cursor-pointer p-4 rounded-xl border-2 transition-all ${
                                    formData.readingGoal === option.value
                                        ? 'border-blue-500 bg-blue-50'
                                        : 'border-gray-200 hover:border-gray-300'
                                }`}
                            >
                                <input
                                    type="radio"
                                    name="readingGoal"
                                    value={option.value}
                                    checked={formData.readingGoal === option.value}
                                    onChange={(e) => updateFormData('readingGoal', e.target.value)}
                                    className="hidden"
                                />
                                <div className="text-center">
                                    <div className="font-medium text-gray-800">{option.label}</div>
                                    <div className="text-sm text-gray-600 mt-1">{option.desc}</div>
                                </div>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Navigation Buttons */}
                <div className="flex gap-4 pt-6">
                    <button
                        type="button"
                        onClick={onBack}
                        className="flex-1 flex justify-center items-center py-3.5 px-4 rounded-xl text-lg font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition"
                    >
                        <ChevronLeft className="mr-2" /> Back
                    </button>
                    <button
                        type="submit"
                        className="flex-1 flex justify-center items-center py-3.5 px-4 rounded-xl text-lg font-bold text-white bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transition"
                    >
                        Complete Setup <ChevronRight className="ml-2" />
                    </button>
                </div>
            </form>
        </div>
    );
}

// ========== STEP 4: Final Review & Submit ==========
function Step4({ formData, updateFormData, onSubmit, onBack, isLoading }) {
    return (
        <div>
            <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-green-500 to-teal-500 flex items-center justify-center mx-auto mb-4">
                    <Star className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Complete Your Profile</h2>
                <p className="text-gray-600 mt-2">Review your information and finish setup</p>
            </div>

            <form onSubmit={onSubmit} className="space-y-6">
                {/* Review Summary */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
                    <h3 className="font-bold text-lg text-gray-800 mb-4">Profile Summary</h3>
                    
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-500">Display Name</p>
                                <p className="font-medium">{formData.displayName}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Email</p>
                                <p className="font-medium">{formData.email}</p>
                            </div>
                        </div>
                        
                        <div>
                            <p className="text-sm text-gray-500">Favorite Genres</p>
                            <div className="flex flex-wrap gap-2 mt-1">
                                {formData.favoriteGenres.slice(0, 5).map((genre) => (
                                    <span key={genre} className="px-3 py-1 bg-white text-blue-600 rounded-full text-xs font-medium border border-blue-200">
                                        {genre}
                                    </span>
                                ))}
                                {formData.favoriteGenres.length > 5 && (
                                    <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                                        +{formData.favoriteGenres.length - 5} more
                                    </span>
                                )}
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-500">Reading Level</p>
                                <p className="font-medium capitalize">{formData.readingGoal} Reader</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Location</p>
                                <p className="font-medium">
                                    {formData.city && formData.country ? `${formData.city}, ${formData.country}` : 'Not specified'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Final Book Setup (Optional) */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Your All-Time Favorite Book (Optional)
                    </label>
                    <input
                        type="text"
                        value={formData.favoriteBook}
                        onChange={(e) => updateFormData('favoriteBook', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                        placeholder="e.g., Pride and Prejudice"
                    />
                </div>

                {/* Terms */}
                <div className="flex items-start">
                    <input
                        type="checkbox"
                        id="terms"
                        required
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 mt-1"
                    />
                    <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
                        I agree to create a personalized reading profile and receive book recommendations.
                        This information will be displayed on my public profile page.
                    </label>
                </div>

                {/* Navigation Buttons */}
                <div className="flex gap-4 pt-6">
                    <button
                        type="button"
                        onClick={onBack}
                        className="flex-1 flex justify-center items-center py-3.5 px-4 rounded-xl text-lg font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition"
                        disabled={isLoading}
                    >
                        <ChevronLeft className="mr-2" /> Back
                    </button>
                    <button
                        type="submit"
                        className="flex-1 flex justify-center items-center py-3.5 px-4 rounded-xl text-lg font-bold text-white bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 transition disabled:opacity-50"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <Loader size={20} className="animate-spin mr-2" />
                                Creating Profile...
                            </>
                        ) : (
                            'Complete Sign Up'
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}

// Helper function for uploading profile picture
async function uploadProfilePicture(uid, file) {
    const formData = new FormData();
    formData.append('profilePicture', file);
    formData.append('uid', uid);
    
    const response = await fetch('/api/users/upload-profile-picture', {
        method: 'POST',
        body: formData
    });
    
    if (!response.ok) {
        throw new Error('Failed to upload profile picture');
    }
    
    return response.json();
}