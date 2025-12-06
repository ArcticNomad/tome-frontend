import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, BookOpen, Loader2 } from 'lucide-react';
import { fetchBooksByGenre } from '../../api/books';
import HorizontalCarousel from '../HomePage/HorizontalCarousel';

const GenreExplorer = () => {
  const location = useLocation();
  const [activeGenre, setActiveGenre] = useState('Fiction');
  const [genreBooks, setGenreBooks] = useState({});
  const [loadingGenre, setLoadingGenre] = useState({});

  const ALL_GENRES = [
    'Fiction', 'Science Fiction', 'Fantasy', 'Mystery', 'Thriller',
    'Romance', 'History', 'Biography', 'Science', 'Philosophy',
    'Adventure', 'Horror'
  ];

  // Fetch genre books from API
  useEffect(() => {
    const fetchGenreBooks = async (genre) => {
      if (genreBooks[genre] || loadingGenre[genre]) return;
      
      setLoadingGenre(prev => ({ ...prev, [genre]: true }));
      try {
        const response = await fetchBooksByGenre(genre, 10);
        if (response.success && response.data) {
          setGenreBooks(prev => ({ 
            ...prev, 
            [genre]: response.data 
          }));
        } else {
          setGenreBooks(prev => ({ ...prev, [genre]: [] }));
        }
      } catch (error) {
        console.error(`Error fetching ${genre} books:`, error);
        setGenreBooks(prev => ({ ...prev, [genre]: [] }));
      } finally {
        setLoadingGenre(prev => ({ ...prev, [genre]: false }));
      }
    };

    if (activeGenre && !genreBooks[activeGenre] && !loadingGenre[activeGenre]) {
      fetchGenreBooks(activeGenre);
    }
  }, [activeGenre, genreBooks, loadingGenre]);

  // Handle URL parameters
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const category = params.get('category');
    if (category && ALL_GENRES.includes(category)) {
      setActiveGenre(category);
    }
  }, [location.search]);

  return (
    <section className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-white">
          Best of Genre
        </h2>
        <p className="text-gray-400">Discover top-rated books across different categories</p>
      </div>
      
      {/* Genre Tabs */}
      <div className="flex flex-wrap gap-2 justify-center">
        {ALL_GENRES.map(genre => (
          <button
            key={genre}
            onClick={() => setActiveGenre(genre)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
              activeGenre === genre 
                ? 'bg-chill-sage text-black shadow-lg shadow-chill-sage/20' 
                : 'bg-chill-card border border-white/10 text-gray-400 hover:text-white hover:border-white/20'
            }`}
          >
            {genre}
            {loadingGenre[genre] && <Loader2 size={14} className="animate-spin" />}
          </button>
        ))}
      </div>
      
      {/* View All link */}
      <div className="flex justify-center">
        <Link
          to={`/booklists?category=${encodeURIComponent(activeGenre)}`}
          className="text-sm text-chill-sage hover:text-chill-sand font-medium flex items-center gap-1 transition-colors"
        >
          View all {activeGenre} books <ChevronRight size={16} />
        </Link>
      </div>
      
      {/* Content */}
      {loadingGenre[activeGenre] ? (
        <div className="h-48 flex items-center justify-center bg-chill-card/30 rounded-2xl border border-white/5">
          <div className="text-center space-y-3">
            <Loader2 className="w-8 h-8 text-chill-sage animate-spin mx-auto" />
            <p className="text-gray-400 text-sm">Loading {activeGenre} books...</p>
          </div>
        </div>
      ) : genreBooks[activeGenre]?.length > 0 ? (
        <HorizontalCarousel 
          title={`Best of ${activeGenre}`} 
          books={genreBooks[activeGenre]} 
          showBadge={true}
          badgeText={activeGenre}
        />
      ) : (
        <div className="bg-chill-card/30 rounded-2xl p-8 border border-white/5 text-center">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="w-16 h-16 bg-chill-sage/10 rounded-full flex items-center justify-center">
              <BookOpen className="w-8 h-8 text-chill-sage" />
            </div>
            <h3 className="text-xl font-semibold text-white">
              No {activeGenre} Books Found
            </h3>
            <p className="text-gray-400 max-w-md">
              We couldn't find any books in the {activeGenre} category.
            </p>
          </div>
        </div>
      )}
    </section>
  );
};

export default GenreExplorer;