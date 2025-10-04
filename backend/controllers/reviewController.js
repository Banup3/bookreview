import Review from '../models/Review.js';
import Book from '../models/Book.js';

// @desc    Get reviews for a book
// @route   GET /api/reviews/:bookId
// @access  Public
export const getReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ book: req.params.bookId })
      .populate('user', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create review
// @route   POST /api/reviews/:bookId
// @access  Private
export const createReview = async (req, res) => {
  try {
    const book = await Book.findById(req.params.bookId);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }

    // Check if user already reviewed this book
    const existingReview = await Review.findOne({
      book: req.params.bookId,
      user: req.user.id
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this book'
      });
    }

    const review = await Review.create({
      book: req.params.bookId,
      user: req.user.id,
      rating: req.body.rating,
      reviewText: req.body.reviewText
    });

    const populatedReview = await Review.findById(review._id).populate('user', 'name');

    res.status(201).json({
      success: true,
      data: populatedReview
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update review
// @route   PUT /api/reviews/:id
// @access  Private
export const updateReview = async (req, res) => {
  try {
    let review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Check if user owns the review
    if (review.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this review'
      });
    }

    review = await Review.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    ).populate('user', 'name');

    // Recalculate average rating
    await Review.calculateAverageRating(review.book);

    res.status(200).json({
      success: true,
      data: review
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private
export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Check if user owns the review
    if (review.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this review'
      });
    }

    const bookId = review.book;
    await review.deleteOne();

    // Recalculate average rating
    await Review.calculateAverageRating(bookId);

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get user's reviews
// @route   GET /api/reviews/user/my-reviews
// @access  Private
export const getUserReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ user: req.user.id })
      .populate('book', 'title author')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get rating distribution for a book
// @route   GET /api/reviews/:bookId/distribution
// @access  Public
export const getRatingDistribution = async (req, res) => {
  try {
    const distribution = await Review.aggregate([
      {
        $match: { book: req.params.bookId }
      },
      {
        $group: {
          _id: '$rating',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: -1 }
      }
    ]);

    // Format response with all ratings 1-5
    const formattedDistribution = [5, 4, 3, 2, 1].map(rating => {
      const found = distribution.find(d => d._id === rating);
      return {
        rating,
        count: found ? found.count : 0
      };
    });

    res.status(200).json({
      success: true,
      data: formattedDistribution
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};
