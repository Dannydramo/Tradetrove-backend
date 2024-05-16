const express = require('express');

// ERROR HANDLERS IMPORTS
const AppError = require('./utils/appError');
const morgan = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const routes = require('./routes/index');
const globalErrorHandler = require('./controllers/errorController');

const app = express();

app.use((req, res, next) => {
    if (req.originalUrl === '/api/v1/payment/webhook') {
        next();
    } else {
        express.json()(req, res, next);
    }
});
app.use(express.urlencoded({ extended: true }));

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
