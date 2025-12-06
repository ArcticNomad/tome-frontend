import React from 'react';
import { BookOpen, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const CurrentlyReadingList = ({ currentlyReading }) => {
  if (!currentlyReading || currentlyReading.length === 0) return null;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white flex items-center gap-3">
        <BookOpen size={24} className="text-chill-blue" />
        Currently Reading
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentlyReading.slice(0, 3).map((item) => (
          <div key={item._id} className="bg-chill-card rounded-[24px] p-6 border border-white/5 hover:border-white/10 transition-colors group">
            {item.bookId && (
              <>
                <div className="flex items-start gap-5">
                  <div className="w-20 h-28 bg-chill-bg rounded-xl shadow-lg flex-shrink-0 overflow-hidden border border-white/5 group-hover:scale-105 transition-transform duration-500">
                    {item.bookId.coverImageUrl && (
                      <img src={item.bookId.coverImageUrl} alt="Cover" className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-lg text-white truncate">{item.bookId.title}</h3>
                    <p className="text-gray-400 text-sm mb-4">{item.bookId.author}</p>
                    <div>
                      <div className="flex justify-between text-xs text-gray-500 mb-1.5">
                        <span>Progress</span>
                        <span>0%</span>
                      </div>
                      <div className="h-1.5 bg-chill-bg rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-chill-sage rounded-full"
                          style={{ width: '0%' }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
                <Link 
                  to={`/read/${item.bookId.gutenbergId || item.bookId._id}`}
                  className="w-full mt-6 py-3 bg-white/5 text-white rounded-xl font-bold hover:bg-chill-sage hover:text-black transition-all flex items-center justify-center gap-2 group/btn"
                >
                  Continue Reading <ChevronRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CurrentlyReadingList;