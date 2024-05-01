const express = require('express');
const {
    createCheckoutSession,
    stripeWebhook,
} = require('../controllers/paymentController');

const router = express.Router();

router.post('/create-checkout-session', createCheckoutSession);
router.post(
    '/webhook',
    express.raw({ type: 'application/json' }),
    stripeWebhook
);

module.exports = router;
