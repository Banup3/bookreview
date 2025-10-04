import express from 'express';
import {
  getReviews,
  createReview,
  updateReview,
  deleteReview,
  getUserReviews,
  getRatingDistribution
} from '../controllers/reviewController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/user/my-reviews', protect, getUserReviews);
router.get('/:bookId/distribution', getRatingDistribution);
router.route('/:bookId')
  .get(getReviews)
  .post(protect, createReview);

router.route('/:id')
  .put(protect, updateReview)
  .delete(protect, deleteReview);

export default router;
