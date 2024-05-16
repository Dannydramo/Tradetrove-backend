const express = require('express');

// ERROR HANDLERS IMPORTS
const AppError = require('./utils/appError');
const morgan = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const routes = require('./routes/index');
const globalErrorHandler = require('./controllers/errorController');
const { stripeWebhook } = require('./controllers/paymentController');

const app = express();
app.post(
    '/api/v1/payment/webhook',
    express.raw({ type: 'application/json' }),
    stripeWebhookeWebhook
);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// app.use((req, res, next) => {
//     if (req.originalUrl === '/api/v1/payment/webhook') {
//         express.raw({ type: 'application/json' })(req, res, next);
//     } else {
//         express.json()(req, res, next);
//     }
// });

app.use(cors());

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
} else {
    app.use(morgan('combined'));
}
app.use(cookieParser());
app.use('/api/v1', routes);

app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});
app.use(globalErrorHandler);

module.exports = app;
