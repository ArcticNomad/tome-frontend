import React from 'react';
import { XCircle } from 'lucide-react';

const AuthFailure = ({ message, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-chill-card border border-white/10 rounded-3xl shadow-2xl p-8 max-w-sm w-full text-center relative overflow-hidden">
        
        {/* Ambient Glow Effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-40 bg-chill-rose/20 blur-[60px] rounded-full pointer-events-none"></div>

        <div className="flex justify-center mb-6 relative z-10">
          <div className="bg-chill-bg border border-white/5 p-4 rounded-full shadow-inner">
            <XCircle className="text-chill-rose" size={48} />
          </div>
        </div>

        <h2 className="text-2xl font-black text-white mb-3 relative z-10">Authentication Failed</h2>
        <p className="text-gray-400 mb-8 leading-relaxed relative z-10">{message}</p>
        
        <button
          onClick={onClose}
          className="bg-chill-rose text-white font-bold px-6 py-3.5 rounded-xl hover:bg-red-500 transition-all shadow-lg shadow-chill-rose/20 w-full relative z-10 active:scale-95"
        >
          Try Again
        </button>
      </div>
    </div>
  );
};

export default AuthFailure;