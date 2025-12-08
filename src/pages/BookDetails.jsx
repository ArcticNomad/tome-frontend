import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Star, Heart, Share2, BookOpen, Calendar, User, ArrowLeft, 
  ThumbsUp, Bookmark, Eye, ChevronRight, Loader, AlertCircle, 
  Check, MessageSquare, Trash2, Edit2, X
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useUserProfile } from '../hooks/useUserProfile';
import { useBook, useBookReviews } from '../hooks/useBookData';
import { fetchRelatedBooks } from '../api/books';
import HorizontalCarousel from '../components/HomePage/HorizontalCarousel';
const BookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser, login } = useAuth();
  const { addToBookshelf, 
  getBookStatus,  // Change this from isBookInBookshelf
  profile } = useUserProfile();
  
  // Book Data Hook
  const { book, loading: bookLoading, error: bookError } = useBook(id);
  
  // Reviews Hook
  const { 
    reviews, 
    stats: reviewStats, 
    userReview, 
    loading: reviewsLoading, 
    submitReview, 
    removeReview, 
    markHelpful,
    
  } = useBookReviews(id, currentUser);
// In your BookDetails component, add this with your other useState declarations:
const [isLoadingRelated, setIsLoadingRelated] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [showBookshelfMenu, setShowBookshelfMenu] = useState(false);
  const [currentBookStatus, setCurrentBookStatus] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [relatedBooks, setRelatedBooks] = useState([]);
  
  // Review Form State
  const [isEditingReview, setIsEditingReview] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 0, title: '', content: '' });
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [formError, setFormError] = useState('');

  // Update book status from profile
// Update book status from profile
// Update book status from profile
useEffect(() => {
  const checkBookStatus = async () => {
    if (currentUser && book) {
      try {
        // Use getBookStatus from useUserProfile like BookCard does
        const status = await getBookStatus(book._id || id);
        setCurrentBookStatus(status || '');
      } catch (err) {
        console.error('Error checking book status:', err);
        setCurrentBookStatus('');
      }
    } else {
      setCurrentBookStatus('');
    }
  };

  checkBookStatus();
}, [currentUser, book, id, getBookStatus]); // Add getBookStatus to dependencies
  // Handle Edit Review Click
  useEffect(() => {
    if (isEditingReview && userReview) {
      setReviewForm({
        rating: userReview.rating,
        title: userReview.title || '',
        content: userReview.content
      });
    }
  }, [isEditingReview, userReview]);

  // Fetch Related Books
 // Update the fetchRelated useEffect to log the response
useEffect(() => {
  const fetchRelated = async () => {
    if (!id) return;
    setIsLoadingRelated(true);
    try {
      console.log('📚 Fetching related books for book ID:', id);
      const relatedResponse = await fetchRelatedBooks(id);
      
      console.log('📡 Related books response status:', relatedResponse.success ? 'Success' : 'Failed');
      
      if (relatedResponse.success) {
        console.log('📦 Related books data:', relatedResponse.data);
        setRelatedBooks(relatedResponse.data || []);
      } else {
        console.error('❌ Related books API error:', relatedResponse.message);
        setRelatedBooks([]);
      }
    } catch (err) {
      console.error('🚨 Failed to fetch related books', err);
      setRelatedBooks([]);
    } finally {
      setIsLoadingRelated(false);
    }
  };
  fetchRelated();
}, [id]);
  const handleAddToBookshelf = async (shelfType) => {
  if (!currentUser) return navigate('/login');
  try {
    // Pass all required parameters like BookCard does
    await addToBookshelf(
      book?._id || id,      // book._id from your useBook hook
      shelfType, 
      book?.gutenbergId || id // gutenbergId if available
    );
    setCurrentBookStatus(shelfType);
    setShowBookshelfMenu(false);
    showToast(`Added to ${shelfType.replace(/([A-Z])/g, ' $1').trim()}!`);
  } catch (err) {
    console.error('Error adding to bookshelf:', err);
    showToast('Failed to add to bookshelf');
  }
};

 const handleReviewSubmit = async (e) => {
  e.preventDefault();
  
  if (!currentUser) {
    navigate('/login');
    return;
  }
  
  // Add content length validation
  if (reviewForm.rating === 0) {
    setFormError('Please select a star rating');
    return;
  }
  
  if (!reviewForm.content || reviewForm.content.trim().length < 10) {
    setFormError('Review content must be at least 10 characters long');
    return;
  }
  
  if (reviewForm.content.trim().length > 1000) {
    setFormError('Review content cannot exceed 1000 characters');
    return;
  }
  
  setIsSubmittingReview(true);
  setFormError('');
  
  try {
    const result = await submitReview(reviewForm);
    
    if (result.success) {
      setIsEditingReview(false);
      setReviewForm({ rating: 0, title: '', content: '' });
      setActiveTab('reviews');
      // Show success message
      showToast('Review submitted successfully!');
    } else {
      setFormError(result.error || 'Failed to submit review');
    }
  } catch (error) {
    console.error('Review submission error:', error);
    setFormError('An error occurred while submitting your review. Please try again.');
  } finally {
    setIsSubmittingReview(false);
  }
};
  const handleDeleteReview = async () => {
    if (window.confirm('Are you sure you want to delete your review?')) {
      await removeReview(userReview._id);
      setIsEditingReview(false);
    }
  };

  const handleReviewLike = async (reviewId) => {
    if (!currentUser) return navigate('/login');
    await markHelpful(reviewId);
  };

  const showToast = (msg) => console.log(msg); // Placeholder

  if (bookLoading) {
    return (
      <div className="min-h-screen bg-chill-bg flex items-center justify-center">
        <Loader className="w-12 h-12 text-chill-sage animate-spin" />
      </div>
    );
  }

  if (bookError || !book) {
    return (
      <div className="min-h-screen bg-chill-bg flex flex-col items-center justify-center text-center p-4">
        <AlertCircle className="w-16 h-16 text-chill-rose mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Book Not Found</h2>
        <Link to="/books" className="px-6 py-3 bg-chill-sage text-black font-bold rounded-xl mt-4">
          Browse Books
        </Link>
      </div>
    );
  }

  const averageRating = reviewStats?.averageRating || book.rating || 0;
  const totalReviews = reviewStats?.totalReviews || book.reviewCount || 0;

  return (
    <div className="min-h-screen bg-chill-bg font-sans text-gray-200 p-4 md:p-8">
      {/* Back Button */}
      <div className="max-w-[1400px] mx-auto mb-6">
        <Link to="/books" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-chill-card border border-white/10 hover:bg-white/10 transition-colors text-chill-sage">
          <ArrowLeft size={18} /> Back to Books
        </Link>
      </div>

      <div className="max-w-[1400px] mx-auto bg-chill-surface rounded-[40px] shadow-2xl border border-white/5 overflow-hidden relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-8 z-10 relative">
          
          {/* LEFT: Cover & Actions */}
          <div className="lg:col-span-3 flex flex-col gap-6">
            <div className="relative aspect-[2/3] rounded-3xl overflow-hidden shadow-2xl group">
              <img src={book.coverImageUrl || book.cover} alt={book.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              {averageRating >= 4.5 && (
                <div className="absolute top-4 left-4 p-2 bg-black/40 backdrop-blur-md rounded-full border border-white/10">
                  <Star size={16} className="text-chill-sage fill-chill-sage" />
                </div>
              )}
            </div>

            <div className="space-y-3">
              <button  onClick={() => navigate(`/read/${book._id}`)}  className="w-full flex items-center justify-center gap-2 bg-chill-sage text-black font-bold py-4 px-6 rounded-2xl hover:bg-chill-sand transition-all shadow-glow-sage">
                Read Now <BookOpen size={20} />
              </button>
              
              <div className="relative">
                <button onClick={() => setShowBookshelfMenu(!showBookshelfMenu)} className="w-full flex items-center justify-center gap-2 bg-chill-card border border-white/10 py-3 px-6 rounded-xl hover:bg-white/5 transition">
                  <Bookmark size={18} className={currentBookStatus ? 'text-chill-sage fill-chill-sage' : ''} />
                  {currentBookStatus ? currentBookStatus.replace(/([A-Z])/g, ' $1').trim() : 'Add to Bookshelf'}
                  <ChevronRight size={16} className="ml-auto" />
                </button>
                {showBookshelfMenu && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-chill-card border border-white/10 rounded-xl shadow-xl z-50 overflow-hidden">
                    {['currentlyReading', 'wantToRead', 'read'].map((shelf) => (
                      <button key={shelf} onClick={() => handleAddToBookshelf(shelf)} className="w-full text-left px-4 py-3 hover:bg-white/5 flex items-center justify-between">
                        <span>
  <span>
  {{
    read: "Read",
    currentlyReading: "Reading",
    wantToRead: "Want"
  }[shelf] || shelf.replace(/([A-Z])/g, " $1").trim()}
</span>

      </span>
                        {currentBookStatus === shelf && <Check size={16} className="text-chill-sage" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-chill-card rounded-3xl p-6 border border-white/5 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-chill-bg rounded-full text-chill-sage"><User size={18} /></div>
                <div><p className="text-xs text-gray-500">Author</p><p className="text-sm font-bold text-white">{book.author}</p></div>
              </div>
              <div className="w-full h-px bg-white/5"></div>
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-chill-bg rounded-full text-chill-rose"><Calendar size={18} /></div>
                <div><p className="text-xs text-gray-500">Published</p><p className="text-sm font-bold text-white">{book.publishedDate || book.year}</p></div>
              </div>
            </div>
          </div>

          {/* CENTER: Details & Reviews */}
          <div className="lg:col-span-9 flex flex-col gap-6">
            <div className="bg-chill-card rounded-[32px] p-8 border border-white/5">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h1 className="text-3xl md:text-4xl font-black text-white mb-2">{book.title}</h1>
                  <p className="text-xl text-chill-sage font-medium">{book.author}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 bg-chill-bg px-3 py-2 rounded-xl border border-white/5">
                    <Star size={16} className="text-yellow-400 fill-yellow-400" />
                    <span className="font-bold text-white">{Number(averageRating).toFixed(1)}</span>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex gap-6 border-b border-white/5 mb-6">
                {['overview', 'reviews'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-3 px-2 font-medium capitalize transition-colors ${
                      activeTab === tab ? 'text-chill-sage border-b-2 border-chill-sage' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Content */}
              {activeTab === 'overview' ? (
                <div className="space-y-6">
                  <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                      {book.generated_blurb || book.summary || book.description || "No description available."}
                    </p>
                  
                  {book.subjects && (
                    <div className="flex flex-wrap gap-2">
                      {book.subjects.slice(0, 6).map((sub, i) => (
                        <span key={i} className="px-3 py-1 rounded-full bg-chill-bg border border-white/5 text-xs text-chill-blue">{sub}</span>
                      ))}
                    </div>
                  )}
{/* 
                  {relatedBooks.length > 0 && (
                    <div className="mt-8">
                      <h3 className="text-lg font-bold text-white mb-4">You Might Also Like</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {relatedBooks.slice(0, 4).map((rb) => (
                          <Link key={rb._id} to={`/book/${rb._id}`} className="group block">
                            <div className="aspect-[2/3] rounded-xl overflow-hidden mb-2 bg-chill-bg">
                              <img src={rb.coverImageUrl} alt={rb.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                            </div>
                            <p className="text-sm font-medium text-white truncate">{rb.title}</p>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )} */}
                </div>
              ) : (
                <div className="space-y-8">
                  {/* Reviews Header */}
                  <div className="flex items-center justify-between bg-chill-bg p-6 rounded-2xl border border-white/5">
                    <div>
                      <div className="text-3xl font-bold text-white mb-1">{Number(averageRating).toFixed(1)}</div>
                      <div className="flex text-yellow-400 text-sm mb-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={16} fill={i < Math.round(averageRating) ? "currentColor" : "none"} />
                        ))}
                      </div>
                      <p className="text-xs text-gray-500">{totalReviews} Reviews</p>
                    </div>
                    
                    {!userReview && !isEditingReview && (
                      <button 
                        onClick={() => currentUser ? setIsEditingReview(true) : navigate('/login')}
                        className="bg-chill-sage text-black px-5 py-2.5 rounded-xl font-bold hover:bg-chill-sand transition-colors flex items-center gap-2"
                      >
                        <Edit2 size={16} /> Write a Review
                      </button>
                    )}
                  </div>

                  {/* Review Form (Create or Edit) */}
                  {(isEditingReview || (!userReview && isEditingReview)) && (
                    <div className="bg-chill-bg/50 p-6 rounded-2xl border border-chill-sage/30">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold text-white">
                          {userReview ? 'Edit Your Review' : 'Write a Review'}
                        </h3>
                        <button onClick={() => setIsEditingReview(false)} className="text-gray-400 hover:text-white">
                          <X size={20} />
                        </button>
                      </div>
                      
                      <form onSubmit={handleReviewSubmit} className="space-y-4">
                        {/* Star Input */}
                        <div className="flex gap-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setReviewForm(prev => ({ ...prev, rating: star }))}
                              className="focus:outline-none transition-transform hover:scale-110"
                            >
                              <Star 
                                size={28} 
                                className={star <= reviewForm.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-600"} 
                              />
                            </button>
                          ))}
                        </div>

                        <input
                          type="text"
                          placeholder="Review Title (e.g., An amazing journey!)"
                          value={reviewForm.title}
                          onChange={(e) => setReviewForm(prev => ({ ...prev, title: e.target.value }))}
                          className="w-full bg-chill-card border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-chill-sage"
                        />
                        
                        <textarea
                          rows="4"
                          placeholder="What did you think about the book?"
                          value={reviewForm.content}
                          onChange={(e) => setReviewForm(prev => ({ ...prev, content: e.target.value }))}
                          className="w-full bg-chill-card border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-chill-sage"
                          required
                        />

                        {formError && <p className="text-red-400 text-sm">{formError}</p>}

                        <div className="flex justify-end gap-3">
                          {userReview && (
                            <button 
                              type="button" 
                              onClick={handleDeleteReview}
                              className="px-4 py-2 rounded-xl text-red-400 hover:bg-red-500/10 flex items-center gap-2"
                            >
                              <Trash2 size={16} /> Delete
                            </button>
                          )}
                          <button 
                            type="submit" 
                            disabled={isSubmittingReview}
                            className="bg-chill-sage text-black px-6 py-2 rounded-xl font-bold hover:bg-chill-sand transition-colors disabled:opacity-50"
                          >
                            {isSubmittingReview ? 'Submitting...' : 'Post Review'}
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  {/* Reviews List */}
                  <div className="space-y-4">
                    {reviews.length > 0 ? (
                      reviews.map((review) => (
                        <div key={review._id} className="p-5 rounded-2xl bg-chill-bg border border-white/5 hover:border-white/10 transition-colors">
                          <div className="flex justify-between items-start">
                            <div className="flex items-center gap-3 mb-3">
                              <img 
                                src={review.userAvatar || `https://ui-avatars.com/api/?name=${review.userName}&background=random`} 
                                alt={review.userName} 
                                className="w-10 h-10 rounded-full bg-chill-card" 
                              />
                              <div>
                                <p className="font-bold text-white text-sm">{review.userName}</p>
                                <div className="flex items-center gap-2">
                                  <div className="flex text-yellow-400">
                                    {[...Array(5)].map((_, i) => (
                                      <Star key={i} size={12} fill={i < review.rating ? "currentColor" : "none"} />
                                    ))}
                                  </div>
                                  <span className="text-xs text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</span>
                                </div>
                              </div>
                            </div>
                            
                            {/* Actions for current user's review */}
                            {currentUser?.uid === review.userId && !isEditingReview && (
                              <button 
                                onClick={() => setIsEditingReview(true)}
                                className="text-xs text-chill-sage hover:text-white flex items-center gap-1 bg-chill-card px-2 py-1 rounded-lg"
                              >
                                <Edit2 size={12} /> Edit
                              </button>
                            )}
                          </div>

                          {review.title && <h4 className="text-white font-medium mb-2">{review.title}</h4>}
                          <p className="text-gray-400 text-sm leading-relaxed">{review.content}</p>

                          <div className="flex items-center gap-4 mt-4 pt-4 border-t border-white/5">
                            <button 
                              onClick={() => handleReviewLike(review._id)}
                              className={`flex items-center gap-1.5 text-xs transition-colors ${
                                review.helpful?.includes(currentUser?.uid) 
                                  ? 'text-chill-sage' 
                                  : 'text-gray-500 hover:text-white'
                              }`}
                            >
                              <ThumbsUp size={14} />
                              Helpful ({review.likes || 0})
                            </button>
                            {review.verifiedPurchase && (
                              <span className="flex items-center gap-1 text-xs text-chill-blue">
                                <Check size={14} /> Verified Purchase
                              </span>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-12 bg-chill-bg rounded-2xl border border-dashed border-white/10">
                        <MessageSquare className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                        <p className="text-gray-400">No reviews yet. Be the first to share your thoughts!</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

                  <div className="mt-8">
        {relatedBooks.length > 0 && (
  <div className="mt-8 w-full">
    <HorizontalCarousel 
      title="Related Books" 
      books={relatedBooks || []}
      isLoading={isLoadingRelated}
      theme="dark" // Add this prop
      categories={null}
      activeCategory={null}
      onCategoryChange={() => {}}
    />
  </div>
)}
      </div>
          </div>
    

        </div>
      </div>
    </div>
  );
};

export default BookDetails;