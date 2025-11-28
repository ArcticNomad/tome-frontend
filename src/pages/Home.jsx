// src/app/Home.jsx
import React, { useState } from 'react';
import HeroSlideshow from '../components/HomePage/HeroSlideshow';
import UserAndTags from '../components/HomePage/UserAndTags';
import BookSection from '../components/HomePage/BookSection';
import BentoGrid from '../components/HomePage/BentoGrid';
import { standardBooks, genreCollections, bestHistory } from '../data'; 
import HorizontalCarousel from '../components/HomePage/HorizontalCarousel';
import Footer from '../components/HomePage/Footer';
import useBookData from '../hooks/useBookData';

function Home() {
  const [activeGenre, setActiveGenre] = useState('Fiction');
  const genres = Object.keys(genreCollections);

  // Use the hook to get live data
  const { books: liveBooks, isLoading, error } = useBookData();

  // Determine which data to use
  const mainBookList = liveBooks.length > 0 ? liveBooks : standardBooks;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 font-sans">
      <div className="w-full bg-white/80 backdrop-blur-sm shadow-soft rounded-none lg:rounded-3xl overflow-hidden">
        
        {/* Hero Section */}
        <div className="relative">
          <HeroSlideshow />
          <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent pointer-events-none" />
        </div>

        {/* User Section */}
        <div className="px-6 md:px-12 lg:px-16">
          <div className="bg-white rounded-2xl shadow-soft p-6 -mt-2 relative z-10 border border-gray-100">
            <UserAndTags />
          </div>
        </div>

        {/* API Status Indicator */}
        {error && (
          <div className="px-6 md:px-12 lg:px-16 mt-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-yellow-800 text-sm">
                <strong>Note:</strong> Using sample data. {error.message}
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
                  {liveBooks.length > 0 ? 'Live Book Collection' : 'Sample Collection'}
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
              title={liveBooks.length > 0 ? "Live from Database" : "Sample Books"}
            />
          </section>
          
          {/* Bento Grid */}
          <section className="relative">
            <div className="absolute inset-0 rounded-3xl -m-4" />
            <div className="relative z-10">
              <BentoGrid />
            </div>
          </section>

          {/* All Books Collection */}
          <section className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-2 h-8 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full"></div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                All Books Collection
              </h2>
            </div>
            
            <BookSection 
              title="Browse All Books" 
              books={mainBookList} 
              isLoading={isLoading}
              showViewAll={mainBookList.length > 8}
            />
          </section>

          {/* Genre Navigation */}
          <section className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Browse by Genre
              </h2>
              <p className="text-gray-600">Discover books by your favorite categories</p>
            </div>
            
            {/* Genre Tabs */}
            <div className="flex flex-wrap gap-2 justify-center">
              {genres.map(genre => (
                <button
                  key={genre}
                  onClick={() => setActiveGenre(genre)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    activeGenre === genre 
                      ? 'bg-blue-500 text-white shadow-md' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {genre}
                </button>
              ))}
            </div>
            
            <HorizontalCarousel 
              title={activeGenre} 
              books={genreCollections[activeGenre]} 
            />
          </section>

          {/* History & Culture */}
          <section className="space-y-6">
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-100">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-6 h-6 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm font-bold">H</span>
                </div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-amber-900 to-orange-700 bg-clip-text text-transparent">
                  History & Culture
                </h2>
              </div>
              <p className="text-amber-800/70 text-sm max-w-2xl">
                Journey through time with our curated selection of historical masterpieces
              </p>
            </div>
            
            <HorizontalCarousel 
              title="Historical Favorites" 
              books={bestHistory} 
            />
          </section>
          
          {/* Recently Reviewed */}
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Recently Reviewed
              </h2>
              <button className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors">
                View all reviews →
              </button>
            </div>
            
            <div className="bg-gray-50/50 rounded-2xl p-6 border border-gray-100">
              <BookSection 
                title="Community Favorites" 
                books={standardBooks.slice(0, 4)} 
                compact={true}
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

export default Home;