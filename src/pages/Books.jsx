import React, { useState } from 'react';
import HeroSlideshow from '../components/HomePage/HeroSlideshow';
import BookSection from '../components/HomePage/BookSection';
import BentoGrid from '../components/HomePage/BentoGrid';
import HorizontalCarousel from '../components/HomePage/HorizontalCarousel';
import Footer from '../components/HomePage/Footer';
import UserInfo from '../components/HomePage/UserInfo';
import LoadingSpinner from '../components/LoadingSpinner';

import { useHomepageData } from '../hooks/useHomepageData';
import { useAuth } from '../hooks/useAuth';

// Import new modular components
import BooksTabs from '../components/books/BooksTabs';
import PaidBooksPlaceholder from '../components/books/PaidBooksPlaceholder';
import ForYouSection from '../components/books/ForYouSection';
import BecauseYouLikedSection from '../components/books/BecauseYouLikedSection';
import GenreExplorer from '../components/books/GenreExplorer';
import CategoryHighlight from '../components/books/CategoryHighlight';
import CommunityReviews from '../components/books/CommunityReviews';
import UserReviewsPrompt from '../components/books/UserReviewsPrompt';

function Books() {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('free');

  // Get all homepage data in one hook
  const {
    allBooks,
    recentlyAdded,
    popularBooks,
    fantasyBooks,
    featuredBooks,
    highlyReviewed,
    isLoading,
    error,
    backendStatus
  } = useHomepageData();

  // Determine which data to display
  const mainBookList = allBooks.length > 0 ? allBooks : [];
  const limitedBooks = allBooks.length > 0 ? allBooks.slice(0, 18) : [];

  // Show loading only if ALL data is loading and we have no books
  if (isLoading && allBooks.length === 0 && recentlyAdded.length === 0) {
    return (
      <div className="min-h-screen bg-chill-bg flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-chill-bg font-sans text-gray-200 selection:bg-chill-sage selection:text-black">
      <div className="w-full bg-chill-bg overflow-hidden">
        
        {/* Hero Section */}
        <div className="relative border-b border-white/5">
          <HeroSlideshow /> 
        </div>

        {/* Tabs */}
        <BooksTabs activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* User Section */}
        {currentUser && (
          <div className="px-6 md:px-12 lg:px-16">
            <div className="bg-chill-card rounded-2xl shadow-lg p-6 mt-6 border border-white/5">
              <UserInfo />
            </div>
          </div>
        )}

        {/* Tab-specific message */}
        {activeTab === 'paid' && <PaidBooksPlaceholder />}

        {/* API Status Indicator */}
        {error && (
          <div className="px-6 md:px-12 lg:px-16 mt-4">
            <div className="bg-chill-highlight border border-yellow-900/30 rounded-lg p-4">
              <p className="text-yellow-500/80 text-sm">
                <strong>Note:</strong> {backendStatus === 'disconnected' 
                  ? 'Using sample data. Backend server is not available.' 
                  : 'Some data may be from sample collection.'}
              </p>
            </div>
          </div>
        )}

        {/* Main Content - Show only for Free tab for now */}
        {activeTab === 'free' && (
          <div className="px-6 md:px-12 lg:px-16 py-8 space-y-12">
            
            <ForYouSection currentUser={currentUser} popularBooks={popularBooks} />

            <BecauseYouLikedSection currentUser={currentUser} />

            {/* Live Books Section (shown when no user or as fallback) */}
            {!currentUser && (
              <section className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <h2 className="text-3xl font-bold text-white">
                      Book Collection
                    </h2>
                  </div>
                  <span className="text-sm text-gray-500 font-medium">
                    {mainBookList.length} titles
                  </span>
                </div>
                
                <HorizontalCarousel 
                  books={mainBookList} 
                  isLoading={isLoading}
                />
              </section>
            )}
            
            {/* Bento Grid */}
            <section className="relative">
              <div className="relative z-10">
                <BentoGrid featuredBooks={featuredBooks} isLoading={isLoading} />
              </div>
            </section>

            {/* Recently Added Section */}
            <section className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-2 h-8 bg-chill-sage rounded-full"></div>
                <h2 className="text-3xl font-bold text-white">
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
                <div className="w-2 h-8 bg-chill-blue rounded-full"></div>
                <h2 className="text-3xl font-bold text-white">
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

            <GenreExplorer />

            <CategoryHighlight 
              title="Fantasy & Magic"
              description="Escape to magical worlds with our curated selection of fantasy adventures and mythical tales"
              iconLetter="F"
              iconBgColor="bg-chill-lavender"
              books={fantasyBooks}
              isLoading={isLoading}
              linkTo="/booklists?category=Fantasy"
            />

            <CategoryHighlight 
              title="History & Culture"
              description="Journey through time with our curated selection of historical masterpieces"
              iconLetter="H"
              iconBgColor="bg-chill-sand"
              books={popularBooks}
              isLoading={isLoading}
              linkTo="/booklists?category=History"
            />

            {currentUser && <UserReviewsPrompt />}
            
            <CommunityReviews books={highlyReviewed} isLoading={isLoading} />

          </div>
        )}

        <Footer />
        
      </div>
    </div>
  );
}

export default Books;