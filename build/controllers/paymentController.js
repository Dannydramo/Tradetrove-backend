"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.stripeWebhook = exports.createCheckoutSession = void 0;
const stripe_1 = __importDefault(require("stripe"));
const orderModel_1 = __importDefault(require("../models/orderModel"));
const createCheckoutSession = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const stripe = new stripe_1.default(process.env.STRIPE_KEY);
    const customer = yield stripe.customers.create({
        metadata: {
            userId: req.body.userId,
            cart: JSON.stringify(req.body.cartItem),
            vendorId: req.body.vendorId,
        },
    });
    const line_items = req.body.cartItem.map((item) => {
        return {
            price_data: {
                currency: 'ngn',
                product_data: {
                    name: item.name,
                    images: [item.image],
                    metadata: {
                        id: item.id,
                    },
                },
                unit_amount: item.price * 100,
            },
            quantity: item.quantity,
        };
    });
    const session = yield stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        shipping_address_collection: {
            allowed_countries: ['NG'],
        },
        shipping_options: [
            {
                shipping_rate_data: {
                    type: 'fixed_amount',
                    fixed_amount: {
                        amount: 0,
                        currency: 'ngn',
                    },
                    display_name: 'Free shipping',
                    delivery_estimate: {
                        minimum: {
                            unit: 'business_day',
                            value: 5,
                        },
                        maximum: {
                            unit: 'business_day',
                            value: 7,
                        },
                    },
                },
            },
            {
                shipping_rate_data: {
                    type: 'fixed_amount',
                    fixed_amount: {
                        amount: 1500 * 100,
                        currency: 'ngn',
                    },
                    display_name: 'Next day air',
                    delivery_estimate: {
                        minimum: {
                            unit: 'business_day',
                            value: 1,
                        },
                        maximum: {
                            unit: 'business_day',
                            value: 1,
                        },
                    },
                },
            },
        ],
        phone_number_collection: {
            enabled: true,
        },
        line_items,
        mode: 'payment',
        customer: customer.id,
        success_url: `http://localhost:3000/`,
        cancel_url: `http://localhost:3000/cart`,
    });
    res.send({ url: session.url });
});
exports.createCheckoutSession = createCheckoutSession;
const stripeWebhook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const stripe = new stripe_1.default(process.env.STRIPE_KEY);
    let data;
    let eventType;
    let webhookSecret;
    webhookSecret = process.env.STRIPE_WEBHOOK_KEY;
    if (webhookSecret) {
        let event;
        let signature = req.headers['stripe-signature'];
        console.log(signature);
        try {
            event = stripe.webhooks.constructEvent(req.body, signature, webhookSecret);
        }
        catch (err) {
            console.log(`⚠️  Webhook signature verification failed:  ${err}`);
            return res.sendStatus(400);
        }
        data = event.data.object;
        eventType = event.type;
    }
    else {
        data = req.body.data.object;
        eventType = req.body.type;
    }
    if (eventType === 'checkout.session.completed') {
        stripe.customers
            .retrieve(data.customer)
            .then((customer) => __awaiter(void 0, void 0, void 0, function* () {
            const userId = customer.metadata.userId;
            const vendorId = customer.metadata.vendorId;
            const cartItems = JSON.parse(customer.metadata.cart);
            const order = new orderModel_1.default({
                user: userId,
                vendor: vendorId,
                products: cartItems.map((item) => item.id),
                shippingAddress: data.shipping_details.address,
                paymentStatus: data.payment_status,
                totalPrice: data.amount_total / 100,
            });
            yield order.save();
        }))
            .catch((err) => console.log(err.message));
    }
    res.status(200).end();
});
exports.stripeWebhook = stripeWebhook;
