import React, { useState, useEffect } from 'react';
import { 
  BookOpen, Sparkles, Brain, Target, Star, Zap, 
  Search, BookMarked, TrendingUp, Users, Loader2 
} from 'lucide-react';

// Custom Color Variables (Same as before)
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
 * Main Full-Screen Loading Spinner with dynamic phases and dots
 */
const LoadingSpinner = ({ 
  fullScreen = true, 
  showStatus = true,
  duration = 5000 
}) => {
  const [currentPhase, setCurrentPhase] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  // Define facts inside component or move outside if static
  const funFacts = [
    "The longest novel ever written has over 2 million words.",
    "Reading for 6 minutes can reduce stress by 68%.",
    "The world's smallest book measures 0.07 mm × 0.10 mm.",
    "The smell of old books is caused by cellulose breakdown.",
    "The first book ever printed was the Gutenberg Bible.",
    "The term 'bookworm' dates back to the 16th century.",
    '"Not all those who wander are lost." – J.R.R. Tolkien',
    '"A reader lives a thousand lives before he dies." – George R.R. Martin',
    '"It does not do to dwell on dreams and forget to live." – J.K. Rowling',
    '"Fairy tales are more than true: not because they tell us that dragons exist, but because they tell us that dragons can be beaten." – Neil Gaiman',
    '"There is no greater agony than bearing an untold story inside you." – Maya Angelou',
    '"I declare after all there is no enjoyment like reading!" – Jane Austen',
    '"Until I feared I would lose it, I never loved to read. One does not love breathing." – Harper Lee',
    '"The more I read, the more I acquire, the more certain I am that I know nothing." – Voltaire',
    '"Think before you speak. Read before you think." – Fran Lebowitz',
  ];

  // Initialize with a random index
  const [currentFactIndex, setCurrentFactIndex] = useState(() => 
    Math.floor(Math.random() * funFacts.length)
  );

  const phases = [
    { icon: Sparkles, text: 'Connecting to archive securely', duration: 1000 },
    { icon: BookOpen, text: 'Indexing library structure', duration: 1200 },
    { icon: Brain, text: 'Analyzing reading patterns', duration: 1100 },
    { icon: Target, text: 'Curating recommendations', duration: 900 },
    { icon: Star, text: 'Finalizing experience', duration: 800 },
  ];

  useEffect(() => {
    let phaseTimeoutId;
    let factTimeoutId;
    let completionTimeoutId;

    // Phase cycling logic
    let currentPhaseIndex = 0;
    const cyclePhases = () => {
      if (currentPhaseIndex < phases.length - 1) {
        currentPhaseIndex++;
        setCurrentPhase(currentPhaseIndex);
        phaseTimeoutId = setTimeout(cyclePhases, phases[currentPhaseIndex].duration);
      } else {
        setIsComplete(true);
      }
    };
    
    phaseTimeoutId = setTimeout(cyclePhases, phases[0].duration);

    // Random Fact cycling logic
    const cycleFacts = () => {
      setCurrentFactIndex(prev => {
        let newIndex;
        // Keep picking a random number until it's different from the previous one
        do {
          newIndex = Math.floor(Math.random() * funFacts.length);
        } while (newIndex === prev && funFacts.length > 1);
        return newIndex;
      });
      factTimeoutId = setTimeout(cycleFacts, 3000);
    };
    
    factTimeoutId = setTimeout(cycleFacts, 3000); // Wait 3s before first switch

    return () => {
      if (phaseTimeoutId) clearTimeout(phaseTimeoutId);
      if (factTimeoutId) clearTimeout(factTimeoutId);
      if (completionTimeoutId) clearTimeout(completionTimeoutId);
    };
  }, [duration, funFacts.length]); // Added dependency for safety

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
        
        {/* Main Icon Spinner */}
        <div className="relative mb-8 sm:mb-12">
          {/* Outer Ring */}
          <div className="absolute inset-0 border-2 border-white/5 rounded-full" />
          
          {/* Spinning Segment */}
          {!isComplete && (
            <div className="absolute inset-0 border-t-2 border-chill-sage rounded-full animate-spin duration-1000" />
          )}
          
          {/* Central Icon Container */}
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center">
            <div className="absolute inset-0 bg-chill-sage/10 rounded-full animate-pulse" />
            
            <div className="relative">
              <CurrentPhaseIcon className="w-8 h-8 sm:w-10 sm:h-10 text-chill-sage transition-all duration-300" />
              
              {/* Success Checkmark */}
              {isComplete && (
                <div className="absolute inset-0 flex items-center justify-center animate-in zoom-in duration-500 bg-chill-bg rounded-full">
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
        <div className="text-center w-full space-y-6">
          
          {showStatus && (
            <div className="h-24 sm:h-28 flex flex-col items-center justify-center space-y-4">
              {/* Status Text */}
              <div className="h-6 sm:h-8 overflow-hidden">
                <div 
                  className={`text-sm sm:text-base font-medium text-white transition-opacity duration-500 ${
                    isComplete ? 'opacity-0' : 'opacity-100'
                  }`}
                >
                  {phases[currentPhase].text}
                </div>
              </div>

              {/* Jumping Dots Indicator */}
              {!isComplete ? (
                <div className="flex gap-2">
                  <div className="w-2 h-2 bg-chill-sage rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <div className="w-2 h-2 bg-chill-sage rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <div className="w-2 h-2 bg-chill-sage rounded-full animate-bounce" />
                </div>
              ) : (
                <div className="h-2" /> // Spacer to prevent layout shift
              )}
              
              {/* Fun Facts (Randomized) */}
              <div className="h-8 sm:h-10 overflow-hidden pt-2">
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

          {/* Completion Message */}
          {isComplete && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="text-lg sm:text-xl font-bold text-white mb-2">
                Ready to explore!
              </div>
              <p className="text-sm sm:text-base text-gray-400">
                Your personalized reading experience is ready
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;