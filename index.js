const express = require('express');

// ERROR HANDLERS IMPORTS
const AppError = require('./utils/appError');
const morgan = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const routes = require('./routes/index');
const globalErrorHandler = require('./controllers/errorController');
const swaggerUI = require('swagger-ui-express');
const docs = require("./api-docs");
const app = express();

app.use((req, res, next) => {
    if (req.originalUrl === '/api/v1/payment/webhook') {
        next();
    } else {
        express.json()(req, res, next);
    }
});
app.use(express.urlencoded({ extended: true }));

const allowedDomains = [
    'https://tradetrove.vercel.app',
    'https://tradetrove-admin.vercel.app',
    'http://localhost:3000',
    'http://localhost:3001',
];

const corsOptions = {
    origin: (origin, callback) => {
        if (allowedDomains.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    optionsSuccessStatus: 200,
    credentials: true,
};

app.use(cors(corsOptions));

app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (allowedDomains.includes(origin)) {
        res.header('Access-Control-Allow-Origin', origin);
    }
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT');
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    next();
});

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
} else {
    app.use(morgan('combined'));
}
app.use(cookieParser());
app.use('/api/v1', routes);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(docs));

app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});
app.use(globalErrorHandler);

module.exports = app;
