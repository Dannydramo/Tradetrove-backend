const express = require('express');
const {
    addToWishlist,
    removeFromWishlist,
    getUserWishlist,
    fetchProductWishlistStatus,
} = require('../controllers/wishlistController');
const { userProtect } = require('../middleware/authMiddleware');

const router = express.Router();
router.use(userProtect);
router.get('/', getUserWishlist);
router.post('/new', addToWishlist);
router.delete('/remove/:productId', removeFromWishlist);
router.get('/status/:productId', fetchProductWishlistStatus);
module.exports = router;
