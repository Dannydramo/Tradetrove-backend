const express = require('express');
const {
    createCheckoutSession,
    stripeWebhook,
} = require('../controllers/paymentController');

const router = express.Router();

router.post('/create-checkout-session', createCheckoutSession);
router.post('/webhook', stripeWebhook);

module.exports = router;
