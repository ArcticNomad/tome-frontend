import React from 'react';
import { Play, Pause, Save, Loader2 } from 'lucide-react';

const ReaderControls = ({ 
  currentPage, 
  totalPages, 
  progress, 
  readingTime, 
  isReading, 
  isSaving, 
  onToggleReading, 
  onSaveProgress 
}) => {
  return (
    <div className="bg-chill-card rounded-xl p-6 mb-6 border border-white/5 shadow-lg">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        
        {/* Stats Section */}
        <div className="flex items-center gap-6">
          <StatItem label="Page" value={`${currentPage} / ${totalPages}`} />
          <StatItem label="Progress" value={`${progress}%`} />
          <StatItem label="Time Left" value={`${readingTime}m`} />
          <StatItem label="Status" value={isReading ? 'Reading' : 'Paused'} />
        </div>
        
        {/* Actions Section */}
        <div className="flex items-center gap-3">
          {/* Play/Pause Button */}
          <button
            onClick={onToggleReading}
            className={`px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition-colors border border-transparent hover:scale-[1.01] ${
              isReading
                // Red/Rose for Pausing (Alert/Stop action)
                ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20'
                // Sage Green for Starting (Primary action)
                : 'bg-chill-sage text-black hover:bg-white'
            }`}
          >
            {isReading ? (
              <>
                <Pause size={16} /> Pause
              </>
            ) : (
              <>
                <Play size={16} /> Start
              </>
            )}
          </button>
          
          {/* Save Button */}
          <button
            onClick={onSaveProgress}
            disabled={isSaving}
            className="px-4 py-2 bg-chill-sage/10 text-chill-sage border border-chill-sage/30 rounded-xl font-bold hover:bg-chill-sage/20 disabled:opacity-50 flex items-center gap-2 transition-colors"
          >
            {isSaving ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Saving...
              </>
            ) : (
              <>
                <Save size={16} /> Save Progress
              </>
            )}
          </button>
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="relative h-2 bg-white/10 rounded-full overflow-hidden">
        <div 
          className="absolute top-0 left-0 h-full bg-chill-sage transition-all duration-300 rounded-full"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

const StatItem = ({ label, value }) => (
  <div>
    <div className="text-xs text-gray-500 uppercase tracking-wider">{label}</div>
    <div className="font-bold text-white text-lg">{value}</div>
  </div>
);

export default ReaderControls;