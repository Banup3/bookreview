import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BookPlus } from 'lucide-react';

const AddBook = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    description: '',
    genre: 'Other',
    publishedYear: new Date().getFullYear()
  });

  const genres = ['Fiction', 'Non-Fiction', 'Science Fiction', 'Fantasy', 'Mystery', 'Romance', 'Thriller', 'Biography', 'History', 'Self-Help', 'Other'];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post('/api/books', formData);
      navigate(`/books/${response.data.data._id}`);
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to add book');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-2">
          <BookPlus className="w-8 h-8 text-primary-600 dark:text-primary-400" />
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            Add New Book
          </h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          Share a great book with the community
        </p>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-2">
              Book Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="input-field"
              placeholder="Enter book title"
              required
            />
          </div>

          <div>
            <label htmlFor="author" className="block text-sm font-medium mb-2">
              Author *
            </label>
            <input
              type="text"
              id="author"
              name="author"
              value={formData.author}
              onChange={handleChange}
              className="input-field"
              placeholder="Enter author name"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-2">
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="input-field min-h-[150px]"
              placeholder="Enter book description"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="genre" className="block text-sm font-medium mb-2">
                Genre *
              </label>
              <select
                id="genre"
                name="genre"
                value={formData.genre}
                onChange={handleChange}
                className="input-field"
                required
              >
                {genres.map((genre) => (
                  <option key={genre} value={genre}>
                    {genre}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="publishedYear" className="block text-sm font-medium mb-2">
                Published Year *
              </label>
              <input
                type="number"
                id="publishedYear"
                name="publishedYear"
                value={formData.publishedYear}
                onChange={handleChange}
                className="input-field"
                min="1000"
                max={new Date().getFullYear()}
                required
              />
            </div>
          </div>

          <div className="flex space-x-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Adding Book...' : 'Add Book'}
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="btn-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBook;
