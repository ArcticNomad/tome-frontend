import React from 'react';
import { BookOpen, Bookmark, CheckCircle, Download } from 'lucide-react';

const QuickActions = ({ onAction, onDownload }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <ActionButton 
        icon={<BookOpen size={24} />}
        title="Start Reading"
        subtitle="Current Read"
        // Sage Green for the primary action
        iconColor="text-chill-sage"
        hoverBorder="group-hover:border-chill-sage/50"
        onClick={() => onAction('currentlyReading')}
      />
      
      <ActionButton 
        icon={<Bookmark size={24} />}
        title="Want to Read"
        subtitle="Save for later"
        // Muted Blue/Purple for secondary
        iconColor="text-indigo-400"
        hoverBorder="group-hover:border-indigo-400/50"
        onClick={() => onAction('wantToRead')}
      />
      
      <ActionButton 
        icon={<CheckCircle size={24} />}
        title="Mark Finished"
        subtitle="Complete"
        // Muted Teal/Green for success
        iconColor="text-teal-400"
        hoverBorder="group-hover:border-teal-400/50"
        onClick={() => onAction('read')}
      />
      
      <ActionButton 
        icon={<Download size={24} />}
        title="Download"
        subtitle="Get Text File"
        // Warm Sand/Orange for utility
        iconColor="text-orange-300"
        hoverBorder="group-hover:border-orange-300/50"
        onClick={onDownload}
      />
    </div>
  );
};

const ActionButton = ({ icon, title, subtitle, iconColor, hoverBorder, onClick }) => (
  <button
    onClick={onClick}
    className={`
      group flex flex-col items-center justify-center p-4 h-full
      bg-chill-card border border-white/5 rounded-2xl
      transition-all duration-300 hover:bg-white/5 hover:-translate-y-1
      ${hoverBorder}
      md:flex-row md:justify-start md:gap-4 md:text-left
    `}
  >
    <div className={`p-3 rounded-full bg-chill-bg border border-white/5 ${iconColor} group-hover:scale-110 transition-transform duration-300`}>
      {icon}
    </div>
    <div>
      <div className="font-bold text-white text-sm md:text-base group-hover:text-white transition-colors">
        {title}
      </div>
      <div className="text-xs text-gray-500 font-medium mt-0.5 group-hover:text-gray-400">
        {subtitle}
      </div>
    </div>
  </button>
);

export default QuickActions;