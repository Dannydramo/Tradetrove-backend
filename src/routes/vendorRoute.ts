import express from 'express';
import {
    registerVendor,
    loginVendor,
    getAllVendor,
    getVendorDetails,
    updateVendorDetails,
    changeVendorPassword,
    getVendorStatistics,
    getAllMonthSalesAmount,
} from '../controllers/vendorController';
import { getProductsByVendor } from '../controllers/productController';
import { vendorProtect } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/auth/register', registerVendor);
router.post('/auth/login', loginVendor);
router.get('/get-vendor-details', vendorProtect, getVendorDetails);
router.patch('/update-details', vendorProtect, updateVendorDetails);
router.patch('/change-password', vendorProtect, changeVendorPassword);
router.get('/get-vendors', getAllVendor);
router.get('/products', vendorProtect, getProductsByVendor);
router.get('/statistics', vendorProtect, getVendorStatistics);
router.get('/monthly-amount', vendorProtect, getAllMonthSalesAmount);
export default router;
