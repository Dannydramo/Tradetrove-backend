const catchAsync = require('../utils/catchAsync');
const Order = require('../models/orderModel');
const AppError = require('../utils/appError');
const { ApiResponse } = require('../helpers/responseHelper');

exports.getAllOrders = catchAsync(async (req, res, next) => {
    const orders = await Order.find({ vendor: req.vendor.id }).populate(
        'user products'
    );

    if (!orders) {
        return next(new AppError('There is no order associated with you', 404));
    }
    return ApiResponse(
        201,
        res,
        'Orders fetched Successfully',
        'success',
        orders
    );
});

exports.getUserOrders = catchAsync(async (req, res, next) => {
    const orders = await Order.find({ user: req.user.id }).populate(
        'user products'
    );

    if (!orders) {
        return next(new AppError('There is no order associated with you', 404));
    }
    return ApiResponse(
        201,
        res,
        'Orders fetched Successfully',
        'success',
        orders
    );
});