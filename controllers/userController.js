const { ApiResponse } = require('../helpers/responseHelper');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/userModel');
const Vendor = require('../models/vendorModel');
const Product = require('../models/productModel');
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
    createSendToken(user, 201, res, 'Logged in successfully');
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

exports.vendorsByState = catchAsync(async (req, res, next) => {
    const { state } = req.params;
    const { category } = req.query;

    let vendors;
    if (category) {
        const products = await Product.find({
            category: { $regex: category, $options: 'i' },
        });
        const vendorIds = products.map((product) => product.vendor);
        vendors = await Vendor.find({
            _id: { $in: vendorIds },
            state: { $regex: state, $options: 'i' },
        });
    } else {
        vendors = await Vendor.find({
            state: { $regex: state, $options: 'i' },
        });
    }

    const requiredFields = [
        'businessName',
        'email',
        'phoneNumber',
        'address',
        'city',
        'state',
        'country',
    ];

    const filteredVendors = vendors.filter((vendor) => {
        return requiredFields.every((field) => vendor[field]);
    });

    return ApiResponse(
        201,
        res,
        'Vendors fetched successfully',
        'success',
        filteredVendors
    );
});

exports.vendorsByCategory = catchAsync(async (req, res, next) => {
    const { category } = req.params;

    const products = await Product.find({ category }).populate('vendor');
    if (!products) {
        return next(
            new AppError(
                'Could not find a product that falls under this category'
            )
        );
    }

    const vendors = products.map((product) => product.vendor);
    const uniqueVendors = vendors.filter(
        (vendor, index, self) =>
            index === self.findIndex((v) => v._id === vendor._id)
    );
    return ApiResponse(
        201,
        res,
        'Vendor fetched successfully',
        'success',
        uniqueVendors
    );
});
