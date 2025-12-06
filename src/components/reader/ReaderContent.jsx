import React from 'react';
import { Loader2, AlertCircle } from 'lucide-react';

const ReaderContent = ({ 
  content, 
  loading, 
  error, 
  fontSize, 
  lineHeight, 
  containerRef 
}) => {
  if (loading) {
    return (
      <div className="mb-8 bg-chill-card rounded-2xl p-12 border border-white/5 flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-chill-sage animate-spin mx-auto mb-4" />
          <p className="text-gray-400 font-medium">Loading page content...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mb-8 bg-chill-card rounded-2xl p-8 border border-red-500/20 flex flex-col items-center justify-center min-h-[50vh]">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/20">
            <AlertCircle className="w-8 h-8 text-red-400" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Content Unavailable</h3>
          <p className="text-gray-400 mb-6">{error}</p>
          <p className="text-gray-500 text-xs uppercase tracking-widest font-bold">
            System Message
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <div
        ref={containerRef}
        className={`
          bg-chill-card rounded-2xl p-8 md:p-12 
          border border-white/5 shadow-2xl 
          min-h-[60vh] text-gray-300
          ${fontSize} ${lineHeight} 
          whitespace-pre-line font-serif selection:bg-chill-sage/30 selection:text-white
        `}
      >
        {content || 'No content available for this page.'}
      </div>
    </div>
  );
};

export default ReaderContent;