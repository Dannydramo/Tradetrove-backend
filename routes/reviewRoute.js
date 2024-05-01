const express = require('express');

const { userProtect } = require('../middleware/authMiddleware');
const {
    createReview,
    getReviewsByProduct,
} = require('../controllers/reviewController');

const router = express.Router();
router.post('/create', userProtect, createReview);
router.get('/get/:productId', getReviewsByProduct);
module.exports = router;
