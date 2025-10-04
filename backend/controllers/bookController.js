import Book from '../models/Book.js';

// @desc    Get all books with pagination, search, filter, sort
// @route   GET /api/books
// @access  Public
export const getBooks = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    // Build query
    let query = {};

    // Search by title or author
    if (req.query.search) {
      query.$or = [
        { title: { $regex: req.query.search, $options: 'i' } },
        { author: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    // Filter by genre
    if (req.query.genre) {
      query.genre = req.query.genre;
    }

    // Sort options
    let sortOption = { createdAt: -1 };
    if (req.query.sort === 'year') {
      sortOption = { publishedYear: -1 };
    } else if (req.query.sort === 'rating') {
      sortOption = { averageRating: -1 };
    } else if (req.query.sort === 'title') {
      sortOption = { title: 1 };
    }

    const books = await Book.find(query)
      .populate('addedBy', 'name email')
      .sort(sortOption)
      .limit(limit)
      .skip(skip);

    const total = await Book.countDocuments(query);

    res.status(200).json({
      success: true,
      count: books.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      data: books
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single book
// @route   GET /api/books/:id
// @access  Public
export const getBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id)
      .populate('addedBy', 'name email')
      .populate({
        path: 'reviews',
        populate: {
          path: 'user',
          select: 'name'
        }
      });

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }

    res.status(200).json({
      success: true,
      data: book
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create new book
// @route   POST /api/books
// @access  Private
export const createBook = async (req, res) => {
  try {
    req.body.addedBy = req.user.id;
    const book = await Book.create(req.body);

    res.status(201).json({
      success: true,
      data: book
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update book
// @route   PUT /api/books/:id
// @access  Private
export const updateBook = async (req, res) => {
  try {
    let book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }

    // Check if user is book creator
    if (book.addedBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this book'
      });
    }

    book = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: book
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete book
// @route   DELETE /api/books/:id
// @access  Private
export const deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }

    // Check if user is book creator
    if (book.addedBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this book'
      });
    }

    await book.deleteOne();

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

// @desc    Get user's books
// @route   GET /api/books/user/my-books
// @access  Private
export const getUserBooks = async (req, res) => {
  try {
    const books = await Book.find({ addedBy: req.user.id })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: books.length,
      data: books
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};
