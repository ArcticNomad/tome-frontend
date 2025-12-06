import React from 'react';
import { Settings } from 'lucide-react';

const ReaderSettings = ({ 
  fontSize, setFontSize, 
  lineHeight, setLineHeight, 
  wordsPerPage, setWordsPerPage 
}) => {
  
  const fontSizeOptions = [
    { label: 'S', value: 'text-sm' },
    { label: 'M', value: 'text-base' },
    { label: 'L', value: 'text-lg' },
    { label: 'XL', value: 'text-xl' },
    { label: 'XXL', value: 'text-2xl' }
  ];

  const lineHeightOptions = [
    { label: 'Compact', value: 'leading-normal' },
    { label: 'Comfortable', value: 'leading-relaxed' },
    { label: 'Spacious', value: 'leading-loose' }
  ];

  const wordsPerPageOptions = [200, 250, 300, 350, 400];

  return (
    <div className="bg-chill-card rounded-2xl p-6 mb-8 border border-white/5 shadow-lg">
      <h3 className="text-lg font-bold mb-4 flex items-center gap-3 text-white border-b border-white/10 pb-3">
        <Settings size={20} className="text-chill-sage" />
        Reading Settings
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Font Size */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-3">Font Size</label>
          <div className="flex gap-2 flex-wrap">
            {fontSizeOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setFontSize(option.value)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors border border-white/10 ${
                  fontSize === option.value
                    ? 'bg-chill-sage text-black border-chill-sage hover:bg-white'
                    : 'bg-chill-bg text-gray-300 hover:bg-white/10'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
        
        {/* Line Height */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-3">Line Spacing</label>
          <div className="flex gap-2 flex-wrap">
            {lineHeightOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setLineHeight(option.value)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors border border-white/10 ${
                  lineHeight === option.value
                    ? 'bg-chill-sage text-black border-chill-sage hover:bg-white'
                    : 'bg-chill-bg text-gray-300 hover:bg-white/10'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
        
        {/* Words per Page */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-3">Words per Page (WPP)</label>
          <div className="flex gap-2 flex-wrap">
            {wordsPerPageOptions.map((option) => (
              <button
                key={option}
                onClick={() => setWordsPerPage(option)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors border border-white/10 ${
                  wordsPerPage === option
                    ? 'bg-chill-sage text-black border-chill-sage hover:bg-white'
                    : 'bg-chill-bg text-gray-300 hover:bg-white/10'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReaderSettings;