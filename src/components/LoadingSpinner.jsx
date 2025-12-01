import React from 'react';

const LoadingSpinner = ({ fullScreen = true }) => {
  const containerClasses = fullScreen 
    ? "fixed inset-0 z-50 flex items-center justify-center w-full h-screen bg-stone-100" // Full screen + Beige-like background
    : "flex items-center justify-center p-4";

  return (
    <div className={containerClasses}>
      <style>{`
        @keyframes spin-switch {
          0% { transform: rotate(0deg) scale(1); }
          25% { transform: rotate(90deg) scale(0.8); }
          50% { transform: rotate(180deg) scale(1); }
          75% { transform: rotate(270deg) scale(0.8); }
          100% { transform: rotate(360deg) scale(1); }
        }
      `}</style>
      
      <div 
        className="grid grid-cols-2 gap-3"
        style={{ 
          // The cubic-bezier gives it that "snap" switching effect
          animation: 'spin-switch 2.5s cubic-bezier(0.68, -0.55, 0.27, 1.55) infinite'
        }}
      >
        <div className="w-4 h-4 bg-stone-800 rounded-full"></div>
        <div className="w-4 h-4 bg-stone-800 rounded-full opacity-80"></div>
        <div className="w-4 h-4 bg-stone-800 rounded-full opacity-40"></div>
        <div className="w-4 h-4 bg-stone-800 rounded-full opacity-60"></div>
      </div>
    </div>
  );
};

export default LoadingSpinner;