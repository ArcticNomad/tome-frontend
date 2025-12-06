import React from 'react';

const PaidBooksPlaceholder = () => {
  return (
    <div className="px-6 md:px-12 lg:px-16 mt-6">
      <div className="bg-chill-highlight border border-chill-rose/20 rounded-2xl p-6">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-chill-rose/10 rounded-lg flex items-center justify-center">
            <span className="text-chill-rose font-bold">$</span>
          </div>
          <div>
            <h3 className="font-semibold text-chill-rose">Paid Books Coming Soon!</h3>
            <p className="text-gray-400 text-sm mt-1">
              We're working on integrating premium books from major publishers.
              For now, enjoy our collection of free public domain books.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaidBooksPlaceholder;