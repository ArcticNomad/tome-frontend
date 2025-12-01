// src/pages/Bookshelf.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useUserProfile } from '../hooks/useUserProfile';
import { BookOpen, Clock, Star, ChevronLeft } from 'lucide-react';

const BookshelfPage = () => {
  const { shelfType } = useParams();
  const { getBookshelf } = useUserProfile();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookshelf = async () => {
      try {
        const response = await getBookshelf(shelfType);
        if (response.success) {
          setBooks(response.data);
        }
      } catch (error) {
        console.error('Error fetching bookshelf:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookshelf();
  }, [shelfType]);

  const getShelfTitle = (type) => {
    const titles = {
      'currentlyReading': 'Currently Reading',
      'wantToRead': 'Want to Read',
      'read': 'Finished Books'
    };
    return titles[type] || type;
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => window.history.back()} className="p-2 hover:bg-gray-100 rounded-lg">
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-3xl font-bold">{getShelfTitle(shelfType)}</h1>
          <span className="text-gray-500">({books.length} books)</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {books.map((item) => (
            <div key={item._id} className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition">
              {item.bookId && (
                <div className="space-y-3">
                  <div className="aspect-[2/3] w-full bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg"></div>
                  <h3 className="font-bold text-lg truncate">{item.bookId.title}</h3>
                  <p className="text-gray-600 text-sm">{item.bookId.author}</p>
                  
                  {shelfType === 'read' && item.rating && (
                    <div className="flex items-center gap-1">
                      <Star size={16} className="fill-amber-400 text-amber-400" />
                      <span className="text-sm font-medium">{item.rating}/5</span>
                    </div>
                  )}
                  
                  {shelfType === 'currentlyReading' && (
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Clock size={16} />
                      <span>Started {new Date(item.startedAt).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {books.length === 0 && (
          <div className="text-center py-12">
            <BookOpen size={64} className="text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-600">No books yet</h3>
            <p className="text-gray-500 mt-2">
              Add books to your {getShelfTitle(shelfType).toLowerCase()} shelf
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookshelfPage;