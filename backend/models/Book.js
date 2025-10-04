import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a book title'],
    trim: true,
    maxlength: [200, 'Title cannot be more than 200 characters']
  },
  author: {
    type: String,
    required: [true, 'Please provide an author name'],
    trim: true,
    maxlength: [100, 'Author name cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
    maxlength: [2000, 'Description cannot be more than 2000 characters']
  },
  genre: {
    type: String,
    required: [true, 'Please provide a genre'],
    enum: ['Fiction', 'Non-Fiction', 'Science Fiction', 'Fantasy', 'Mystery', 'Romance', 'Thriller', 'Biography', 'History', 'Self-Help', 'Other'],
    default: 'Other'
  },
  publishedYear: {
    type: Number,
    required: [true, 'Please provide published year'],
    min: [1000, 'Please provide a valid year'],
    max: [new Date().getFullYear(), 'Year cannot be in the future']
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviewCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual populate reviews
bookSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'book',
  justOne: false
});

// Create index for search
bookSchema.index({ title: 'text', author: 'text' });

export default mongoose.model('Book', bookSchema);
