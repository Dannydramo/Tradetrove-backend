const { ApiResponse } = require('../helpers/responseHelper');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/userModel');
const Vendor = require('../models/vendorModel');
const Product = require('../models/productModel');
const { createSendToken } = require('../utils/createToken');
const AppError = require('../utils/appError');
const sendEmail = require('../utils/email');

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

exports.forgotUserPassword = catchAsync(async (req, res, next) => {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
        return next(new AppError('There is no user with this email', 404));
    }

    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    let frontendUrl;

    if (process.env.NODE_ENV === 'production') {
        frontendUrl = 'https://tradetrove.vercel.app';
    } else {
        frontendUrl = 'http://localhost:3001';
    }

    const resetUrl = `${frontendUrl}/reset-password/${resetToken}`;

    const message = `
    <p>Forgot your password? Submit a patch request with your new password to the following link:</p>
    <p><a target="_blank" href="${resetUrl}">Reset Password</a></p>
    <p>If you didn't forget your password, please ignore this email.</p>
`;

    try {
        await sendEmail({
            email: user.email,
            subject: 'Your password reset token (Valid for 10 minutes)',
            message,
        });
        res.status(200).json({
            status: 'success',
            message: 'Please check your email for link to reset your password',
        });
    } catch (error) {
        (user.passwordResetToken = undefined),
            (user.passwordResetExpires = undefined);
        await user.save({ validateBeforeSave: false });

        return next(
            new AppError(
                'There was an error sending the email please try again later',
                500
            )
        );
    }
});

exports.resetUserPassword = catchAsync(async (req, res, next) => {
    const hashedToken = crypto
        .createHash('sha256')
        .update(req.params.token)
        .digest('hex');

    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
        return next(new AppError('Token is invalid or has expired', 400));
    }

    user.password = req.body.password;
    user.confirmPassword = req.body.confirmPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save();
    createSendToken(user, 200, res);
});

exports.updateUserPassword = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.user.id).select('+password');

    if (
        !(await user.correctPassword(req.body.passwordCurrent, user.password))
    ) {
        return next(new AppError('Your current password is wrong', 401));
    }

    user.password = req.body.password;
    user.confirmPassword = req.body.confirmPassword;
    await user.save();
    createSendToken(user, 200, res, 'Password updated sucessfull');
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

exports.changeUserPassword = catchAsync(async (req, res, next) => {
    const { password, newPassword, confirmNewPassword } = req.body;
    const user = await User.findById(req.user.id).select('+password');

    if (!user) {
        return next(new AppError('Vendor not found', 404));
    }

    if (!(await user.correctPassword(password, user.password))) {
        return next(new AppError('Your current password is wrong', 401));
    }

    user.password = newPassword;
    user.confirmPassword = confirmNewPassword;
    await user.save();

    return ApiResponse(
        201,
        res,
        'Password changed successfully',
        'success',
        null
    );
});

exports.logOutUser = catchAsync(async (req, res, next) => {
    res.clearCookie('token', {
        httpOnly: true,
        sameSite: 'none',
        partition: true,
        secure: true,
    });
    return ApiResponse(201, res, 'Logged out successfully', 'success', null);
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
