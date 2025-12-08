import React from 'react';

const BooksTabs = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'free', label: 'Free Books', color: 'chill-sage' },
    { id: 'paid', label: 'Paid Books', color: 'chill-rose' }
  ];

  return (
    <div className="px-4 sm:px-6 md:px-8 lg:px-16 pt-6 md:pt-8">
      <div className="relative">
        {/* Background container with glass effect */}
        <div className="absolute inset-0 bg-white/3 backdrop-blur-sm rounded-2xl -z-10" />
        
        {/* Subtle gradient border */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-chill-sage/10 via-transparent to-chill-rose/10 p-px -z-10">
          <div className="rounded-2xl bg-chill-surface/95 backdrop-blur-md w-full h-full" />
        </div>
        
        {/* Floating indicator background (moves with active tab) */}
        <div 
          className="absolute top-1.5 bottom-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 transition-all duration-500 ease-out"
          style={{
            width: `calc(50% - 0.5rem)`,
            left: activeTab === 'free' ? '0.5rem' : 'calc(50% + 0.5rem)',
          }}
        />
        
        {/* Tabs container */}
        <div className="relative flex p-1.5">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const colorClass = isActive ? `text-${tab.color}` : 'text-gray-500';
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex-1 flex items-center justify-center gap-2 px-2 sm:px-4 md:px-6 py-3 sm:py-4 
                           rounded-xl font-semibold text-sm sm:text-base transition-all duration-300
                           ${isActive ? 'text-white' : 'hover:text-gray-300 hover:bg-white/5'}`}
              >
                {/* Icon for each tab */}
                <div className={`transition-all duration-300 ${isActive ? 'scale-110' : 'scale-100'}`}>
                  {tab.id === 'free' ? (
                    <svg className={`w-4 h-4 sm:w-5 sm:h-5 ${isActive ? 'text-chill-sage' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  ) : (
                    <svg className={`w-4 h-4 sm:w-5 sm:h-5 ${isActive ? 'text-chill-rose' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                </div>
                
                <span className={`relative z-10 transition-all duration-300 ${isActive ? 'font-bold' : 'font-medium'}`}>
                  {tab.label}
                </span>
                
                {/* Active tab indicator glow */}
                {isActive && (
                  <>
                    <div className={`absolute inset-0 rounded-xl bg-gradient-to-r from-${tab.color}/20 to-transparent opacity-60`} />
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-1 rounded-full bg-gradient-to-r from-white to-transparent blur-sm" />
                  </>
                )}
                
                {/* Count badge */}
                <div className={`absolute -top-1 -right-1 sm:top-1 sm:right-2 w-4 h-4 sm:w-5 sm:h-5 
                                flex items-center justify-center text-[10px] sm:text-xs font-bold rounded-full
                                ${isActive ? 'bg-white text-gray-900' : 'bg-white/10 text-gray-400'}`}>
                  {tab.id === 'free' ? '∞' : '$'}
                </div>
              </button>
            );
          })}
        </div>
        
        {/* Decorative corner accents */}
        <div className="absolute -top-1 -left-1 w-6 h-6 border-l-2 border-t-2 border-chill-sage/30 rounded-tl-2xl" />
        <div className="absolute -top-1 -right-1 w-6 h-6 border-r-2 border-t-2 border-chill-rose/30 rounded-tr-2xl" />
        <div className="absolute -bottom-1 -left-1 w-6 h-6 border-l-2 border-b-2 border-chill-sage/30 rounded-bl-2xl" />
        <div className="absolute -bottom-1 -right-1 w-6 h-6 border-r-2 border-b-2 border-chill-rose/30 rounded-br-2xl" />
      </div>
      
      {/* Subtle animation on tab change */}
      <div className="mt-4 md:mt-6 flex justify-center">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <div className="w-1.5 h-1.5 rounded-full bg-chill-sage animate-pulse" />
          <span className="font-medium">
            {activeTab === 'free' 
              ? 'Enjoy thousands of free books' 
              : 'Discover premium paid content'}
          </span>
          <div className="w-1.5 h-1.5 rounded-full bg-chill-rose animate-pulse delay-300" />
        </div>
      </div>
    </div>
  );
};

export default BooksTabs;