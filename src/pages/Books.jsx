import React, { useState } from 'react';
import HeroSlideshow from '../components/HomePage/HeroSlideshow';
import BookSection from '../components/HomePage/BookSection';
import BentoGrid from '../components/HomePage/BentoGrid';
import HorizontalCarousel from '../components/HomePage/HorizontalCarousel';
import Footer from '../components/HomePage/Footer';
import UserInfo from '../components/HomePage/UserInfo';
import LoadingSpinner from '../components/LoadingSpinner';
import { Sparkles } from 'lucide-react';
import { useHomepageData } from '../hooks/useHomepageData';
import { useAuth } from '../hooks/useAuth';
import { BookOpen } from 'lucide-react';
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
              <div className="relative flex items-center gap-5 py-2 group cursor-default">
  {/* Animated Vertical Bar */}
  <div className="w-1.5 h-8 bg-[#D4E09B] rounded-full shadow-[0_0_15px_rgba(212,224,155,0.3)] transition-all duration-500 ease-out group-hover:h-12 group-hover:bg-[#EAD2AC] group-hover:shadow-[0_0_20px_rgba(234,210,172,0.4)]" />
  
  <div className="relative flex items-center gap-5 py-2 group cursor-default">
  {/* Animated Vertical Bar */}
 
  
  <div className="flex flex-col">
    <div className="flex items-center gap-3">
      <h2 className="text-3xl font-bold text-white tracking-tight group-hover:text-[#EAD2AC] transition-colors duration-300">
        Recently Added
      </h2>
      <Sparkles className="w-5 h-5 text-[#D4E09B] opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 ease-out" />
    </div>
    
    {/* Subtitle that reveals on hover */}
    <span className="text-xs font-medium text-[#9CAFB7] tracking-widest uppercase opacity-0 -translate-y-1 h-0 group-hover:h-auto group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 delay-75">
      Fresh arrivals this week
    </span>
  </div>
</div>
</div>
              
              <HorizontalCarousel 
                title="New Arrivals" 
                books={recentlyAdded} 
                isLoading={isLoading}
              />
            </section>

            {/* All Books Collection */}
            <section className="space-y-6">
            <div className="relative flex items-center gap-5 py-4 group cursor-pointer mb-8">
  {/* Animated Vertical Bar - Blue Accent */}
  <div className="w-1.5 h-8 bg-chill-sage rounded-full shadow-[0_0_15px_rgba(156,175,183,0.3)] transition-all duration-500 ease-out group-hover:h-12 group-hover:bg-[#EAD2AC] group-hover:shadow-[0_0_20px_rgba(156,175,183,0.4)]" />
  
  <div className="flex flex-col justify-center">
    <div className="flex items-center gap-3">
      <h2 className="text-3xl font-bold text-white tracking-tight group-hover:text-chill-sage transition-colors duration-300">
        Browse All Books
      </h2>
      <BookOpen className="w-6 h-6 text-[#9CAFB7] opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 ease-out" />
    </div>
    
    {/* Subtitle reveal */}
    <span className="text-xs font-medium text-[#9CAFB7]/80 tracking-[0.2em] uppercase opacity-0 -translate-y-2 h-0 group-hover:h-auto group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 delay-75">
      Complete Collection
    </span>
  </div>
</div>
              
              <BookSection 
                
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