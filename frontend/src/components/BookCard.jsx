import { Link } from 'react-router-dom';
import { Calendar, User, Star } from 'lucide-react';
import StarRating from './StarRating';

const BookCard = ({ book }) => {
  return (
    <Link to={`/books/${book._id}`} className="block">
      <div className="card hover:shadow-xl transition-shadow duration-300 h-full">
        <div className="flex flex-col h-full">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
              {book.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-2">
              by {book.author}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mb-4 line-clamp-3">
              {book.description}
            </p>
          </div>

          <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200">
                {book.genre}
              </span>
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <Calendar className="w-4 h-4 mr-1" />
                {book.publishedYear}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <StarRating rating={Math.round(book.averageRating)} readonly size="sm" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {book.averageRating > 0 ? book.averageRating.toFixed(1) : 'No ratings'}
                </span>
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-500">
                {book.reviewCount} {book.reviewCount === 1 ? 'review' : 'reviews'}
              </span>
            </div>

            {book.addedBy && (
              <div className="flex items-center text-xs text-gray-500 dark:text-gray-500">
                <User className="w-3 h-3 mr-1" />
                Added by {book.addedBy.name}
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default BookCard;
