"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const appError_1 = __importDefault(require("../utils/appError"));
const handleCastErrorDb = (err) => {
    const message = `Invalid ${err.path}: ${err.value}`;
    return new appError_1.default(message, 400);
};
const handleDuplicateFieldsDb = (err) => {
    const message = `Duplicate field: '${Object.keys(err.keyValue)[0]}'. Use another.`;
    return new appError_1.default(message, 400);
};
const handleValidationErrorDb = (err) => {
    const errorMessages = Object.values(err.errors).map((error) => error.message);
    const message = `Invalid input data. ${errorMessages.join('. ')}`;
    return new appError_1.default(message, 400);
};
const handleJWTError = () => {
    return new appError_1.default('Invalid Token. Please login ', 401);
};
const handleJWTExpiredError = () => {
    return new appError_1.default('Your token has expired. Please login again', 401);
};
const sendErrDev = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack,
    });
};
const sendErrProd = (err, res) => {
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        });
    }
    else {
        res.status(500).json({
            status: 'error',
            message: 'Something went wrong',
        });
    }
};
exports.default = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'fail';
    if (process.env.NODE_ENV === 'development') {
        sendErrDev(err, res);
    }
    else if (process.env.NODE_ENV === 'production') {
        let error = Object.assign({}, err);
        if (error.name === 'CastError')
            error = handleCastErrorDb(error);
        if (error.code === 11000)
            error = handleDuplicateFieldsDb(error);
        if ('errors' in error) {
            error = handleValidationErrorDb(error);
        }
        if (error.name === 'JsonWebTokenError')
            error = handleJWTError();
        if (error.name === 'TokenExpiredError')
            error = handleJWTExpiredError();
        sendErrProd(error, res);
    }
};
