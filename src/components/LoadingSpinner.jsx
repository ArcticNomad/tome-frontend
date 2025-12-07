import React, { useState, useEffect } from 'react';
import { 
  BookOpen, Sparkles, Brain, Target, Star, Zap, 
  Search, BookMarked, TrendingUp, Users, Loader2 
} from 'lucide-react';

const LoadingSpinner = ({ 
  fullScreen = true, 
  showStatus = true 
}) => {
  const [currentPhase, setCurrentPhase] = useState(0);
  const [progress, setProgress] = useState(0);
  const [currentFact, setCurrentFact] = useState(0);
  
  const phases = [
    { text: 'Connecting to archive', icon: Sparkles },
    { text: 'Scanning library index', icon: BookOpen },
    { text: 'Analyzing preferences', icon: Brain },
    { text: 'Curating selection', icon: Target },
    { text: 'Polishing interface', icon: Star },
  ];

  const funFacts = [
    "Bibliotherapy is the practice of using books as therapy.",
    "The longest novel ever written has over 2 million words.",
    "Reading for 6 minutes can reduce stress by 68%.",
    "The world's smallest book measures 0.07 mm × 0.10 mm.",
    "The smell of old books is caused by the breakdown of cellulose.",
  ];

  useEffect(() => {
    // Randomize fact on mount so it's fresh if component remounts
    setCurrentFact(Math.floor(Math.random() * funFacts.length));

    // Progress simulation - Continuous Loop
    const timer = setInterval(() => {
      setProgress(old => {
        // Reset to 0 when complete to show continuous activity (Indeterminate state)
        if (old >= 100) return 0;
        // Linear increment for smooth, consistent motion
        return old + 0.8;
      });
    }, 20);

    // Phase cycling
    const phaseTimer = setInterval(() => {
      setCurrentPhase(prev => (prev + 1) % phases.length);
    }, 1200);

    // Fact cycling
    const factTimer = setInterval(() => {
      setCurrentFact(prev => (prev + 1) % funFacts.length);
    }, 3000);

    return () => {
      clearInterval(timer);
      clearInterval(phaseTimer);
      clearInterval(factTimer);
    };
  }, []);

  const CurrentIcon = phases[currentPhase].icon;

  const containerClasses = fullScreen 
    ? "fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#212121] text-[#EAD2AC]"
    : "flex flex-col items-center justify-center p-12 bg-[#212121] text-[#EAD2AC] rounded-2xl border border-[#424242]";

  return (
    <div className={containerClasses}>
      <div className="w-full max-w-md flex flex-col items-center relative z-10">
        
        {/* Main Icon Animation */}
        <div className="relative mb-12">
          {/* Subtle glow behind - using Sage */}
          <div className="absolute inset-0 bg-[#D4E09B]/10 blur-3xl rounded-full" />
          
          <div className="relative h-16 w-16 flex items-center justify-center">
            {/* Spinning outer ring - using Highlight */}
            <div className="absolute inset-0 border-2 border-[#424242] rounded-full" />
            <div 
              className="absolute inset-0 border-t-2 border-[#D4E09B] rounded-full animate-spin"
              style={{ animationDuration: '2s' }} 
            />
            
            {/* Inner Icon with transition */}
            <div className="transition-all duration-500 transform scale-100 opacity-100">
              <CurrentIcon size={24} className="text-[#D4E09B]" />
            </div>
          </div>
        </div>

        {/* Text Content */}
        <div className="text-center space-y-6 w-full px-8">
          
          {/* Phase Text */}
          <div className="space-y-2">
            <h2 className="text-xl font-medium tracking-tight text-[#EAD2AC]">
              {phases[currentPhase].text}
            </h2>
            <div className="h-1 w-full bg-[#303030] rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#D4E09B] transition-all duration-200 ease-linear"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex justify-between text-xs font-mono text-[#9CAFB7] pt-1">
              {/* Show indeterminate status instead of numbers that reset */}
              <span>Working...</span>
              <span>{Math.round(progress)}%</span>
            </div>
          </div>

          {/* Fun Fact Area - Minimalist fade */}
          {showStatus && (
            <div className="h-16 flex items-center justify-center">
              <p className="text-sm text-[#9CAFB7] animate-fade-in transition-opacity duration-500 max-w-xs leading-relaxed">
                "{funFacts[currentFact]}"
              </p>
            </div>
          )}
        </div>
      </div>
      
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Sage blob */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#D4E09B]/5 rounded-full blur-3xl" />
        {/* Lavender blob for contrast */}
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-[#C8B8DB]/5 rounded-full blur-3xl" />
      </div>
    </div>
  );
};

// --- Mini Loader (for small sections) ---
export const MiniLoader = ({ message = 'Loading...' }) => (
  <div className="flex flex-col items-center justify-center p-8 gap-4 text-[#9CAFB7]">
    <Loader2 className="w-6 h-6 animate-spin text-[#D4E09B]" />
    <span className="text-xs font-medium uppercase tracking-widest">{message}</span>
  </div>
);

// --- Phase Loader (for specific blocking actions) ---
export const PhaseLoader = ({ phase, progress }) => {
  const configs = {
    searching: { icon: Search, label: 'Searching' },
    recommending: { icon: Brain, label: 'Thinking' },
    default: { icon: Loader2, label: 'Processing' }
  };

  const config = configs[phase] || configs.default;
  const Icon = config.icon;

  return (
    <div className="flex items-center gap-4 p-4 bg-[#303030]/80 border border-[#424242] rounded-xl backdrop-blur-sm">
      <div className="relative flex-shrink-0">
        <Icon className="w-5 h-5 text-[#D4E09B] animate-pulse" />
        {phase === 'recommending' && (
          <div className="absolute inset-0 bg-[#D4E09B]/20 blur-md rounded-full animate-pulse" />
        )}
      </div>
      
      <div className="flex-1 min-w-[200px]">
        <div className="flex justify-between mb-2">
          <span className="text-sm font-medium text-[#EAD2AC]">{config.label}</span>
          <span className="text-xs text-[#9CAFB7] font-mono">{progress}%</span>
        </div>
        <div className="h-1 bg-[#212121] rounded-full overflow-hidden">
          <div 
            className="h-full bg-[#D4E09B] transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;