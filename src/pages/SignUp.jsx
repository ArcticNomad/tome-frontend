import { useState, useEffect, useRef } from "react";
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
  X,
  CheckCircle,
  AlertCircle,
  Search,
  Plus
} from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

import { API_BASE_URL } from "../api/books";

// ==========================================
// MODAL COMPONENTS
// ==========================================

const AuthSuccess = ({ message, onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-chill-bg/80 backdrop-blur-sm p-4 animate-fadeIn">
    <div className="bg-chill-card border border-chill-sage/20 rounded-2xl p-8 max-w-sm w-full text-center shadow-glow-sage">
      <div className="w-16 h-16 bg-chill-sage/10 rounded-full flex items-center justify-center mx-auto mb-4">
        <CheckCircle className="w-8 h-8 text-chill-sage" />
      </div>
      <h3 className="text-xl font-bold text-white mb-2">Success!</h3>
      <p className="text-gray-400 mb-6">{message}</p>
      <button onClick={onClose} className="w-full py-3 px-4 bg-chill-sage text-black font-bold rounded-xl hover:bg-chill-sand transition">
        Continue
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
      <h3 className="text-xl font-bold text-white mb-2">Something went wrong</h3>
      <p className="text-gray-400 mb-6">{message}</p>
      <button onClick={onClose} className="w-full py-3 px-4 bg-chill-rose text-black font-bold rounded-xl hover:bg-opacity-90 transition">
        Try Again
      </button>
    </div>
  </div>
);

// --- Autocomplete Component ---
const Autocomplete = ({ options = [], value, onChange, placeholder, disabled }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(value || "");
  const wrapperRef = useRef(null);

  useEffect(() => { setSearchTerm(value || ""); }, [value]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const safeOptions = Array.isArray(options) ? options : [];
  const filteredOptions = safeOptions.filter(option =>
    typeof option === 'string' && option.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div ref={wrapperRef} className="relative">
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsOpen(true);
            onChange(e.target.value);
          }}
          onFocus={() => setIsOpen(true)}
          disabled={disabled}
          placeholder={placeholder}
          className={`w-full px-4 py-2.5 bg-chill-surface border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-chill-sage focus:ring-1 focus:ring-chill-sage transition ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        />
        <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
          <Search size={16} className="text-gray-500" />
        </div>
      </div>
      {isOpen && !disabled && filteredOptions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-chill-surface border border-white/10 rounded-xl shadow-xl max-h-48 overflow-y-auto hide-scrollbar">
          {filteredOptions.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => { onChange(option); setSearchTerm(option); setIsOpen(false); }}
              className="w-full text-left px-4 py-2 text-gray-300 hover:bg-white/5 hover:text-chill-sage transition-colors text-sm"
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// ==========================================
// DATA CONSTANTS
// ==========================================

const GENRES = [
  'Romance', 'Mystery/Thriller', 'Fantasy', 'Science Fiction',
  'Historical Fiction', 'Biography', 'Self-Help', 'Young Adult',
  'Horror', 'Literary Fiction', 'Poetry', 'Drama'
];

const LOCATIONS = {
  "United States": ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix", "Philadelphia", "San Antonio", "San Diego"],
  "United Kingdom": ["London", "Manchester", "Birmingham", "Leeds", "Glasgow", "Southampton", "Liverpool", "Newcastle"],
  "Canada": ["Toronto", "Vancouver", "Montreal", "Calgary", "Ottawa", "Edmonton", "Mississauga", "Winnipeg"],
  "Australia": ["Sydney", "Melbourne", "Brisbane", "Perth", "Adelaide", "Gold Coast", "Canberra"],
  "Germany": ["Berlin", "Hamburg", "Munich", "Cologne", "Frankfurt", "Stuttgart", "Düsseldorf"],
  "France": ["Paris", "Marseille", "Lyon", "Toulouse", "Nice", "Nantes", "Strasbourg"],
  "Japan": ["Tokyo", "Yokohama", "Osaka", "Nagoya", "Sapporo", "Fukuoka", "Kobe"],
  "Italy": ["Rome", "Milan", "Naples", "Turin", "Palermo", "Genoa", "Bologna", "Florence"],
  "Spain": ["Madrid", "Barcelona", "Valencia", "Seville", "Zaragoza", "Málaga", "Murcia", "Palma"],
  "India": ["Mumbai", "Delhi", "Bangalore", "Hyderabad", "Ahmedabad", "Chennai", "Kolkata", "Surat"],
  "China": ["Shanghai", "Beijing", "Guangzhou", "Shenzhen", "Chengdu", "Tianjin", "Wuhan", "Dongguan"],
  "Brazil": ["São Paulo", "Rio de Janeiro", "Brasília", "Salvador", "Fortaleza", "Belo Horizonte", "Manaus", "Curitiba"],
  "Pakistan": ["Karachi", "Lahore", "Faisalabad", "Rawalpindi", "Multan", "Hyderabad", "Gujranwala", "Peshawar"],
  "Other": []
};

// ==========================================
// MAIN COMPONENT
// ==========================================

export default function SignUp() {
  const navigate = useNavigate();
  const { signup } = useAuth();

  // Step states
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showFailure, setShowFailure] = useState(false);

  const [formData, setFormData] = useState({
    email: '', password: '', confirmPassword: '', displayName: '',
    gender: '', birthDate: '', city: '', country: '', profilePicture: null,
    favoriteGenres: [], readingGoal: 'casual', readingFrequency: 'daily',
    favoriteBook: '', bookshelves: { currentlyReading: [], wantToRead: [], read: [] }
  });

  // Check availability with backend
  // Add this at the top of your SignUp.js file, after imports
  const API_BASE_URL = 'https://tome-backend-production-5402.up.railway.app/api';

  // Update the checkAvailability function:
  const checkAvailability = async (email, displayName) => {
    try {
      console.log('🔍 Checking availability...');
      console.log('Email:', email);
      console.log('Display Name:', displayName);
      console.log('Using API URL:', API_BASE_URL);

      // Check email availability
      const emailResponse = await fetch(
        `${API_BASE_URL}/users/profile/check-availability?field=email&value=${encodeURIComponent(email)}`,
        {
          method: 'GET',
          headers: {
            'Accept': 'application/json'
          }
        }
      );

      console.log('📧 Email check response status:', emailResponse.status);

      if (!emailResponse.ok) {
        console.error('❌ Email check failed:', emailResponse.status, emailResponse.statusText);
        // Try to get error message
        try {
          const errorText = await emailResponse.text();
          console.error('Error response:', errorText);
        } catch (e) {
          console.error('Could not read error response');
        }
        throw new Error('Failed to check email availability');
      }

      const emailData = await emailResponse.json();
      console.log('✅ Email availability result:', emailData);

      // Check display name availability
      const nameResponse = await fetch(
        `${API_BASE_URL}/users/profile/check-availability?field=displayName&value=${encodeURIComponent(displayName)}`,
        {
          method: 'GET',
          headers: {
            'Accept': 'application/json'
          }
        }
      );

      console.log('👤 Display name check response status:', nameResponse.status);

      if (!nameResponse.ok) {
        console.error('❌ Display name check failed:', nameResponse.status, nameResponse.statusText);
        throw new Error('Failed to check username availability');
      }

      const nameData = await nameResponse.json();
      console.log('✅ Display name availability result:', nameData);

      // If either is not available, throw error
      if (!emailData.available) {
        throw new Error('Email already in use');
      }

      if (!nameData.available) {
        throw new Error('Display name already taken');
      }

      console.log('✅ Availability check passed!');
      return true;
    } catch (error) {
      console.error('❌ Availability check failed:', error);
      // Check if it's a network error
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Network error. Please check your internet connection.');
      }
      throw error;
    }
  };
  const handleStep1 = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    // 1. Basic Validation
    if (!formData.displayName.trim() || !formData.email.trim() || !formData.password || !formData.confirmPassword) {
      setError("All fields are required.");
      setShowFailure(true);
      setIsLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      setShowFailure(true);
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      setShowFailure(true);
      setIsLoading(false);
      return;
    }

    // 2. Check Availability
    try {
      await checkAvailability(formData.email, formData.displayName);
      // If successful, proceed
      setCurrentStep(2);
    } catch (err) {
      setError(err.message);
      setShowFailure(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStep2 = (e) => {
    e.preventDefault();

    // Validate Step 2 Fields
    if (!formData.gender || !formData.birthDate || !formData.country || !formData.city) {
      setError("Please fill in all required fields.");
      setShowFailure(true);
      return;
    }

    setCurrentStep(3);
  };

  const handleStep3 = (e) => {
    e.preventDefault();

    // Validate Step 3 (At least 3 genres)
    if (formData.favoriteGenres.length < 3) {
      setError("Please select at least 3 favorite genres.");
      setShowFailure(true);
      return;
    }

    setCurrentStep(4);
  };

  const handleFinalSubmit = async (e) => {
  e.preventDefault();
  setIsLoading(true);
  setError(null);
  
  try {
    console.log('🚀 Starting signup process...');
    
    // 1. Create Firebase account
    console.log('🔥 Creating Firebase account...');
    const userCredential = await signup(formData.email, formData.password, formData.displayName);
    const token = await userCredential.user.getIdToken();
    const firebaseUid = userCredential.user.uid;
    
    console.log('✅ Firebase account created');
    console.log('UID:', firebaseUid);
    console.log('Token (first 20 chars):', token.substring(0, 20) + '...');
    
    // 2. Create user profile in backend
    const profileData = {
      displayName: formData.displayName,
      email: formData.email,
      gender: formData.gender,
      birthDate: formData.birthDate,
      location: formData.city ? `${formData.city}, ${formData.country}` : formData.country,
      favoriteGenres: formData.favoriteGenres,
      readingGoal: formData.readingGoal,
      favoriteBook: formData.favoriteBook
    };
    
    console.log('📤 Sending profile data to backend:', profileData);
    console.log('API URL:', `${API_BASE_URL}/users/profile/create`);
    
   const profileResponse = await fetch(`${API_BASE_URL}/users/profile/create`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    ...profileData,
    firebaseUid: firebaseUid  // ← ADD THIS LINE!
  })
});
    
    console.log('📥 Backend response status:', profileResponse.status);
    console.log('Backend response headers:', Object.fromEntries(profileResponse.headers.entries()));
    
    // First, check if response is JSON
    const contentType = profileResponse.headers.get('content-type');
    console.log('Response content-type:', contentType);
    
    let responseData;
    
    if (contentType && contentType.includes('application/json')) {
      responseData = await profileResponse.json();
      console.log('✅ JSON response received:', responseData);
    } else {
      // If not JSON, get as text to see what's returned
      const textResponse = await profileResponse.text();
      console.error('❌ Non-JSON response from server:', textResponse.substring(0, 500));
      throw new Error(`Server returned ${profileResponse.status}: ${profileResponse.statusText}. Expected JSON but got: ${contentType || 'unknown'}`);
    }
    
    if (!profileResponse.ok) {
      console.error('❌ Profile creation failed:', responseData);
      throw new Error(responseData.message || `Failed to create profile: ${profileResponse.status}`);
    }
    
    console.log('🎉 Profile created successfully:', responseData);
    
    // Show success message
    setShowSuccess(true);
    
    // Store user info in localStorage
    localStorage.setItem('userToken', token);
    localStorage.setItem('userUid', firebaseUid);
    localStorage.setItem('userEmail', formData.email);
    
    // Redirect after a short delay
    setTimeout(() => {
      console.log('🔄 Redirecting to books page...');
      navigate('/books');
    }, 1500);
    
  } catch (err) {
    console.error('❌ Signup error:', err);
    console.error('Error details:', {
      name: err.name,
      message: err.message,
      code: err.code,
      stack: err.stack
    });
    
    // Firebase error handling
    let errorMessage = err.message || "Signup failed. Please try again.";
    
    if (err.code === 'auth/email-already-in-use') {
      errorMessage = 'Email already in use. Please try another email.';
    } else if (err.code === 'auth/weak-password') {
      errorMessage = 'Password is too weak. Please use a stronger password.';
    } else if (err.code === 'auth/invalid-email') {
      errorMessage = 'Invalid email address.';
    } else if (err.code === 'auth/operation-not-allowed') {
      errorMessage = 'Email/password accounts are not enabled.';
    } else if (err.message.includes('Network error')) {
      errorMessage = 'Network error. Please check your internet connection and try again.';
    } else if (err.message.includes('Failed to fetch')) {
      errorMessage = 'Cannot connect to server. Please try again later.';
    }
    
    setError(errorMessage);
    setShowFailure(true);
    
    // Optional: Auto-hide error after 5 seconds
    setTimeout(() => {
      setShowFailure(false);
    }, 5000);
  } finally {
    setIsLoading(false);
  }
};
  const updateFormData = (field, value) => {
    setFormData(prev => {
      if (field === 'country' && prev.country !== value) {
        return { ...prev, [field]: value, city: '' };
      }
      return { ...prev, [field]: value };
    });
  };

  const toggleGenre = (genre) => {
    setFormData(prev => {
      const updatedGenres = prev.favoriteGenres.includes(genre)
        ? prev.favoriteGenres.filter(g => g !== genre)
        : [...prev.favoriteGenres, genre];
      return { ...prev, favoriteGenres: updatedGenres };
    });
  };

  const handleProfilePicture = (e) => {
    const file = e.target.files[0];
    if (file) updateFormData('profilePicture', file);
  };

  const progress = (currentStep / 4) * 100;

  const renderStep = () => {
    switch (currentStep) {
      case 1: return <Step1 formData={formData} updateFormData={updateFormData} onSubmit={handleStep1} isLoading={isLoading} />;
      case 2: return <Step2 formData={formData} updateFormData={updateFormData} onSubmit={handleStep2} onBack={() => setCurrentStep(1)} handleProfilePicture={handleProfilePicture} />;
      case 3: return <Step3 formData={formData} toggleGenre={toggleGenre} updateFormData={updateFormData} onSubmit={handleStep3} onBack={() => setCurrentStep(2)} />;
      case 4: return <Step4 formData={formData} updateFormData={updateFormData} onSubmit={handleFinalSubmit} onBack={() => setCurrentStep(3)} isLoading={isLoading} />;
      default: return null;
    }
  };

  return (
    <>
      {showSuccess && <AuthSuccess message="Profile created successfully!" onClose={() => navigate('/books')} />}
      {showFailure && <AuthFailure message={error} onClose={() => setShowFailure(false)} />}

      <div className="h-screen bg-chill-bg font-sans text-gray-200 selection:bg-chill-sage selection:text-black flex items-center justify-center p-4 overflow-hidden">

        {/* --- MAIN CARD CONTAINER (Constrained Height & Width) --- */}
        <div className="max-w-5xl w-full max-h-[90vh] bg-chill-card shadow-2xl rounded-3xl border border-white/5 overflow-hidden flex flex-col md:flex-row h-full md:h-auto md:max-h-[90vh]">

          {/* --- LEFT SIDE: FORM (Scrollable) --- */}
          <div className="w-full md:w-1/2 p-6 md:p-8 relative z-10 flex flex-col overflow-y-auto hide-scrollbar">

            {/* Decorative Blur */}
            <div className="absolute top-0 left-0 w-32 h-32 bg-chill-sage/5 rounded-full blur-3xl transform -translate-x-10 -translate-y-10 pointer-events-none"></div>

            {/* Progress Bar */}
            <div className="mb-6 flex-shrink-0">
              <div className="flex justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-chill-sage">Step {currentStep} / 4</span>
                <span className="text-xs font-medium text-gray-500">{progress.toFixed(0)}%</span>
              </div>
              <div className="h-1.5 bg-chill-surface rounded-full overflow-hidden border border-white/5">
                <div className="h-full bg-chill-sage transition-all duration-300 shadow-glow-sage" style={{ width: `${progress}%` }}></div>
              </div>
            </div>

            {/* Render Active Step */}
            <div className="flex-grow flex flex-col justify-center animate-fadeIn">
              {renderStep()}
            </div>

            {/* Footer Link */}
            <div className="mt-6 pt-4 border-t border-white/5 text-center flex-shrink-0">
              <p className="text-xs text-gray-500">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="font-bold text-chill-sage hover:text-chill-sand ml-1 transition duration-150 underline decoration-chill-sage/30 underline-offset-4"
                  disabled={isLoading}
                >
                  Log In
                </button>
              </p>
            </div>
          </div>

          {/* --- RIGHT SIDE: IMAGE (Fixed) --- */}
          <div className="hidden md:block w-1/2 bg-chill-surface relative overflow-hidden group ">
            <div className="absolute inset-0 bg-chill-bg/20 z-10"></div>
            <img
              src="./signup.png"
              alt="Reading Nook"
              className="absolute inset-0 w-full h-full object-cover opacity-60  transition-all duration-700 group-hover:scale-98 group-hover:grayscale-1 group-hover:opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-chill-bg via-chill-bg/40 to-transparent opacity-90 z-20"></div>

            <div className="absolute bottom-0 left-0 right-0 p-10 z-30 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
              <div className="w-12 h-1 bg-chill-sage mb-4"></div>
              <blockquote className="text-xl font-serif text-white italic leading-relaxed mb-3">
                "A reader lives a thousand lives before he dies."
              </blockquote>
              <p className="text-chill-sage font-bold uppercase tracking-widest text-[10px]">
                - George R.R. Martin
              </p>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}

// ========== STEPS COMPONENTS ==========

function Step1({ formData, updateFormData, onSubmit, isLoading }) {
  return (
    <div>
      <div className="text-center mb-6">
        <div className="w-12 h-12 rounded-xl bg-chill-surface border border-chill-sage/20 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-chill-sage/10">
          <BookOpen className="w-6 h-6 text-chill-sage" />
        </div>
        <h2 className="text-2xl font-bold text-white">Create Account</h2>
        <p className="text-sm text-gray-400 mt-1">Let's start with the basics</p>
      </div>
      <form onSubmit={onSubmit} className="space-y-3">
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wide">Display Name</label>
          <input type="text" required value={formData.displayName} onChange={(e) => updateFormData('displayName', e.target.value)} className="w-full px-4 py-2.5 bg-chill-surface border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-chill-sage focus:ring-1 focus:ring-chill-sage transition" placeholder="How other readers will see you" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wide">Email</label>
          <input type="email" required value={formData.email} onChange={(e) => updateFormData('email', e.target.value)} className="w-full px-4 py-2.5 bg-chill-surface border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-chill-sage focus:ring-1 focus:ring-chill-sage transition" placeholder="name@example.com" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wide">Password</label>
            <input type="password" required value={formData.password} onChange={(e) => updateFormData('password', e.target.value)} className="w-full px-4 py-2.5 bg-chill-surface border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-chill-sage focus:ring-1 focus:ring-chill-sage transition" placeholder="******" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wide">Confirm</label>
            <input type="password" required value={formData.confirmPassword} onChange={(e) => updateFormData('confirmPassword', e.target.value)} className="w-full px-4 py-2.5 bg-chill-surface border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-chill-sage focus:ring-1 focus:ring-chill-sage transition" placeholder="******" />
          </div>
        </div>
        <button type="submit" className="w-full flex justify-center items-center py-3 px-4 rounded-xl text-sm font-bold text-black bg-chill-sage hover:bg-chill-sand transition mt-4 shadow-glow-sage hover:scale-[1.01] active:scale-[0.99] duration-200" disabled={isLoading}>
          {isLoading ? <Loader size={18} className="animate-spin" /> : <>Next Step <ChevronRight className="ml-2 w-4 h-4" /></>}
        </button>
      </form>
    </div>
  );
}

function Step2({ formData, updateFormData, onSubmit, onBack, handleProfilePicture }) {
  const countries = Object.keys(LOCATIONS);
  const cities = formData.country ? LOCATIONS[formData.country] || [] : [];
  return (
    <div>
      <div className="text-center mb-6">
        <div className="w-12 h-12 rounded-xl bg-chill-surface border border-chill-rose/20 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-chill-rose/10">
          <Heart className="w-6 h-6 text-chill-rose" />
        </div>
        <h2 className="text-2xl font-bold text-white">About You</h2>
        <p className="text-sm text-gray-400 mt-1">Personalize your experience</p>
      </div>
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="flex items-center gap-4 bg-chill-surface/50 p-3 rounded-xl border border-white/5">
          <div className="relative w-16 h-16 flex-shrink-0">
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-chill-surface bg-chill-highlight">
              {formData.profilePicture ? <img src={URL.createObjectURL(formData.profilePicture)} alt="Preview" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><Upload size={20} className="text-gray-500" /></div>}
            </div>
            <label htmlFor="profile-upload" className="absolute -bottom-1 -right-1 w-6 h-6 bg-chill-sage rounded-full flex items-center justify-center cursor-pointer hover:bg-chill-sand transition border border-chill-bg"><Plus size={14} className="text-black" /><input id="profile-upload" type="file" accept="image/*" onChange={handleProfilePicture} className="hidden" /></label>
          </div>
          <div className="flex-grow">
            <p className="text-sm font-medium text-white">Profile Photo</p>
            <p className="text-xs text-gray-500">Optional. Max 2MB.</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wide">Gender</label>
            <select value={formData.gender} onChange={(e) => updateFormData('gender', e.target.value)} className="w-full px-4 py-2.5 bg-chill-surface border border-white/10 rounded-xl text-white focus:outline-none focus:border-chill-sage focus:ring-1 focus:ring-chill-sage transition appearance-none text-sm h-12">
              <option value="">Select</option><option value="male">Male</option><option value="female">Female</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wide">Birth Date</label>
            <input type="date" value={formData.birthDate} onChange={(e) => updateFormData('birthDate', e.target.value)} className="w-full px-4 py-2.5 bg-chill-surface border border-white/10 rounded-xl text-white focus:outline-none focus:border-chill-sage focus:ring-1 focus:ring-chill-sage transition [color-scheme:dark] text-sm h-12" />
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wide">Location</label>
          <div className="grid grid-cols-2 gap-3">
            <div className="relative"><Autocomplete options={countries} value={formData.country} onChange={(val) => updateFormData('country', val)} placeholder="Country" /></div>
            <div className="relative"><Autocomplete options={cities} value={formData.city} onChange={(val) => updateFormData('city', val)} disabled={!formData.country} placeholder="City" /></div>
          </div>
        </div>
        <div className="flex gap-3 pt-4">
          <button type="button" onClick={onBack} className="flex-1 flex justify-center items-center py-3 px-4 rounded-xl text-base font-medium text-gray-300 bg-chill-surface border border-white/10 hover:bg-white/5 transition h-12"><ChevronLeft className="mr-2 w-4 h-4" /> Back</button>
          <button type="submit" className="flex-1 flex justify-center items-center py-3 px-4 rounded-xl text-base font-bold text-black bg-chill-sage hover:bg-chill-sand transition shadow-glow-sage h-12">Continue <ChevronRight className="ml-2 w-4 h-4" /></button>
        </div>
      </form>
    </div>
  );
}

function Step3({ formData, toggleGenre, updateFormData, onSubmit, onBack }) {
  return (
    <div>
      <div className="text-center mb-6">
        <div className="w-12 h-12 rounded-xl bg-chill-surface border border-chill-sand/20 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-chill-sand/10">
          <Star className="w-6 h-6 text-chill-sand" />
        </div>
        <h2 className="text-2xl font-bold text-white">Preferences</h2>
        <p className="text-sm text-gray-400 mt-1">Select 3+ genres you love</p>
      </div>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-gray-300 mb-3">Select your favorite genres (3-5)</label>
          <div className="flex flex-wrap gap-2">
            {GENRES.map((genre) => (
              <button key={genre} type="button" onClick={() => toggleGenre(genre)} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${formData.favoriteGenres.includes(genre) ? 'bg-chill-sage text-black shadow-lg shadow-chill-sage/20' : 'bg-chill-surface border border-white/10 text-gray-400 hover:text-white hover:border-white/20'}`}>{genre}</button>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-2">Selected: {formData.favoriteGenres.length} genres</p>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-300 mb-3">What's your reading goal?</label>
          <div className="grid grid-cols-3 gap-2">
            {[{ value: 'casual', label: 'Casual', desc: '< 5/yr' }, { value: 'regular', label: 'Regular', desc: '1/mo' }, { value: 'avid', label: 'Avid', desc: '3+/mo' }].map((option) => (
              <label key={option.value} className={`cursor-pointer p-3 rounded-lg border transition-all text-center ${formData.readingGoal === option.value ? 'border-chill-sage bg-chill-sage/10 shadow-glow-sage' : 'border-white/10 bg-chill-surface hover:border-white/20'}`}>
                <input type="radio" name="readingGoal" value={option.value} checked={formData.readingGoal === option.value} onChange={(e) => updateFormData('readingGoal', e.target.value)} className="hidden" />
                <div className={`text-sm font-medium ${formData.readingGoal === option.value ? 'text-chill-sage' : 'text-gray-300'}`}>{option.label}</div>
                <div className="text-xs text-gray-500 mt-0.5">{option.desc}</div>
              </label>
            ))}
          </div>
        </div>
        <div className="flex gap-3 pt-4">
          <button type="button" onClick={onBack} className="flex-1 flex justify-center items-center py-3 px-4 rounded-xl text-base font-medium text-gray-300 bg-chill-surface border border-white/10 hover:bg-white/5 transition h-12"><ChevronLeft className="mr-2 w-4 h-4" /> Back</button>
          <button type="submit" className="flex-1 flex justify-center items-center py-3 px-4 rounded-xl text-base font-bold text-black bg-chill-sage hover:bg-chill-sand transition shadow-glow-sage h-12">Next Step</button>
        </div>
      </form>
    </div>
  );
}

function Step4({ formData, updateFormData, onSubmit, onBack, isLoading }) {
  return (
    <div>
      <div className="text-center mb-6">
        <div className="w-12 h-12 rounded-xl bg-chill-surface border border-chill-blue/20 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-chill-blue/10">
          <CheckCircle className="w-6 h-6 text-chill-blue" />
        </div>
        <h2 className="text-2xl font-bold text-white">Review & Finish</h2>
        <p className="text-sm text-gray-400 mt-1">Almost there!</p>
      </div>
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="bg-chill-surface rounded-xl p-4 border border-white/5 text-sm">
          <div className="flex justify-between items-center mb-2 border-b border-white/5 pb-2">
            <span className="text-gray-500">Name</span>
            <span className="text-white font-medium">{formData.displayName}</span>
          </div>
          <div className="flex justify-between items-center mb-2 border-b border-white/5 pb-2">
            <span className="text-gray-500">Email</span>
            <span className="text-white font-medium truncate max-w-[150px]">{formData.email}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-500">Goal</span>
            <span className="text-chill-sage font-medium capitalize">{formData.readingGoal} Reader</span>
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wide">Favorite Book</label>
          <input type="text" value={formData.favoriteBook} onChange={(e) => updateFormData('favoriteBook', e.target.value)} className="w-full px-4 py-2.5 bg-chill-surface border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-chill-sage focus:ring-1 focus:ring-chill-sage transition text-sm" placeholder="e.g. Harry Potter" />
        </div>
        <div className="flex items-start gap-3 bg-chill-highlight/30 p-3 rounded-lg border border-white/5">
          <input type="checkbox" id="terms" required className="mt-0.5 w-4 h-4 text-chill-sage bg-chill-surface border-white/20 rounded focus:ring-chill-sage accent-chill-sage" />
          <label htmlFor="terms" className="text-xs text-gray-400 leading-relaxed cursor-pointer select-none">I agree to the Terms of Service and Privacy Policy.</label>
        </div>
        <div className="flex gap-3 pt-2">
          <button type="button" onClick={onBack} className="px-4 py-3 rounded-xl text-sm font-bold text-gray-400 bg-chill-surface hover:bg-white/5 transition" disabled={isLoading}><ChevronLeft className="w-5 h-5" /></button>
          <button type="submit" className="flex-1 py-3 px-4 rounded-xl text-sm font-bold text-black bg-chill-sage hover:bg-chill-sand transition shadow-glow-sage disabled:opacity-50 disabled:cursor-not-allowed" disabled={isLoading}>{isLoading ? <Loader size={18} className="animate-spin mx-auto" /> : 'Create Account'}</button>
        </div>
      </form>
    </div>
  );
}