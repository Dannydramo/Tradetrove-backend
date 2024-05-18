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
    userById,
    forgotVendorPassword,
    resetVendorPassword,
    updateVendorPassword,
    logOutVendor,
} = require('../controllers/vendorController');
const { getProductsByVendor } = require('../controllers/productController');
const { vendorProtect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/auth/register', registerVendor);
router.post('/auth/login', loginVendor);
router.post('/auth/forgot-password', forgotVendorPassword);
router.get('/auth/logout', vendorProtect, logOutVendor);
router.patch('/auth/reset-password/:token', resetVendorPassword);
router.patch('/auth/update-password', vendorProtect, updateVendorPassword);
router.patch('/auth/change-password', vendorProtect, changeVendorPassword);
router.get('/get-vendor-details', vendorProtect, getVendorDetails);
router.patch('/update-details', vendorProtect, updateVendorDetails);
router.patch('/change-password', vendorProtect, changeVendorPassword);
router.get('/get-popular-vendors', getPopularVendors);
router.get('/products', vendorProtect, getProductsByVendor);
router.get('/statistics', vendorProtect, getVendorStatistics);
router.get('/monthly-amount', vendorProtect, getAllMonthSalesAmount);
router.get('/get-user-details', userById);

module.exports = router;
