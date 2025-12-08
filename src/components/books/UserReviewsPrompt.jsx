import React, { useEffect, useState } from 'react';
import { Star, BookOpen, MessageSquareHeart, ThumbsUp, ExternalLink, Edit, Trash2 } from 'lucide-react';
import { fetchUserReviews, deleteReview, updateReview } from '../../api/books'; // Adjust path as needed

const UserReviewsPrompt = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [editRating, setEditRating] = useState(5);
  const [editTitle, setEditTitle] = useState('');

  useEffect(() => {
    loadUserReviews();
  }, []);

  const loadUserReviews = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Loading user reviews...');
      const response = await fetchUserReviews();
      
      console.log('Reviews response:', response);
      
      if (response.success) {
        setReviews(response.data || []);
      } else {
        setError(response.message || 'Failed to load reviews');
      }
    } catch (err) {
      console.error('Error loading reviews:', err);
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleEditReview = (review) => {
    setEditingReviewId(review._id);
    setEditContent(review.content);
    setEditRating(review.rating);
    setEditTitle(review.title || '');
  };

  const handleSaveEdit = async (reviewId) => {
    try {
      const reviewData = {
        rating: editRating,
        title: editTitle,
        content: editContent
      };
      
      const response = await updateReview(reviewId, reviewData);
      
      if (response.success) {
        // Update locally
        setReviews(prev => prev.map(review => 
          review._id === reviewId 
            ? { 
                ...review, 
                ...reviewData,
                updatedAt: new Date().toISOString() 
              }
            : review
        ));
        setEditingReviewId(null);
        alert('Review updated successfully!');
      } else {
        alert('Failed to update review: ' + response.message);
      }
    } catch (err) {
      console.error('Failed to update review:', err);
      alert('Error updating review');
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;
    
    try {
      const response = await deleteReview(reviewId);
      
      if (response.success) {
        // Remove from local state
        setReviews(prev => prev.filter(review => review._id !== reviewId));
        alert('Review deleted successfully!');
      } else {
        alert('Failed to delete review: ' + response.message);
      }
    } catch (err) {
      console.error('Failed to delete review:', err);
      alert('Error deleting review');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Recently';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch (e) {
      return 'Recently';
    }
  };

  const renderStars = (rating) => {
    if (!rating) return null;
    
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={16}
            className={`${
              i < rating 
                ? 'text-yellow-400 fill-yellow-400' 
                : 'text-gray-600'
            }`}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-2 h-8 bg-chill-rose rounded-full"></div>
            <h2 className="text-3xl font-bold text-white">Your Reviews</h2>
          </div>
        </div>
        <div className="bg-chill-highlight rounded-2xl p-8 flex items-center justify-center min-h-[200px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-chill-rose"></div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-2 h-8 bg-chill-rose rounded-full"></div>
            <h2 className="text-3xl font-bold text-white">Your Reviews</h2>
          </div>
        </div>
        
        <div className="bg-chill-highlight rounded-2xl p-8 border border-chill-rose/20 text-center">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center">
              <Star className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-xl font-semibold text-white">Error Loading Reviews</h3>
            <p className="text-gray-400 max-w-md">
              {error}
            </p>
            <button 
              onClick={loadUserReviews}
              className="bg-chill-rose hover:bg-opacity-90 text-black px-6 py-3 rounded-full font-medium transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }

  if (reviews.length === 0) {
    return (
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-2 h-8 bg-chill-rose rounded-full"></div>
            <h2 className="text-3xl font-bold text-white">Your Reviews</h2>
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
            <button 
              onClick={() => window.location.href = '/books'}
              className="bg-chill-rose hover:bg-opacity-90 text-black px-6 py-3 rounded-full font-medium transition-colors flex items-center gap-2"
            >
              <BookOpen size={18} />
              Browse Books
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      {/* Integrated Aesthetic Header with proper grouping and layout */}
      <div className="flex items-center justify-between mb-8 animate-fade-in">
        <div className="relative flex items-center gap-5 py-2 group cursor-default">
          
          {/* Animated Vertical Bar - Rose Accent */}
          <div className="w-1.5 h-10 bg-[#D4A5A5] rounded-full shadow-[0_0_15px_rgba(212,165,165,0.3)] transition-all duration-500 ease-out group-hover:h-14 group-hover:bg-[#EAD2AC] group-hover:shadow-[0_0_25px_rgba(212,165,165,0.5)]" />
          
          <div className="flex flex-col">
            <div className="flex items-center gap-4">
              {/* Title with Hover Effect */}
              <h2 className="text-3xl font-bold text-white tracking-tight transition-colors duration-300 group-hover:text-[#D4A5A5]">
                Your Reviews
              </h2>
              
              {/* Aesthetic Count Badge */}
              <div className="relative overflow-hidden flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4A5A5]/10 border border-[#D4A5A5]/20 backdrop-blur-md transition-all duration-300 group-hover:border-[#D4A5A5]/40 group-hover:bg-[#D4A5A5]/20">
                <span className="relative z-10 text-sm font-semibold text-[#D4A5A5] group-hover:text-[#EAD2AC] transition-colors">
                  {reviews.length} {reviews.length === 1 ? 'Review' : 'Reviews'}
                </span>
                {/* Subtle shine effect on badge - Uses standard translate for reliable animation */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full transition-transform duration-1000 ease-in-out group-hover:translate-x-full" />
              </div>
            </div>

            {/* Subtitle / Icon Row */}
            <div className="flex items-center gap-2 overflow-hidden h-0 opacity-0 group-hover:h-6 group-hover:opacity-100 transition-all duration-300 ease-out delay-75">
              <MessageSquareHeart className="w-4 h-4 text-[#D4A5A5]" />
              <span className="text-xs font-medium text-[#D4A5A5]/80 tracking-widest uppercase">
                Personal Archive
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        {reviews.map((review) => (
          <div 
            key={review._id}
            className="bg-chill-highlight rounded-2xl p-6 border border-chill-rose/10 hover:border-chill-rose/30 transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex items-center gap-1">
                    {renderStars(review.rating)}
                    <span className="text-white font-semibold ml-2">
                      {review.rating}.0
                    </span>
                  </div>
                  <span className="text-gray-400 text-sm">
                    • {formatDate(review.createdAt)}
                  </span>
                  {review.updatedAt && review.updatedAt !== review.createdAt && (
                    <span className="text-gray-500 text-xs">
                      (Edited)
                    </span>
                  )}
                </div>
                
                {review.title && (
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {review.title}
                  </h3>
                )}
                
                <h4 className="text-md font-medium text-gray-300 mb-1">
                  {review.bookId?.title || review.book?.title || 'Book Review'}
                </h4>
                
                {review.bookId?.author && (
                  <p className="text-gray-400 text-sm mb-3">
                    by {review.bookId.author}
                  </p>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => handleEditReview(review)}
                  className="p-2 text-gray-400 hover:text-chill-rose transition-colors"
                  title="Edit review"
                >
                  <Edit size={18} />
                </button>
                <button 
                  onClick={() => handleDeleteReview(review._id)}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                  title="Delete review"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
            
            {editingReviewId === review._id ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setEditRating(star)}
                      className="p-1"
                    >
                      <Star
                        size={24}
                        className={`${
                          star <= editRating 
                            ? 'text-yellow-400 fill-yellow-400' 
                            : 'text-gray-600'
                        }`}
                      />
                    </button>
                  ))}
                </div>
                
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  placeholder="Review title (optional)"
                  className="w-full bg-chill-dark border border-chill-rose/30 rounded-xl p-3 text-white mb-3"
                />
                
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full bg-chill-dark border border-chill-rose/30 rounded-xl p-4 text-white resize-none min-h-[120px]"
                  placeholder="Share your thoughts about this book..."
                />
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setEditingReviewId(null)}
                    className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleSaveEdit(review._id)}
                    className="bg-chill-rose hover:bg-opacity-90 text-black px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            ) : (
              <>
                <p className="text-gray-300 mb-4 whitespace-pre-line">
                  {review.content}
                </p>
                
                <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <ThumbsUp size={16} className="text-gray-400" />
                      <span className="text-gray-400 text-sm">
                        {review.helpfulCount || review.helpful?.length || review.likes || 0} helpful
                      </span>
                    </div>
                  </div>
                  
                {(review.bookId?.gutenbergId || review.book?.gutenbergId || review.bookId) && (
 <Link 
  to={`/book/${review.bookId?.gutenbergId || review.book?.gutenbergId || review.bookId}`}
  className="text-chill-rose hover:text-white text-sm font-medium transition-colors flex items-center gap-1"
>
  View Book <ExternalLink size={14} />
</Link>
)}
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default UserReviewsPrompt;