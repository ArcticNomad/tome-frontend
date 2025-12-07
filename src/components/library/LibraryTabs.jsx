import React from 'react';

const LibraryTabs = ({ tabs, activeTab, handleTabChange }) => {
  return (
    <div className="mb-8">
      <div className="flex flex-wrap gap-2">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`px-5 py-3 rounded-2xl text-sm font-medium transition-all flex items-center gap-2 ${
                activeTab === tab.id
                  ? `${tab.color.replace('text-', 'bg-')} text-black shadow-lg`
                  : 'bg-chill-card border border-white/5 text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon size={16} />
              {tab.label}
              <span className={`px-2 py-0.5 text-xs rounded-full ${
                activeTab === tab.id
                  ? 'bg-black/20 text-black'
                  : 'bg-white/10 text-gray-400'
              }`}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default LibraryTabs;