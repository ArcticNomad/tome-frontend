import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';

const ErrorPage = ({ statusCode = '404', message = 'Page Not Found' }) => {
  return (
    <div className="min-h-screen bg-chill-bg flex flex-col items-center justify-center text-center p-4">
      <div className="bg-chill-card border border-white/10 p-10 rounded-[32px] shadow-2xl max-w-md w-full relative overflow-hidden">
        
        {/* Ambient Glow Effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-40 bg-chill-rose/10 blur-[60px] rounded-full pointer-events-none"></div>

        <div className="flex justify-center mb-6 relative z-10">
          <div className="bg-chill-bg border border-white/5 p-5 rounded-full shadow-inner">
            <AlertTriangle className="text-chill-rose" size={60} />
          </div>
        </div>
        
        <h1 className="text-7xl font-black text-white mb-2 tracking-tighter relative z-10">{statusCode}</h1>
        <h2 className="text-2xl font-bold text-gray-200 mb-4 relative z-10">{message}</h2>
        <p className="text-gray-400 mb-8 relative z-10 leading-relaxed">
          Sorry, we couldn't find the page you were looking for.
        </p>
        
        <Link
          to="/"
          className="inline-flex items-center justify-center bg-chill-sage text-black font-bold px-8 py-3.5 rounded-xl hover:bg-chill-sand transition-all shadow-lg shadow-chill-sage/20 relative z-10 active:scale-95"
        >
          Go Back Home
        </Link>
      </div>
    </div>
  );
};

export default ErrorPage;