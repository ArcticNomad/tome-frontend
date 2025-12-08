import React, { useState, useEffect } from 'react';
import { 
  BookOpen, Sparkles, Brain, Target, Star, Zap, 
  Search, BookMarked, TrendingUp, Users, Loader2 
} from 'lucide-react';

// Custom Color Variables
const COLOR = {
  BG: '#191A19',
  SURFACE: '#2C2C2C',
  BORDER: '#424242',
  ACCENT: '#D4E09B',
  PRIMARY_TEXT: '#FFFFFF',
  SECONDARY_TEXT: '#9CAFB7',
  BLOB_LIGHT: '#C8B8DB',
};

/**
 * Main Full-Screen Loading Spinner with dynamic phases and facts
 */
const LoadingSpinner = ({ 
  fullScreen = true, 
  showStatus = true,
  duration = 5000 // Default duration in milliseconds
}) => {
  const [currentPhase, setCurrentPhase] = useState(0);
  const [progress, setProgress] = useState(0);
  const [currentFactIndex, setCurrentFactIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const phases = [
    { icon: Sparkles, text: 'Connecting to archive securely', duration: 1000 },
    { icon: BookOpen, text: 'Indexing library structure', duration: 1200 },
    { icon: Brain, text: 'Analyzing reading patterns', duration: 1100 },
    { icon: Target, text: 'Curating recommendations', duration: 900 },
    { icon: Star, text: 'Finalizing experience', duration: 800 },
  ];

  const funFacts = [
    "Bibliotherapy is the practice of using books as therapy.",
    "The longest novel ever written has over 2 million words.",
    "Reading for 6 minutes can reduce stress by 68%.",
    "The world's smallest book measures 0.07 mm × 0.10 mm.",
    "The smell of old books is caused by cellulose breakdown.",
    "The first book ever printed was the Gutenberg Bible.",
    "Most people read at about 200-250 words per minute.",
    "The term 'bookworm' dates back to the 16th century.",
  ];

  useEffect(() => {
    let progressAnimationId;
    let phaseTimeoutId;
    let factTimeoutId;
    let startTime;
    
    const animateProgress = (timestamp) => {
      if (!startTime) startTime = timestamp;
      
      const elapsed = timestamp - startTime;
      const percentComplete = Math.min(elapsed / duration, 1);
      
      // Easing function for smoother progress
      const easeOutQuart = 1 - Math.pow(1 - percentComplete, 4);
      const currentProgress = easeOutQuart * 100;
      
      setProgress(currentProgress);
      
      if (percentComplete < 1) {
        progressAnimationId = requestAnimationFrame(animateProgress);
      } else {
        setIsComplete(true);
        // Set final progress to exactly 100%
        setProgress(100);
      }
    };

    // Start progress animation
    progressAnimationId = requestAnimationFrame(animateProgress);

    // Phase cycling
    let currentPhaseIndex = 0;
    const cyclePhases = () => {
      if (currentPhaseIndex < phases.length - 1) {
        currentPhaseIndex++;
        setCurrentPhase(currentPhaseIndex);
        phaseTimeoutId = setTimeout(cyclePhases, phases[currentPhaseIndex].duration);
      }
    };
    
    phaseTimeoutId = setTimeout(cyclePhases, phases[0].duration);

    // Fun facts cycling
    const cycleFacts = () => {
      setCurrentFactIndex(prev => (prev + 1) % funFacts.length);
      factTimeoutId = setTimeout(cycleFacts, 3000);
    };
    
    factTimeoutId = setTimeout(cycleFacts, 1500);

    // Cleanup
    return () => {
      if (progressAnimationId) cancelAnimationFrame(progressAnimationId);
      if (phaseTimeoutId) clearTimeout(phaseTimeoutId);
      if (factTimeoutId) clearTimeout(factTimeoutId);
    };
  }, [duration]);

  const CurrentPhaseIcon = phases[currentPhase].icon;
  const currentFact = funFacts[currentFactIndex];

  const containerClasses = fullScreen 
    ? "fixed inset-0 z-50 flex flex-col items-center justify-center bg-chill-bg text-white overflow-hidden"
    : "flex flex-col items-center justify-center p-12 bg-chill-card rounded-2xl border border-white/10";

  return (
    <div className={containerClasses}>
      {/* Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-chill-sage/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-chill-lavender/5 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 w-full max-w-md flex flex-col items-center px-4 sm:px-8">
        
        {/* Logo/Brand */}
        <div className="mb-8 sm:mb-12 flex items-center gap-3">
          <div className="h-8 w-8 sm:h-10 sm:w-10">
            <img src="/booklogo.png" alt="Tome Logo" className="w-full h-full" />
          </div>
          <span className="text-xl sm:text-2xl font-black text-white">TOME</span>
        </div>
        
        {/* Main Spinner */}
        <div className="relative mb-8 sm:mb-12">
          {/* Outer Glow Ring */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 border-2 border-white/10 rounded-full" />
            <div 
              className="absolute inset-0 border-t-2 border-chill-sage rounded-full transition-all duration-300"
              style={{ 
                clipPath: `inset(0 ${100 - progress}% 0 0)`,
                transform: 'rotate(0deg)'
              }}
            />
          </div>
          
          {/* Central Icon Container */}
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center">
            {/* Pulsing Background */}
            <div className="absolute inset-0 bg-chill-sage/10 rounded-full animate-pulse" />
            
            {/* Phase Icon */}
            <div className="relative">
              <CurrentPhaseIcon className="w-8 h-8 sm:w-10 sm:h-10 text-chill-sage" />
              
              {/* Success Checkmark Animation */}
              {isComplete && (
                <div className="absolute inset-0 flex items-center justify-center animate-in zoom-in duration-500">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-chill-sage flex items-center justify-center">
                    <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Text Content */}
        <div className="text-center w-full space-y-4 sm:space-y-6">
          
          {/* Status Text */}
          {showStatus && (
            <div className="h-16 sm:h-20 flex flex-col items-center justify-center">
              <div className="h-8 sm:h-10 overflow-hidden">
                <div 
                  className={`text-sm sm:text-base font-medium text-chill-sage transition-transform duration-500 ${
                    isComplete ? 'opacity-0 scale-95' : 'opacity-100'
                  }`}
                >
                  {phases[currentPhase].text}
                </div>
              </div>
              
              {/* Fun Facts */}
              <div className="h-8 sm:h-10 overflow-hidden">
                <div 
                  key={currentFactIndex}
                  className="text-xs sm:text-sm text-gray-400 italic animate-in slide-in-from-bottom-1 fade-in duration-500"
                >
                  <Sparkles className="inline-block w-3 h-3 mr-2 text-chill-sage/60" />
                  {currentFact}
                </div>
              </div>
            </div>
          )}

          {/* Progress Bar */}
          <div className="space-y-2 sm:space-y-3">
            <div className="flex justify-between text-xs sm:text-sm">
              <span className="text-gray-400 font-medium">Loading your library</span>
              <span className="text-chill-sage font-bold font-mono">
                {progress.toFixed(0)}%
              </span>
            </div>
            
            <div className="h-1.5 sm:h-2 w-full bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-chill-sage via-chill-sage to-chill-lavender rounded-full transition-all duration-300 ease-out shadow-lg shadow-chill-sage/20"
                style={{ width: `${progress}%` }}
              />
            </div>
            
            {/* Progress Dots */}
            <div className="flex justify-center gap-1">
              {[...Array(5)].map((_, i) => (
                <div 
                  key={i}
                  className={`w-1 h-1 rounded-full transition-all duration-300 ${
                    progress >= (i + 1) * 20 
                      ? 'bg-chill-sage' 
                      : 'bg-white/20'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Completion Message */}
          {isComplete && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="text-lg sm:text-xl font-bold text-white mb-2">
                Ready to explore!
              </div>
              <p className="text-sm sm:text-base text-gray-400">
                Your personalized reading experience is now ready
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Subtle Floating Elements */}
      {!isComplete && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-chill-sage/30 rounded-full animate-float"
              style={{
                left: `${15 + i * 25}%`,
                top: `${20 + i * 15}%`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: `${3 + i}s`
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

/**
 * Mini Loader for small section loading
 */
export const MiniLoader = ({ message = 'Loading content...' }) => (
  <div className="flex flex-col items-center justify-center p-6 gap-3">
    <div className="relative">
      <div className="w-6 h-6 border-2 border-chill-sage/30 rounded-full" />
      <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-chill-sage rounded-full animate-spin" />
    </div>
    <span className="text-xs text-gray-400 font-medium tracking-wider uppercase">
      {message}
    </span>
  </div>
);

/**
 * Phase Loader for specific blocking actions
 */
export const PhaseLoader = ({ phase, progress }) => {
  const configs = {
    searching: { icon: Search, label: 'Searching' },
    recommending: { icon: Brain, label: 'Thinking' },
    loading: { icon: BookOpen, label: 'Loading' },
    default: { icon: Loader2, label: 'Processing' }
  };

  const config = configs[phase] || configs.default;
  const Icon = config.icon;

  return (
    <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl shadow-lg">
      <div className="relative flex-shrink-0">
        <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-chill-sage animate-pulse" />
        <div className="absolute inset-0 bg-chill-sage/20 blur rounded-full" />
      </div>
      
      <div className="flex-1 min-w-[120px] sm:min-w-[160px]">
        <div className="flex justify-between mb-1">
          <span className="text-xs sm:text-sm font-medium text-white">{config.label}</span>
          <span className="text-xs text-gray-400 font-mono">{progress.toFixed(0)}%</span>
        </div>
        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-chill-sage to-chill-lavender rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;