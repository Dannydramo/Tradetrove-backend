const express = require('express');

const router = express.Router();

const VendorRoute = require('./vendorRoute');
const UserRoute = require('./userRoute');
const ProductRoute = require('./productRoute');
const PaymentRoute = require('./paymentRoute');
const OrderRoute = require('./orderRoute');
const ConversationRoute = require('./conversationRoute');
const MessageRoute = require('./messageRoute');
const reviewRoute = require('./reviewRoute');
const WishlistRoute = require('./wishlistRoute');

router.use('/vendor', VendorRoute);
router.use('/user', UserRoute);
router.use('/product', ProductRoute);
router.use('/payment', PaymentRoute);
router.use('/orders', OrderRoute);
router.use('/conversation', ConversationRoute);
router.use('/message', MessageRoute);
router.use('/review', reviewRoute);
router.use('/wishlist', WishlistRoute);
module.exports = router;
