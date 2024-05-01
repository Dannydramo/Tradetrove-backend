const express = require('express');
const {
    getAllOrders,
    getUserOrders,
} = require('../controllers/orderController');
const { vendorProtect, userProtect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/all', vendorProtect, getAllOrders);
router.get('/', userProtect, getUserOrders);
module.exports = router;
