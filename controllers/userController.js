const { ApiResponse } = require('../helpers/responseHelper');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/userModel');
const Vendor = require('../models/vendorModel');
const { createSendToken } = require('../utils/createToken');
const AppError = require('../utils/appError');

exports.registerUser = catchAsync(async (req, res, next) => {
    const newUser = await User.create({
        username: req.body.userName,
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
    });
    createSendToken(newUser, 201, res, 'Account created successfully');
});

exports.loginUser = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return next(new AppError('Please provide email and password', 400));
    }
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.correctPassword(password, user.password))) {
        return next(new AppError('Incorrect email or password', 401));
    }
    createSendToken(user, 201, res, 'Account created successfully');
});

exports.getUserdetails = catchAsync(async (req, res, next) => {
    const userId = req.params.userId || req.user.id;
    const user = await User.findById(userId);
    if (!user) {
        return next(new AppError('Could not find user', 404));
    }
    user.password = undefined;
    user.confirmPassword = undefined;
    return ApiResponse(201, res, 'user fetched successfully', 'success', user);
});

exports.vendorByBusinessName = catchAsync(async (req, res, next) => {
    const { businessName, vendorId } = req.query;

    const vendor = businessName
        ? await Vendor.findOne({ businessName })
        : await Vendor.findById(vendorId);

    if (!vendor) {
        return next(new AppError('Vendor not found', 404));
    }

    return ApiResponse(
        201,
        res,
        'Vendor fetched successfully',
        'success',
        vendor
    );
});
