const { ApiResponse } = require('../helpers/responseHelper');
const catchAsync = require('../utils/catchAsync');
const Vendor = require('../models/vendorModel');
const User = require('../models/userModel');
const { createSendToken } = require('../utils/createToken');
const AppError = require('../utils/appError');
const {
    calculateTotalProductsForVendor,
    calculateTotalSalesForVendor,
    calculateTotalUsersForVendor,
} = require('../helpers/vendorHelper');
const { format } = require('date-fns');
const Order = require('../models/orderModel');
const mongoose = require('mongoose');
const sendEmail = require('../utils/email');

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
    const { businessName, email, password, confirmPassword } = req.body;
    if (!businessName || !email || !password || !confirmPassword) {
        return next(new AppError('Please provide all your details', 400));
    }
    const newVendor = await Vendor.create({
        businessName,
        email,
        password,
        confirmPassword,
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

exports.logOutVendor = catchAsync(async (req, res, next) => {
    res.clearCookie('token', {
        httpOnly: true,
        sameSite: 'none',
        partition: true,
        secure: true,
    });
    return ApiResponse(201, res, 'Logged out successfully', 'success', null);
});

exports.forgotVendorPassword = catchAsync(async (req, res, next) => {
    const { email } = req.body;
    const vendor = await Vendor.findOne({ email });
    if (!vendor) {
        return next(new AppError('There is no user with this email', 404));
    }

    const resetToken = vendor.createPasswordResetToken();
    await vendor.save({ validateBeforeSave: false });

    let frontendUrl;

    if (process.env.NODE_ENV === 'production') {
        frontendUrl = 'https://tradetrove-admin.vercel.app';
    } else {
        frontendUrl = 'http://localhost:3000' || 'http://localhost:3001';
    }

    const resetUrl = `${frontendUrl}/reset-password/${resetToken}`;

    const message = `
    <p>Forgot your password? Submit a patch request with your new password to the following link:</p>
    <p><a target="_blank" href="${resetUrl}">Reset Password</a></p>
    <p>If you didn't forget your password, please ignore this email.</p>
`;

    try {
        await sendEmail({
            email: vendor.email,
            subject: 'Your password reset token (Valid for 10 minutes)',
            message,
        });
        res.status(200).json({
            status: 'success',
            message: 'Please check your email for link to reset your password',
        });
    } catch (error) {
        (vendor.passwordResetToken = undefined),
            (vendor.passwordResetExpires = undefined);
        await vendor.save({ validateBeforeSave: false });

        return next(
            new AppError(
                'There was an error sending the email please try again later',
                500
            )
        );
    }
});

exports.resetVendorPassword = catchAsync(async (req, res, next) => {
    const hashedToken = crypto
        .createHash('sha256')
        .update(req.params.token)
        .digest('hex');

    const vendor = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() },
    });

    if (!vendor) {
        return next(new AppError('Token is invalid or has expired', 400));
    }

    vendor.password = req.body.password;
    vendor.confirmPassword = req.body.confirmPassword;
    vendor.passwordResetToken = undefined;
    vendor.passwordResetExpires = undefined;

    await vendor.save();
    createSendToken(vendor, 200, res);
});

exports.updateVendorPassword = catchAsync(async (req, res, next) => {
    const vendor = await Vendor.findById(req.vendor.id).select('+password');

    if (
        !(await vendor.correctPassword(
            req.body.passwordCurrent,
            vendor.password
        ))
    ) {
        return next(new AppError('Your current password is wrong', 401));
    }

    vendor.password = req.body.password;
    vendor.confirmPassword = req.body.confirmPassword;
    await vendor.save();
    createSendToken(vendor, 200, res, 'Password updated sucessfull');
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
            $limit: 8,
        },
    ]);
    if (!topVendors) {
        return next(new AppError('Could not find any vendor', 400));
    }
    if (topVendors.length === 0) {
        const vendors = await Vendor.find({
            logo: { $exists: true, $ne: null, $ne: '' },
            phoneNumber: { $exists: true, $ne: null, $ne: '' },
        }).limit(10);
        return ApiResponse(
            201,
            res,
            'Vendors fetched successfully',
            'success',
            vendors
        );
    }
    return ApiResponse(
        201,
        res,
        'Vendors fetched successfully',
        'success',
        topVendors.vendor
    );
});

exports.getVendorStatistics = catchAsync(async (req, res) => {
    const vendorId = req.vendor.id;

    const totalUsers = await calculateTotalUsersForVendor(vendorId);
    const totalSales = await calculateTotalSalesForVendor(vendorId);
    const totalProducts = await calculateTotalProductsForVendor(vendorId);

    const payload = {
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

exports.userById = catchAsync(async (req, res, next) => {
    const { userId } = req.query;

    const user = await User.findById(userId);

    if (!user) {
        return next(new AppError('User not found', 404));
    }

    return ApiResponse(201, res, 'User fetched successfully', 'success', user);
});
