const express = require('express');
const {
    registerVendor,
    loginVendor,
    getAllVendor,
    getVendorDetails,
    updateVendorDetails,
    changeVendorPassword,
    getVendorStatistics,
    getAllMonthSalesAmount,
    getPopularVendors,
} = require('../controllers/vendorController');
const { getProductsByVendor } = require('../controllers/productController');
const { vendorProtect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/auth/register', registerVendor);
router.post('/auth/login', loginVendor);
router.get('/get-vendor-details', vendorProtect, getVendorDetails);
router.patch('/update-details', vendorProtect, updateVendorDetails);
router.patch('/change-password', vendorProtect, changeVendorPassword);
router.get('/get-popular-vendors', getPopularVendors);
router.get('/products', vendorProtect, getProductsByVendor);
router.get('/statistics', vendorProtect, getVendorStatistics);
router.get('/monthly-amount', vendorProtect, getAllMonthSalesAmount);

module.exports = router;
