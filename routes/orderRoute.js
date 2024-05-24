const express = require('express');
const {
    getAllOrders,
    getUserOrders,
    getUserRecentOrder,
    getVendorRecentOrder,
} = require('../controllers/orderController');
const { vendorProtect, userProtect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/all', vendorProtect, getAllOrders);
router.get('/', userProtect, getUserOrders);
router.get('/user-recent-order', userProtect, getUserRecentOrder);
router.get('/vendor-recent-order', vendorProtect, getVendorRecentOrder);
module.exports = router;
