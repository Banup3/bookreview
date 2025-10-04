import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: [true, 'Please provide a rating'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot be more than 5']
  },
  reviewText: {
    type: String,
    required: [true, 'Please provide review text'],
    maxlength: [1000, 'Review cannot be more than 1000 characters']
  }
}, {
  timestamps: true
});

// Ensure one review per user per book
reviewSchema.index({ book: 1, user: 1 }, { unique: true });

// Static method to calculate average rating
reviewSchema.statics.calculateAverageRating = async function(bookId) {
  const stats = await this.aggregate([
    {
      $match: { book: bookId }
    },
    {
      $group: {
        _id: '$book',
        averageRating: { $avg: '$rating' },
        reviewCount: { $sum: 1 }
      }
    }
  ]);

  try {
    await this.model('Book').findByIdAndUpdate(bookId, {
      averageRating: stats.length > 0 ? Math.round(stats[0].averageRating * 10) / 10 : 0,
      reviewCount: stats.length > 0 ? stats[0].reviewCount : 0
    });
  } catch (error) {
    console.error(error);
  }
};

// Calculate average rating after save
reviewSchema.post('save', function() {
  this.constructor.calculateAverageRating(this.book);
});

// Calculate average rating after remove
reviewSchema.post('remove', function() {
  this.constructor.calculateAverageRating(this.book);
});

// Calculate average rating after delete
reviewSchema.post('findOneAndDelete', async function(doc) {
  if (doc) {
    await doc.constructor.calculateAverageRating(doc.book);
  }
});

export default mongoose.model('Review', reviewSchema);
