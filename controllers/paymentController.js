const Stripe = require('stripe');
const Order = require('../models/orderModel');

exports.createCheckoutSession = async (req, res, next) => {
    const stripe = new Stripe(process.env.STRIPE_KEY);
    const customer = await stripe.customers.create({
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

    const session = await stripe.checkout.sessions.create({
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
        success_url: `https://tradetrove.vercel.app/`,
        cancel_url: `https://tradetrove.vercel.app/cart`,
    });

    res.send({ url: session.url });
};

exports.stripeWebhook = async (req, res) => {
    const stripe = new Stripe(process.env.STRIPE_KEY);
    let data;
    let eventType;

    let webhookSecret = process.env.STRIPE_WEBHOOK_KEY;

    if (webhookSecret) {
        let event;
        let signature = req.headers['stripe-signature'];
        console.log(signature);
        console.log('Sigature');
        console.log(req.body);
        try {
            const rawBody = req.body.toString('utf-8');
            console.log(rawBody);
            event = stripe.webhooks.constructEvent(
                req.body,
                signature,
                webhookSecret
            );
            console.log('Stripe is working now');
        } catch (err) {
            console.log(` Webhook signature verification failed:  ${err}`);
            return res.sendStatus(400);
        }

        data = event.data.object;
        eventType = event.type;
        console.log('Stripe is working now');
    } else {
        data = req.body.data.object;
        eventType = req.body.type;
        console.log('Stripe is working now');
    }
    console.log(eventType);
    if (eventType === 'checkout.session.completed') {
        stripe.customers
            .retrieve(data.customer)
            .then(async (customer) => {
                console.log(customer.metadata);
                const userId = customer.metadata.userId;
                const vendorId = customer.metadata.vendorId;
                const cartItems = JSON.parse(customer.metadata.cart);

                const order = new Order({
                    user: userId,
                    vendor: vendorId,
                    products: cartItems.map((item) => item.id),
                    shippingAddress: data.shipping_details.address,
                    paymentStatus: data.payment_status,
                    totalPrice: data.amount_total / 100,
                });
                console.log(order);
                await order.save();
            })
            .catch((err) => console.log(err.message));
    }

    res.status(200).end();
};
