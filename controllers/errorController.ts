import { Request, Response, NextFunction } from 'express';
import AppError from '../utils/appError';

interface CastError {
    path: string;
    value: any;
}

interface DuplicateFieldsError {
    keyValue: Record<string, any>;
}

interface ValidationError {
    errors: {
        [field: string]: {
            message: string;
        };
    };
}

const handleCastErrorDb = (err: CastError): AppError => {
    const message = `Invalid ${err.path}: ${err.value}`;
    return new AppError(message, 400);
};

const handleDuplicateFieldsDb = (err: DuplicateFieldsError): AppError => {
    const message = `Duplicate field: '${
        Object.keys(err.keyValue)[0]
    }'. Use another.`;
    return new AppError(message, 400);
};

const handleValidationErrorDb = (err: ValidationError): AppError => {
    const errorMessages = Object.values(err.errors).map(
        (error) => error.message
    );
    const message = `Invalid input data. ${errorMessages.join('. ')}`;
    return new AppError(message, 400);
};

const handleJWTError = (): AppError => {
    return new AppError('Invalid Token. Please login ', 401);
};

const handleJWTExpiredError = (): AppError => {
    return new AppError('Your token has expired. Please login again', 401);
};

const sendErrDev = (err: AppError, res: Response): void => {
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack,
    });
};

const sendErrProd = (err: AppError, res: Response): void => {
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        });
    } else {
        res.status(500).json({
            status: 'error',
            message: 'Something went wrong',
        });
    }
};

export default (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'fail';

    if (process.env.NODE_ENV === 'development') {
        sendErrDev(err, res);
    } else if (process.env.NODE_ENV === 'production') {
        let error = { ...err } as AppError;

        if (error.name === 'CastError')
            error = handleCastErrorDb(error as unknown as CastError);
        if (error.code === 11000)
            error = handleDuplicateFieldsDb(
                error as unknown as DuplicateFieldsError
            );

        if ('errors' in error) {
            error = handleValidationErrorDb(error as ValidationError);
        }

        if (error.name === 'JsonWebTokenError') error = handleJWTError();
        if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

        sendErrProd(error, res);
    }
};
