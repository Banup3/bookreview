import { useState, useEffect } from 'react';
import axios from 'axios';
import BookCard from '../components/BookCard';
import Pagination from '../components/Pagination';
import { Search, Filter, SortAsc } from 'lucide-react';

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [genre, setGenre] = useState('');
  const [sortBy, setSortBy] = useState('');

  const genres = ['Fiction', 'Non-Fiction', 'Science Fiction', 'Fantasy', 'Mystery', 'Romance', 'Thriller', 'Biography', 'History', 'Self-Help', 'Other'];

  useEffect(() => {
    fetchBooks();
  }, [currentPage, genre, sortBy]);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage,
        limit: 5
      });

      if (search) params.append('search', search);
      if (genre) params.append('genre', genre);
      if (sortBy) params.append('sort', sortBy);

      const response = await axios.get(`/api/books?${params}`);
      setBooks(response.data.data);
      setTotalPages(response.data.totalPages);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching books:', error);
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchBooks();
  };

  const handleGenreChange = (e) => {
    setGenre(e.target.value);
    setCurrentPage(1);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    setCurrentPage(1);
  };

  if (loading && books.length === 0) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          Discover Books
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Explore and review amazing books from our collection
        </p>
      </div>

      {/* Search and Filters */}
      <div className="card mb-8">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search books by title or author..."
              className="input-field pl-10"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="flex items-center text-sm font-medium mb-2">
                <Filter className="w-4 h-4 mr-2" />
                Filter by Genre
              </label>
              <select
                value={genre}
                onChange={handleGenreChange}
                className="input-field"
              >
                <option value="">All Genres</option>
                {genres.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="flex items-center text-sm font-medium mb-2">
                <SortAsc className="w-4 h-4 mr-2" />
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={handleSortChange}
                className="input-field"
              >
                <option value="">Latest Added</option>
                <option value="title">Title (A-Z)</option>
                <option value="year">Published Year</option>
                <option value="rating">Average Rating</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                className="w-full btn-primary"
              >
                Search
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Books Grid */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : books.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-gray-500 dark:text-gray-400">
            No books found. Try adjusting your search or filters.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {books.map((book) => (
              <BookCard key={book._id} book={book} />
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      )}
    </div>
  );
};

export default BookList;
