import React from 'react';

const BookInfoDetails = ({ book }) => {
  return (
    <div className="bg-chill-card rounded-2xl p-6 border border-white/5 shadow-xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Left Column: Metadata */}
        <div>
          <h3 className="text-lg font-bold mb-4 text-white border-b border-white/5 pb-2">
            Book Details
          </h3>
          <div className="space-y-3">
            <InfoRow label="Title" value={book?.title} />
            <InfoRow label="Author" value={book?.author} />
            <InfoRow label="Gutenberg ID" value={book?.gutenbergId} />
            <InfoRow label="Downloads" value={book?.downloadCount?.toLocaleString()} />
            <InfoRow label="Rating" value={
              book?.averageRating 
                ? `${Number(book.averageRating).toFixed(1)} / 5.0 (${book.reviewCount} reviews)` 
                : 'N/A'
            } />
          </div>
        </div>
        
        {/* Right Column: Content */}
        <div>
          <h3 className="text-lg font-bold mb-4 text-white border-b border-white/5 pb-2">
            Subjects & Summary
          </h3>
          <div className="space-y-5">
            {book?.subjects && book.subjects.length > 0 && (
              <div>
                <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
                  Subjects
                </div>
                <div className="flex flex-wrap gap-2">
                  {book.subjects.slice(0, 8).map((subject, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 bg-chill-bg border border-white/5 text-chill-sage text-xs font-medium rounded-lg hover:border-chill-sage/30 transition-colors cursor-default"
                    >
                      {subject}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            <div>
              <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                Summary
              </div>
              <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">
                {book?.summary || book?.generated_blurb || 'No summary available for this title.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const InfoRow = ({ label, value }) => (
  <div className="flex items-start">
    <div className="w-32 shrink-0 text-sm font-medium text-gray-500">{label}</div>
    <div className="flex-1 text-sm font-medium text-gray-200">{value || 'N/A'}</div>
  </div>
);

export default BookInfoDetails;