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
import LoadingSpinner from '../components/LoadingSpinner';

function Books() {
  const { currentUser } = useAuth();
  const [activeGenre, setActiveGenre] = useState('Fiction');
  const genres = Object.keys(genreCollections);

  // NEW: Add tab state
  const [activeTab, setActiveTab] = useState('free');

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

  // NEW: For now, we'll use the same data for both tabs
  // Later you can replace this with actual paid books data
  const paidBooks = []; // Empty for now

  if (isLoading) {
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

        {/* NEW: Simple Tabs */}
        <div className="px-6 md:px-12 lg:px-16 pt-8">
          <div className="flex border-b border-white/10">
            <button
              onClick={() => setActiveTab('free')}
              className={`px-6 py-3 font-medium text-sm transition-all relative ${
                activeTab === 'free'
                  ? 'text-chill-sage border-b-2 border-chill-sage'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              Free Books
              {activeTab === 'free' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-chill-sage" />
              )}
            </button>
            
            <button
              onClick={() => setActiveTab('paid')}
              className={`px-6 py-3 font-medium text-sm transition-all relative ${
                activeTab === 'paid'
                  ? 'text-chill-rose border-b-2 border-chill-rose'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              Paid Books
              {activeTab === 'paid' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-chill-rose" />
              )}
            </button>
          </div>
        </div>

        {/* User Section */}
        {currentUser && (
          <div className="px-6 md:px-12 lg:px-16">
            <div className="bg-chill-card rounded-2xl shadow-lg p-6 mt-6 border border-white/5">
              <UserInfo />
            </div>
          </div>
        )}

        {/* NEW: Tab-specific message */}
        {activeTab === 'paid' && (
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
        )}

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
            
            {/* Live Books Section */}
            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <h2 className="text-3xl font-bold text-white">
                    {backendStatus === 'connected' ? 'Live Book Collection' : 'Book Collection'}
                  </h2>
                </div>
                <span className="text-sm text-gray-500 font-medium">
                  {mainBookList.length} titles
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

            {/* Best of Genre Section */}
            <section className="space-y-6">
              <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold text-white">
                  Best of Genre
                </h2>
                <p className="text-gray-400">Discover top-rated books across different categories</p>
              </div>
              
              {/* Genre Tabs */}
              <div className="flex flex-wrap gap-2 justify-center">
                {genres.map(genre => (
                  <button
                    key={genre}
                    onClick={() => setActiveGenre(genre)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      activeGenre === genre 
                        ? 'bg-chill-sage text-black shadow-lg shadow-chill-sage/20' 
                        : 'bg-chill-card border border-white/10 text-gray-400 hover:text-white hover:border-white/20'
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
                  className="text-sm text-chill-sage hover:text-chill-sand font-medium flex items-center gap-1 transition-colors"
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
              <div className="bg-chill-card rounded-2xl p-6 border border-white/5">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-chill-lavender rounded-lg flex items-center justify-center">
                      <span className="text-black/70 text-sm font-bold">F</span>
                    </div>
                    <h2 className="text-3xl font-bold text-white">
                      Fantasy & Magic
                    </h2>
                  </div>
                  <Link 
                    to="/booklists?category=Fantasy" 
                    className="text-sm font-medium text-chill-lavender hover:text-white flex items-center gap-1 transition-colors"
                  >
                    View all <ChevronRight size={16} />
                  </Link>
                </div>
                <p className="text-gray-400 text-sm max-w-2xl">
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
              <div className="bg-chill-card rounded-2xl p-6 border border-white/5">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-chill-sand rounded-lg flex items-center justify-center">
                      <span className="text-black/70 text-sm font-bold">H</span>
                    </div>
                    <h2 className="text-3xl font-bold text-white">
                      History & Culture
                    </h2>
                  </div>
                  <Link 
                    to="/booklists?category=History" 
                    className="text-sm font-medium text-chill-sand hover:text-white flex items-center gap-1 transition-colors"
                  >
                    View all <ChevronRight size={16} />
                  </Link>
                </div>
                <p className="text-gray-400 text-sm max-w-2xl">
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
                    <div className="w-2 h-8 bg-chill-rose rounded-full"></div>
                    <h2 className="text-3xl font-bold text-white">
                      Your Reviews
                    </h2>
                  </div>
                  <button className="text-sm text-chill-rose hover:text-white font-medium transition-colors">
                    Write a review →
                  </button>
                </div>
                
                <div className="bg-chill-highlight rounded-2xl p-8 border border-chill-rose/20 text-center">
                  <div className="flex flex-col items-center justify-center space-y-4">
                    <div className="w-16 h-16 bg-chill-rose/10 rounded-full flex items-center justify-center">
                      <Star className="w-8 h-8 text-chill-rose" />
                    </div>
                    <h3 className="text-xl font-semibold text-white">No Reviews Yet</h3>
                    <p className="text-gray-400 max-w-md">
                      You haven't reviewed any books yet. Start exploring our collection and share your thoughts with the community!
                    </p>
                    <button className="bg-chill-rose hover:bg-opacity-90 text-black px-6 py-3 rounded-full font-medium transition-colors flex items-center gap-2">
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
                  <div className="w-2 h-8 bg-chill-lavender rounded-full"></div>
                  <h2 className="text-3xl font-bold text-white">
                    Community Reviews
                  </h2>
                </div>
                <button className="text-sm text-chill-lavender hover:text-white font-medium transition-colors">
                  View all reviews →
                </button>
              </div>
              
              <div className="bg-chill-card rounded-2xl p-6 border border-white/5">
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
        )}

        {/* Footer */}
        <Footer />
        
      </div>
    </div>
  );
}

export default Books;