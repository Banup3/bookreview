import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import StarRating from '../components/StarRating';
import { Calendar, User, Edit, Trash2, MessageSquare } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const BookDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [distribution, setDistribution] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewForm, setReviewForm] = useState({
    rating: 0,
    reviewText: ''
  });
  const [editingReview, setEditingReview] = useState(null);

  useEffect(() => {
    fetchBookDetails();
    fetchRatingDistribution();
  }, [id]);

  const fetchBookDetails = async () => {
    try {
      const response = await axios.get(`/api/books/${id}`);
      setBook(response.data.data);
      setReviews(response.data.data.reviews || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching book:', error);
      setLoading(false);
    }
  };

  const fetchRatingDistribution = async () => {
    try {
      const response = await axios.get(`/api/reviews/${id}/distribution`);
      setDistribution(response.data.data);
    } catch (error) {
      console.error('Error fetching distribution:', error);
    }
  };

  const handleDeleteBook = async () => {
    if (!window.confirm('Are you sure you want to delete this book?')) return;

    try {
      await axios.delete(`/api/books/${id}`);
      navigate('/');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to delete book');
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }

    if (reviewForm.rating === 0) {
      alert('Please select a rating');
      return;
    }

    try {
      if (editingReview) {
        await axios.put(`/api/reviews/${editingReview._id}`, reviewForm);
        setEditingReview(null);
      } else {
        await axios.post(`/api/reviews/${id}`, reviewForm);
      }
      
      setReviewForm({ rating: 0, reviewText: '' });
      fetchBookDetails();
      fetchRatingDistribution();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to submit review');
    }
  };

  const handleEditReview = (review) => {
    setEditingReview(review);
    setReviewForm({
      rating: review.rating,
      reviewText: review.reviewText
    });
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;

    try {
      await axios.delete(`/api/reviews/${reviewId}`);
      fetchBookDetails();
      fetchRatingDistribution();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to delete review');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <p className="text-xl text-gray-500">Book not found</p>
      </div>
    );
  }

  const userHasReviewed = reviews.some(r => r.user._id === user?._id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Book Info */}
      <div className="card mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              {book.title}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">
              by {book.author}
            </p>
          </div>

          {user && book.addedBy._id === user._id && (
            <div className="flex space-x-2">
              <Link
                to={`/edit-book/${book._id}`}
                className="btn-secondary flex items-center space-x-2"
              >
                <Edit className="w-4 h-4" />
                <span>Edit</span>
              </Link>
              <button
                onClick={handleDeleteBook}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete</span>
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Genre</p>
            <span className="inline-block px-3 py-1 text-sm font-semibold rounded-full bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200">
              {book.genre}
            </span>
          </div>

          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Published Year</p>
            <div className="flex items-center text-gray-900 dark:text-white">
              <Calendar className="w-5 h-5 mr-2" />
              <span className="font-medium">{book.publishedYear}</span>
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Added By</p>
            <div className="flex items-center text-gray-900 dark:text-white">
              <User className="w-5 h-5 mr-2" />
              <span className="font-medium">{book.addedBy.name}</span>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Description</h3>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {book.description}
          </p>
        </div>

        <div className="flex items-center space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
          <StarRating rating={Math.round(book.averageRating)} readonly size="lg" />
          <div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {book.averageRating > 0 ? book.averageRating.toFixed(1) : 'No ratings'}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {book.reviewCount} {book.reviewCount === 1 ? 'review' : 'reviews'}
            </p>
          </div>
        </div>
      </div>

      {/* Rating Distribution */}
      {distribution.length > 0 && book.reviewCount > 0 && (
        <div className="card mb-8">
          <h2 className="text-2xl font-bold mb-4">Rating Distribution</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={distribution}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-gray-300 dark:stroke-gray-600" />
              <XAxis dataKey="rating" label={{ value: 'Stars', position: 'insideBottom', offset: -5 }} />
              <YAxis label={{ value: 'Count', angle: -90, position: 'insideLeft' }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'var(--tw-bg-opacity)', 
                  borderRadius: '0.5rem',
                  border: '1px solid #e5e7eb'
                }} 
              />
              <Bar dataKey="count" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Review Form */}
      {user && !userHasReviewed && (
        <div className="card mb-8">
          <h2 className="text-2xl font-bold mb-4 flex items-center">
            <MessageSquare className="w-6 h-6 mr-2" />
            Write a Review
          </h2>
          <form onSubmit={handleSubmitReview} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Your Rating</label>
              <StarRating
                rating={reviewForm.rating}
                onRatingChange={(rating) => setReviewForm({ ...reviewForm, rating })}
                size="lg"
              />
            </div>

            <div>
              <label htmlFor="reviewText" className="block text-sm font-medium mb-2">
                Your Review
              </label>
              <textarea
                id="reviewText"
                value={reviewForm.reviewText}
                onChange={(e) => setReviewForm({ ...reviewForm, reviewText: e.target.value })}
                className="input-field min-h-[120px]"
                placeholder="Share your thoughts about this book..."
                required
              />
            </div>

            <div className="flex space-x-2">
              <button type="submit" className="btn-primary">
                {editingReview ? 'Update Review' : 'Submit Review'}
              </button>
              {editingReview && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingReview(null);
                    setReviewForm({ rating: 0, reviewText: '' });
                  }}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      {/* Reviews List */}
      <div className="card">
        <h2 className="text-2xl font-bold mb-6">Reviews ({reviews.length})</h2>

        {reviews.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center py-8">
            No reviews yet. Be the first to review this book!
          </p>
        ) : (
          <div className="space-y-6">
            {reviews.map((review) => (
              <div key={review._id} className="pb-6 border-b border-gray-200 dark:border-gray-700 last:border-0">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {review.user.name}
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      <StarRating rating={review.rating} readonly size="sm" />
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {user && review.user._id === user._id && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditReview(review)}
                        className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteReview(review._id)}
                        className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {review.reviewText}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookDetails;
