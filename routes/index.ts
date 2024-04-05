import express from 'express';

const router = express.Router();

import VendorRoute from './vendorRoute';
import UserRoute from './userRoute';
import ProductRoute from './productRoute';

router.use('/vendor', VendorRoute);
router.use('/user', UserRoute);
router.use('/product', ProductRoute);
export default router;
