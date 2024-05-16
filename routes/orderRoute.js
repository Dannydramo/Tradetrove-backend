const express = require('express');
const {
    getAllOrders,
    getUserOrders,
    getUserRecentOrder,
} = require('../controllers/orderController');
const { vendorProtect, userProtect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/all', vendorProtect, getAllOrders);
router.get('/', userProtect, getUserOrders);
router.get('/user-recent-order', userProtect, getUserRecentOrder);
module.exports = router;
