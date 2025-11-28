// src/app/Home.jsx
import React, { useState, useMemo } from 'react';
import HeroSlideshow from '../components/HomePage/HeroSlideshow';
import UserAndTags from '../components/HomePage/UserAndTags';
import BookSection from '../components/HomePage/BookSection';
import BentoGrid from '../components/HomePage/BentoGrid';
import { standardBooks, genreCollections, bestHistory } from '../data'; 
import HorizontalCarousel from '../components/HomePage/HorizontalCarousel';
import Footer from '../components/HomePage/Footer';
import { useBookData } from '../hooks/useBookData';
import { Tag, Star, BookOpen } from 'lucide-react';

function Home() {
  const [activeGenre, setActiveGenre] = useState('Fiction');
  const genres = Object.keys(genreCollections);

  // Use the hook to get live data
  const { books: liveBooks, isLoading, error } = useBookData();

  // Determine which data to use
  const mainBookList = liveBooks.length > 0 ? liveBooks : standardBooks;

  // Memoized computed data for better performance
  const { recentlyAddedBooks, popularBooks, limitedBooks, fantasyBooks } = useMemo(() => {
    // Sort by issued date for recently added (newest first)
    const recentlyAdded = [...mainBookList]
      .sort((a, b) => new Date(b.issuedDate || 0) - new Date(a.issuedDate || 0))
      .slice(0, 10);

    // Filter popular books by download count
    const popular = mainBookList
      .filter(book => book.downloadCount > 1000)
      .slice(0, 10);

    // Filter fantasy books (based on subjects)
    const fantasy = mainBookList
      .filter(book => 
        book.subjects?.some(subject => 
          subject.toLowerCase().includes('fantasy') ||
          subject.toLowerCase().includes('magic') ||
          subject.toLowerCase().includes('fairy') ||
          subject.toLowerCase().includes('myth')
        )
      )
      .slice(0, 10);

    // Limit all books to 3 rows (18 books for 6-column grid)
    const limited = mainBookList.slice(0, 18);

    return { 
      recentlyAddedBooks: recentlyAdded, 
      popularBooks: popular, 
      limitedBooks: limited,
      fantasyBooks: fantasy
    };
  }, [mainBookList]);

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
              <BentoGrid featuredBooks={mainBookList.slice(0, 8)} />
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
              books={recentlyAddedBooks} 
              isLoading={isLoading}
            />
          </section>

          {/* All Books Collection (Limited to 3 rows) */}
          <section className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-2 h-8 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full"></div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Browse All Books
              </h2>
            </div>
            
            <BookSection 
              title="Complete Collection" 
              books={limitedBooks} 
              isLoading={isLoading}
              showViewAll={mainBookList.length > 18}
            />
          </section>

          {/* Best of Genre Section */}
          <section className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Best of Genre
              </h2>
              <p className="text-gray-600">Discover top-rated books across different categories</p>
            </div>
            
            {/* Genre Tabs */}
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
            
            <HorizontalCarousel 
              title={`Best of ${activeGenre}`} 
              books={genreCollections[activeGenre]} 
            />
          </section>

          {/* Fantasy Section */}
          <section className="space-y-6">
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-6 border border-purple-100">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm font-bold">F</span>
                </div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-900 to-indigo-700 bg-clip-text text-transparent">
                  Fantasy & Magic
                </h2>
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
              title="Historical Masterpieces" 
              books={popularBooks} 
              isLoading={isLoading}
            />
          </section>

          {/* Your Reviews Section */}
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
                books={mainBookList
                  .filter(book => book.downloadCount > 5000)
                  .slice(0, 8)
                } 
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

export default Home;