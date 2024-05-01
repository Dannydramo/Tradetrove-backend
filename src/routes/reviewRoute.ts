import express from 'express';

import { userProtect } from '../middleware/authMiddleware';
import {
    createReview,
    getReviewsByProduct,
} from '../controllers/reviewController';

const router = express.Router();
router.post('/create', userProtect, createReview);
router.get('/get/:productId', getReviewsByProduct);
export default router;
