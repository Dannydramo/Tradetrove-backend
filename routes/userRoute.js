const express = require('express');
const {
    registerUser,
    loginUser,
    vendorByBusinessName,
    getUserdetails,
} = require('../controllers/userController');
const { getProductsByVendor } = require('../controllers/productController');
const { getVendorDetails } = require('../controllers/vendorController');
const { userProtect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/auth/register', registerUser);
router.post('/auth/login', loginUser);
router.get('/details', userProtect, getUserdetails);
router.get('/get-vendor-details', vendorByBusinessName);
router.get('/vendor/products/:vendorId', getProductsByVendor);
router.get('/vendor-cart-details/:vendorId', getVendorDetails);

module.exports = router;
