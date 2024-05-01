const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Vendor = require('../models/vendorModel');
const User = require('../models/userModel');

const verifyToken = async (token, secret) => {
    try {
        const verifyAsync = promisify(jwt.verify);
        const decoded = await verifyAsync(token, secret);
        return decoded;
    } catch (error) {
        throw new AppError('Unauthorized. Please login and try again', 401);
    }
};

const vendorProtect = catchAsync(async (req, res, next) => {
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return next(
            new AppError(
                'You are not logged in. Please log in to get access',
                401
            )
        );
    }

    const decoded = await verifyToken(token, process.env.JWT_SECRET);

    const currentVendor = await Vendor.findById(decoded.id);

    if (!currentVendor) {
        return next(new AppError('The user does not exist', 401));
    }

    if (currentVendor.changedPasswordAfter(decoded.iat)) {
        return next(
            new AppError(
                'User recently changed password. Please log in again',
                401
            )
        );
    }

    req.vendor = currentVendor;
    next();
});

const userProtect = catchAsync(async (req, res, next) => {
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
        return next(
            new AppError(
                'You are not logged in. Please log in to get access',
                401
            )
        );
    }

    const decoded = await verifyToken(token, process.env.JWT_SECRET);

    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
        return next(new AppError('The user does not longer exist', 401));
    }

    if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next(
            new AppError(
                'User recently changed password. Please login again',
                401
            )
        );
    }

    req.user = currentUser;
    next();
});

module.exports = { vendorProtect, userProtect };
