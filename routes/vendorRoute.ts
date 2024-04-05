import express from 'express';
import {
    registerVendor,
    loginVendor,
    getAllVendor,
    getVendorDetails,
    updateVendorDetails,
    changeVendorPassword,
} from '../controllers/vendorController';
import { vendorProtect } from '../middleware/vendorMiddleware';
import { getProductsByVendor } from '../controllers/productController';

const router = express.Router();

router.post('/auth/register', registerVendor);
router.post('/auth/login', loginVendor);
router.get('/get-vendor-details', vendorProtect, getVendorDetails);
router.patch('/update-details', vendorProtect, updateVendorDetails);
router.patch('/change-password', vendorProtect, changeVendorPassword);
router.get('/get-vendors', getAllVendor);
router.get('/products', vendorProtect, getProductsByVendor);

export default router;
