import express from 'express';

// ERROR HANDLERS IMPORTS
import AppError from '../utils/appError';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import routes from '../routes/index';
import globalErrorHandler from '../controllers/errorController';
const app = express();
app.use((req, res, next) => {
    if (req.originalUrl === '/api/v1/payment/webhook') {
        next();
    } else {
        express.json()(req, res, next);
    }
});

app.use(cors());

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
} else {
    app.use(morgan('combined'));
}
app.use(cookieParser());
app.use('/api/v1', routes);

app.all(
    '*',
    (req: { originalUrl: any }, res: any, next: (arg0: any) => void) => {
        next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
    }
);
app.use(globalErrorHandler);
export default app;
