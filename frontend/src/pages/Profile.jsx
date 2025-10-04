import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { User, BookOpen, MessageSquare } from 'lucide-react';
import BookCard from '../components/BookCard';
import StarRating from '../components/StarRating';

const Profile = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('books');
  const [myBooks, setMyBooks] = useState([]);
  const [myReviews, setMyReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const [booksRes, reviewsRes] = await Promise.all([
        axios.get('/api/books/user/my-books'),
        axios.get('/api/reviews/user/my-reviews')
      ]);
      
      setMyBooks(booksRes.data.data);
      setMyReviews(reviewsRes.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching user data:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Profile Header */}
      <div className="card mb-8">
        <div className="flex items-center space-x-4">
          <div className="w-20 h-20 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
            <User className="w-10 h-10 text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {user?.name}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">{user?.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">
              {myBooks.length}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Books Added</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">
              {myReviews.length}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Reviews Written</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setActiveTab('books')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'books'
              ? 'bg-primary-600 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          <BookOpen className="w-5 h-5" />
          <span>My Books</span>
        </button>
        <button
          onClick={() => setActiveTab('reviews')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'reviews'
              ? 'bg-primary-600 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          <MessageSquare className="w-5 h-5" />
          <span>My Reviews</span>
        </button>
      </div>

      {/* Content */}
      {activeTab === 'books' ? (
        <div>
          {myBooks.length === 0 ? (
            <div className="card text-center py-12">
              <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="text-xl text-gray-500 dark:text-gray-400 mb-4">
                You haven't added any books yet
              </p>
              <Link to="/add-book" className="btn-primary inline-block">
                Add Your First Book
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myBooks.map((book) => (
                <BookCard key={book._id} book={book} />
              ))}
            </div>
          )}
        </div>
      ) : (
        <div>
          {myReviews.length === 0 ? (
            <div className="card text-center py-12">
              <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="text-xl text-gray-500 dark:text-gray-400 mb-4">
                You haven't written any reviews yet
              </p>
              <Link to="/" className="btn-primary inline-block">
                Browse Books
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {myReviews.map((review) => (
                <div key={review._id} className="card">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <Link
                        to={`/books/${review.book._id}`}
                        className="text-xl font-bold text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400"
                      >
                        {review.book.title}
                      </Link>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        by {review.book.author}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <StarRating rating={review.rating} readonly size="sm" />
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">
                    {review.reviewText}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Profile;
