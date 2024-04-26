import express from 'express';

const router = express.Router();

import VendorRoute from './vendorRoute';
import UserRoute from './userRoute';
import ProductRoute from './productRoute';
import PaymentRoute from './paymentRoute';
import OrderRoute from './orderRoute';
import ConversationRoute from './conversationRoute';
import MessageRoute from './messageRoute';
import reviewRoute from './reviewRoute';
router.use('/vendor', VendorRoute);
router.use('/user', UserRoute);
router.use('/product', ProductRoute);
router.use('/payment', PaymentRoute);
router.use('/orders', OrderRoute);
router.use('/conversation', ConversationRoute);
router.use('/message', MessageRoute);
router.use('/review', reviewRoute);
export default router;
