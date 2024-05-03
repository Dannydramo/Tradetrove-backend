const { ApiResponse } = require('../helpers/responseHelper');
const catchAsync = require('../utils/catchAsync');
const Vendor = require('../models/vendorModel');
const { createSendToken } = require('../utils/createToken');
const AppError = require('../utils/appError');
const {
    calculateTotalAmount,
    calculateTotalProductsForVendor,
    calculateTotalSalesForVendor,
    calculateTotalUsersForVendor,
} = require('../helpers/vendorHelper');
const { format } = require('date-fns');
const Order = require('../models/orderModel');
const mongoose = require('mongoose');

const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach((el) => {
        if (allowedFields.includes(el)) {
            newObj[el] = obj[el];
        }
    });
    return newObj;
};

exports.registerVendor = catchAsync(async (req, res, next) => {
    const newVendor = await Vendor.create({
        businessName: req.body.businessName,
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
    });
    createSendToken(newVendor, 201, res, 'Account created successfully');
});

exports.loginVendor = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return next(new AppError('Please provide email and password', 400));
    }
    const vendor = await Vendor.findOne({ email }).select('+password');
    if (!vendor || !(await vendor.correctPassword(password, vendor.password))) {
        return next(new AppError('Incorrect email or password', 401));
    }
    createSendToken(vendor, 201, res, 'Login  successful');
});

exports.getVendorDetails = catchAsync(async (req, res, next) => {
    const vendorId = req.params.vendorId || req.vendor.id;
    const vendor = await Vendor.findById(vendorId);
    if (!vendor) {
        return next(new AppError('Could not find vendor', 404));
    }
    vendor.password = undefined;
    vendor.confirmPassword = undefined;
    return ApiResponse(
        201,
        res,
        'Vendor fetched successfully',
        'success',
        vendor
    );
});

exports.updateVendorDetails = catchAsync(async (req, res, next) => {
    if (req.body.password || req.body.confirmPassword) {
        return next(
            new AppError('This is not the route for updating passsword', 400)
        );
    }

    const filteredBody = filterObj(
        req.body,
        'businessName',
        'email',
        'phoneNumber',
        'address',
        'city',
        'state',
        'country',
        'logo',
        'description',
        'coverImage'
    );

    const updatedVendor = await Vendor.findByIdAndUpdate(
        req.vendor.id,
        filteredBody,
        {
            new: true,
            runValidators: true,
        }
    );

    return ApiResponse(
        201,
        res,
        'Vendor details updated successfully',
        'success',
        updatedVendor
    );
});

exports.changeVendorPassword = catchAsync(async (req, res, next) => {
    const { password, newPassword, confirmNewPassword } = req.body;
    const vendor = await Vendor.findById(req.vendor.id).select('+password');

    if (!vendor) {
        return next(new AppError('Vendor not found', 404));
    }

    if (!(await vendor.correctPassword(password, vendor.password))) {
        return next(new AppError('Your current password is wrong', 401));
    }

    vendor.password = newPassword;
    vendor.confirmPassword = confirmNewPassword;
    await vendor.save();

    return ApiResponse(
        201,
        res,
        'Password changed successfully',
        'success',
        null
    );
});

exports.getAllVendor = catchAsync(async (req, res, next) => {
    const vendors = await Vendor.find();
    if (!vendors) {
        return next(new AppError('Could not find any vendor', 400));
    }
    return ApiResponse(
        201,
        res,
        'Vendors fetched successfully',
        'success',
        vendors
    );
});

exports.getPopularVendors = catchAsync(async (req, res, next) => {
    const topVendors = await Order.aggregate([
        {
            $group: {
                _id: '$vendor',
                totalOrders: { $sum: 1 },
            },
        },
        {
            $lookup: {
                from: 'vendors',
                localField: '_id',
                foreignField: '_id',
                as: 'vendor',
            },
        },
        {
            $unwind: '$vendor',
        },
        {
            $project: {
                'vendor.password': 0,
            },
        },
        {
            $sort: { totalOrders: -1 },
        },
        {
            $limit: 12,
        },
    ]);
    if (!topVendors) {
        return next(new AppError('Could not find any vendor', 400));
    }
    return ApiResponse(
        201,
        res,
        'Vendors fetched successfully',
        'success',
        topVendors
    );
});

exports.getVendorStatistics = catchAsync(async (req, res) => {
    const vendorId = req.vendor.id;

    const totalUsers = await calculateTotalUsersForVendor(vendorId);
    const totalSales = await calculateTotalSalesForVendor(vendorId);
    const totalAmount = await calculateTotalAmount(vendorId);
    const totalProducts = await calculateTotalProductsForVendor(vendorId);

    const payload = {
        totalAmount,
        totalProducts,
        totalSales,
        totalUsers,
    };
    return ApiResponse(
        201,
        res,
        'Vendor statistics fetched successfully',
        'success',
        payload
    );
});

exports.getAllMonthSalesAmount = catchAsync(async (req, res) => {
    const vendorId = req.vendor.id;

    const monthlyAmounts = await Order.aggregate([
        {
            $match: { vendor: new mongoose.Types.ObjectId(vendorId) },
        },
        {
            $group: {
                _id: {
                    month: { $month: '$createdAt' },
                    year: { $year: '$createdAt' },
                },
                totalAmount: { $sum: '$totalPrice' },
            },
        },
    ]);

    const currentYear = new Date().getFullYear();
    const labels = [];
    const amounts = Array.from({ length: 12 }, (_, index) => {
        const month = index + 1;
        const match = monthlyAmounts.find(
            (item) => item._id.month === month && item._id.year === currentYear
        );
        const totalAmount = match ? match.totalAmount : 0;
        labels.push(format(new Date(`${currentYear}-${month}-01`), 'MMM'));
        return totalAmount;
    });

    const payload = { labels, amounts };
    return ApiResponse(
        201,
        res,
        'Vendor statistics fetched successfully',
        'success',
        payload
    );
});
