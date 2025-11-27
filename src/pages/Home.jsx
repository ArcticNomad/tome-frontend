import React from 'react';
import HeroSlideshow from '../components/HomePage/HeroSlideshow';
import UserAndTags from '../components/HomePage/UserAndTags';
import BookSection from '../components/HomePage/BookSection';
import BentoGrid from '../components/HomePage/BentoGrid';
import { standardBooks } from '../data';
import { forYouBooks, genreCollections } from '../data';
import HorizontalCarousel from '../components/HomePage/HorizontalCarousel';
import { useState } from 'react';
import { bestFiction, bestHistory } from '../data';
import Footer from '../components/HomePage/Footer';

function Home() {
  const [activeGenre, setActiveGenre] = useState('Fiction');
  const genres = Object.keys(genreCollections);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 font-sans">
      {/* Main container with subtle shadow and better spacing */}
      <div className="w-full bg-white/80 backdrop-blur-sm shadow-soft rounded-none lg:rounded-3xl overflow-hidden">
        
        {/* Enhanced Hero Section with gradient overlay */}
        <div className="relative">
          <HeroSlideshow />
          <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent pointer-events-none" />
        </div>

        {/* User section with card styling */}
        <div className="px-6 md:px-12 lg:px-16">
          <div className="bg-white rounded-2xl shadow-soft p-6 -mt-2 relative z-10 border border-gray-100">
            <UserAndTags />
          </div>
        </div>

        {/* Main content with better spacing */}
        <div className="px-6 md:px-12 lg:px-16 py-8 space-y-12">
          
          {/* Carousel 1: Personalized with enhanced header */}
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Picked For You
              </h2>
              <span className="text-sm text-gray-500 font-medium">Personalized selections</span>
            </div>
            <HorizontalCarousel 
              
              books={forYouBooks} 
            />
          </section>
          
          {/* Bento Grid with subtle background */}
          <section className="relative">
            <div className="absolute inset-0 rounded-3xl -m-4" />
            <div className="relative z-10">
              <BentoGrid />
            </div>
          </section>

          {/* Best Fiction with decorative element */}
          <section className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-2 h-8 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full"></div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Best in Fiction
              </h2>
            </div>
            <BookSection 
              title="Best in Fiction" 
              books={bestFiction} 
            />
          </section>

          {/* Interactive Genres with pill navigation */}
          <section className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Browse by Genre
              </h2>
              <p className="text-gray-600">Discover books by your favorite categories</p>
            </div>
            <HorizontalCarousel 
              title="Browse by Genre" 
              books={genreCollections[activeGenre]} 
              categories={genres}
              activeCategory={activeGenre}
              onCategoryChange={setActiveGenre}
            />
          </section>

          {/* History & Culture with accent background */}
          <section className="space-y-6">
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-100">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-6 h-6 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm font-bold">H</span>
                </div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-amber-900 to-orange-700 bg-clip-text text-transparent">
                  History & Culture Top Picks
                </h2>
              </div>
              <p className="text-amber-800/70 text-sm max-w-2xl">
                Journey through time with our curated selection of historical masterpieces
              </p>
            </div>
            <HorizontalCarousel 
              title="History & Culture Top Picks" 
              books={bestHistory} 
            />
          </section>
          
          {/* Recently Reviewed with subtle card styling */}
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
              <BookSection title="Recently Reviewed" books={standardBooks.slice(0, 4)} />
            </div>
          </section>

        </div>

        {/* Enhanced Footer */}
        <Footer />
        
      </div>
    </div>
  );
}

export default Home;