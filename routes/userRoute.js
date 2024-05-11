const express = require('express');
const {
    registerUser,
    loginUser,
    vendorByBusinessName,
    getUserdetails,
    vendorsByState,
    vendorsByCategory,
    forgotUserPassword,
    resetUserPassword,
    updateUserPassword,
} = require('../controllers/userController');
const { getProductsByVendor } = require('../controllers/productController');
const { getVendorDetails } = require('../controllers/vendorController');
const { userProtect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/auth/register', registerUser);
router.post('/auth/login', loginUser);
router.post('/auth/forgot-password', forgotUserPassword);
router.patch('/auth/reset-password/:token', resetUserPassword);
router.patch('/auth/update-password', userProtect, updateUserPassword);
router.get('/details', userProtect, getUserdetails);
router.get('/get-vendor-details', vendorByBusinessName);
router.get('/vendor/products/:vendorId', getProductsByVendor);
router.get('/vendor-cart-details/:vendorId', getVendorDetails);
router.get('/vendors/:state', vendorsByState);
router.get('/vendors/category/:category', vendorsByCategory);
module.exports = router;
