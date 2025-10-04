import express from 'express';
import {
  getBooks,
  getBook,
  createBook,
  updateBook,
  deleteBook,
  getUserBooks
} from '../controllers/bookController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .get(getBooks)
  .post(protect, createBook);

router.get('/user/my-books', protect, getUserBooks);

router.route('/:id')
  .get(getBook)
  .put(protect, updateBook)
  .delete(protect, deleteBook);

export default router;
