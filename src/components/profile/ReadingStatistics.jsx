import React from 'react';
import { TrendingUp } from 'lucide-react';

const ReadingStatistics = ({ userStats }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Reading Statistics</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Reading Time Chart */}
        <div className="lg:col-span-2 bg-chill-card rounded-[32px] p-8 border border-white/5">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-white">Weekly Activity</h3>
            <select className="bg-chill-bg border border-white/10 text-gray-400 text-sm rounded-lg px-3 py-1 outline-none">
              <option>This Week</option>
              <option>Last Week</option>
            </select>
          </div>
          {/* Placeholder for Chart */}
          <div className="h-48 flex flex-col items-center justify-center text-gray-600 bg-chill-bg/50 rounded-2xl border border-white/5 border-dashed">
            <TrendingUp size={32} className="mb-2 opacity-50" />
            <span className="text-sm">Activity chart visualization</span>
          </div>
        </div>
        
        {/* Quick Stats */}
        <div className="bg-chill-surface rounded-[32px] p-8 border border-white/5 flex flex-col justify-center">
          <h3 className="text-lg font-bold text-white mb-6">Efficiency</h3>
          <div className="space-y-6">
            {userStats?.calculated && (
              <>
                <div className="flex items-center justify-between p-4 bg-chill-bg rounded-2xl border border-white/5">
                  <span className="text-sm text-gray-400">Books / Month</span>
                  <span className="text-xl font-black text-chill-sage">{userStats.calculated.booksPerMonth}</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-chill-bg rounded-2xl border border-white/5">
                  <span className="text-sm text-gray-400">Pages / Hour</span>
                  <span className="text-xl font-black text-chill-blue">
                    {userStats.calculated.readingEfficiency}
                  </span>
                </div>
                <div className="flex items-center justify-between p-4 bg-chill-bg rounded-2xl border border-white/5">
                  <span className="text-sm text-gray-400">Completion</span>
                  <span className="text-xl font-black text-purple-400">
                    {userStats.calculated.completionRate}%
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReadingStatistics;