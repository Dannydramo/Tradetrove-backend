import express from 'express';
import {
    registerUser,
    loginUser,
    vendorByBusinessName,
} from '../controllers/userController';
import { getProductsByVendor } from '../controllers/productController';
import { getVendorDetails } from '../controllers/vendorController';
const router = express.Router();

router.post('/auth/register', registerUser);
router.post('/auth/login', loginUser);
router.get('/get-vendor-details', vendorByBusinessName);
router.get('/vendor/products/:vendorId', getProductsByVendor);
router.get('/vendor-cart-details/:vendorId', getVendorDetails);
export default router;
