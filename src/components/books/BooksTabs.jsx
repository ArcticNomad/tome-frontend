import React from 'react';

const BooksTabs = ({ activeTab, setActiveTab }) => {
  return (
    <div className="px-6 md:px-12 lg:px-16 pt-8">
      <div className="flex border-b border-white/10">
        <button
          onClick={() => setActiveTab('free')}
          className={`px-6 py-3 font-medium text-sm transition-all relative ${
            activeTab === 'free'
              ? 'text-chill-sage border-b-2 border-chill-sage'
              : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          Free Books
          {activeTab === 'free' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-chill-sage" />
          )}
        </button>
        
        <button
          onClick={() => setActiveTab('paid')}
          className={`px-6 py-3 font-medium text-sm transition-all relative ${
            activeTab === 'paid'
              ? 'text-chill-rose border-b-2 border-chill-rose'
              : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          Paid Books
          {activeTab === 'paid' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-chill-rose" />
          )}
        </button>
      </div>
    </div>
  );
};

export default BooksTabs;