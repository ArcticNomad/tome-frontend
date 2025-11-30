// src/pages/Books.jsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import HeroSlideshow from '../components/HomePage/HeroSlideshow';
import BookSection from '../components/HomePage/BookSection';
import BentoGrid from '../components/HomePage/BentoGrid';
import { standardBooks, genreCollections } from '../data'; 
import HorizontalCarousel from '../components/HomePage/HorizontalCarousel';
import Footer from '../components/HomePage/Footer';
import { useHomepageData } from '../hooks/useHomepageData';
import { useAuth } from '../hooks/useAuth';
import { Star, BookOpen, ChevronRight } from 'lucide-react';
import UserInfo from '../components/HomePage/UserInfo';

function Books() {
  const { currentUser } = useAuth();
  const [activeGenre, setActiveGenre] = useState('Fiction');
  const genres = Object.keys(genreCollections);

  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const category = params.get('category');
    if (category && genres.includes(category)) {
      setActiveGenre(category);
    }
  }, [location.search, genres]);

  // Get all homepage data in one hook
  const {
    allBooks,
    recentlyAdded,
    popularBooks,
    fantasyBooks,
    featuredBooks,
    highlyReviewed,
    stats,
    isLoading,
    error,
    backendStatus
  } = useHomepageData();

  // Determine which data to display
  const mainBookList = allBooks.length > 0 ? allBooks : standardBooks;
  const limitedBooks = allBooks.slice(0, 18);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 font-sans">
      <div className="w-full bg-white/80 backdrop-blur-sm shadow-soft rounded-none lg:rounded-3xl overflow-hidden">
        
        {/* Hero Section */}
        <div className="relative">
          <HeroSlideshow />
          <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent pointer-events-none" />
        </div>

        {/* User Section */}
        {currentUser && (
          <div className="px-6 md:px-12 lg:px-16">
            <div className="bg-white rounded-2xl shadow-soft p-6 -mt-2 relative z-10 border border-gray-100">
              <UserInfo />
            </div>
          </div>
        )}

        {/* API Status Indicator */}
        {error && (
          <div className="px-6 md:px-12 lg:px-16 mt-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-yellow-800 text-sm">
                <strong>Note:</strong> {backendStatus === 'disconnected' 
                  ? 'Using sample data. Backend server is not available.' 
                  : 'Some data may be from sample collection.'}
              </p>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="px-6 md:px-12 lg:px-16 py-8 space-y-12">
          
          {/* Live Books Section */}
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  {backendStatus === 'connected' ? 'Live Book Collection' : 'Book Collection'}
                </h2>
                {isLoading && (
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                )}
              </div>
              <span className="text-sm text-gray-500 font-medium">
                {isLoading ? 'Loading...' : `${mainBookList.length} titles`}
              </span>
            </div>
            
            <HorizontalCarousel 
              books={mainBookList} 
              isLoading={isLoading}
              title={backendStatus === 'connected' ? "Live from Database" : "Sample Books"}
            />
          </section>
          
          {/* Bento Grid */}
          <section className="relative">
            <div className="absolute inset-0 rounded-3xl -m-4" />
            <div className="relative z-10">
              <BentoGrid featuredBooks={featuredBooks} isLoading={isLoading} />
            </div>
          </section>

          {/* Recently Added Section */}
          <section className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-2 h-8 bg-gradient-to-b from-green-500 to-emerald-600 rounded-full"></div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Recently Added
              </h2>
            </div>
            
            <HorizontalCarousel 
              title="New Arrivals" 
              books={recentlyAdded} 
              isLoading={isLoading}
            />
          </section>

          {/* All Books Collection */}
          <section className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-2 h-8 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full"></div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Browse All Books
              </h2>
            </div>
            
            <BookSection 
              title="all" 
              books={limitedBooks} 
              isLoading={isLoading}
              showViewAll={mainBookList.length > 18}
            />
          </section>

          {/* Best of Genre Section - FIXED: Stays on current page */}
          <section className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Best of Genre
              </h2>
              <p className="text-gray-600">Discover top-rated books across different categories</p>
            </div>
            
            {/* Genre Tabs - FIXED: No navigation, just changes local state */}
            <div className="flex flex-wrap gap-2 justify-center">
              {genres.map(genre => (
                <button
                  key={genre}
                  onClick={() => setActiveGenre(genre)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    activeGenre === genre 
                      ? 'bg-purple-600 text-white shadow-md' 
                      : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {genre}
                </button>
              ))}
            </div>
            
            {/* View All link for the active genre */}
            <div className="flex justify-center">
              <Link
                to={`/booklists?category=${encodeURIComponent(activeGenre)}`}
                className="text-sm text-purple-600 hover:text-purple-800 font-medium flex items-center gap-1 transition-colors"
              >
                View all {activeGenre} books <ChevronRight size={16} />
              </Link>
            </div>
            
            <HorizontalCarousel 
              title={`Best of ${activeGenre}`} 
              books={genreCollections[activeGenre]} 
            />
          </section>

          {/* Fantasy Section */}
          <section className="space-y-6">
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-6 border border-purple-100">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center">
                    <span className="text-white text-sm font-bold">F</span>
                  </div>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-900 to-indigo-700 bg-clip-text text-transparent">
                    Fantasy & Magic
                  </h2>
                </div>
                <Link 
                  to="/booklists?category=Fantasy" 
                  className="text-sm font-medium text-purple-600 hover:text-purple-800 flex items-center gap-1 transition-colors"
                >
                  View all <ChevronRight size={16} />
                </Link>
              </div>
              <p className="text-purple-800/70 text-sm max-w-2xl">
                Escape to magical worlds with our curated selection of fantasy adventures and mythical tales
              </p>
            </div>
            
            <HorizontalCarousel 
              title="Fantasy Adventures" 
              books={fantasyBooks} 
              isLoading={isLoading}
            />
          </section>

          {/* History & Culture */}
          <section className="space-y-6">
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-100">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg flex items-center justify-center">
                    <span className="text-white text-sm font-bold">H</span>
                  </div>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-amber-900 to-orange-700 bg-clip-text text-transparent">
                    History & Culture
                  </h2>
                </div>
                <Link 
                  to="/booklists?category=History" 
                  className="text-sm font-medium text-amber-600 hover:text-amber-800 flex items-center gap-1 transition-colors"
                >
                  View all <ChevronRight size={16} />
                </Link>
              </div>
              <p className="text-amber-800/70 text-sm max-w-2xl">
                Journey through time with our curated selection of historical masterpieces
              </p>
            </div>
            
            <HorizontalCarousel 
              title="Historical Masterpieces" 
              books={popularBooks} 
              isLoading={isLoading}
            />
          </section>

          {/* Your Reviews Section */}
          {currentUser && (
            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-2 h-8 bg-gradient-to-b from-pink-500 to-rose-600 rounded-full"></div>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                    Your Reviews
                  </h2>
                </div>
                <button className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors">
                  Write a review →
                </button>
              </div>
              
              <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-2xl p-8 border border-pink-100 text-center">
                <div className="flex flex-col items-center justify-center space-y-4">
                  <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center">
                    <Star className="w-8 h-8 text-pink-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800">No Reviews Yet</h3>
                  <p className="text-gray-600 max-w-md">
                    You haven't reviewed any books yet. Start exploring our collection and share your thoughts with the community!
                  </p>
                  <button className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-full font-medium transition-colors flex items-center gap-2">
                    <BookOpen size={18} />
                    Start Reading
                  </button>
                </div>
              </div>
            </section>
          )}
          
          {/* Recently Reviewed Section */}
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-2 h-8 bg-gradient-to-b from-purple-500 to-pink-600 rounded-full"></div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Community Reviews
                </h2>
              </div>
              <button className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors">
                View all reviews →
              </button>
            </div>
            
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100">
              <BookSection 
                title="Recently Reviewed" 
                books={highlyReviewed} 
                isLoading={isLoading}
                compact={true}
                showViewAll={false}
              />
            </div>
          </section>

        </div>

        {/* Footer */}
        <Footer />
        
      </div>
    </div>
  );
}

export default Books;