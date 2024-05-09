const catchAsync = require('../utils/catchAsync');
const Wishlist = require('../models/wishlistModel');
const AppError = require('../utils/appError');
const { ApiResponse } = require('../helpers/responseHelper');

exports.getUserWishlist = catchAsync(async (req, res, next) => {
    const userId = req.user.id;

    const wishlist = await Wishlist.find({ user: userId }).populate('product');
    return ApiResponse(
        200,
        res,
        'Wishlist fetched successully',
        'success',
        wishlist
    );
});
exports.addToWishlist = catchAsync(async (req, res, next) => {
    const { productId } = req.body;
    const userId = req.user.id;

    const existingWishlistItem = await Wishlist.findOne({
        user: userId,
        product: productId,
    });

    if (existingWishlistItem) {
        return next(new AppError('Product already in wishlist', 400));
    }

    const wishlist = await Wishlist.create({
        user: userId,
        product: productId,
    });

    return ApiResponse(
        201,
        res,
        'Product added to wishlist',
        'success',
        wishlist
    );
});

exports.removeFromWishlist = catchAsync(async (req, res, next) => {
    const { productId } = req.params;
    const userId = req.user.id;

    const existingWishlistItem = await Wishlist.findOneAndDelete({
        user: userId,
        product: productId,
    });

    if (!existingWishlistItem) {
        return next(new AppError('Product not found in wishlist', 404));
    }
    return ApiResponse(
        204,
        res,
        'Product removed from wishlist',
        'success',
        null
    );
});

exports.fetchProductWishlistStatus = catchAsync(async (req, res, next) => {
    const { productId } = req.params;
    const userId = req.user.id;

    const wishlist = await Wishlist.findOne({
        product: productId,
        user: userId,
    });

    if (!wishlist) {
        res.status(200).json({
            status: 'success',
            data: { wishlist: false },
        });
    } else {
        res.status(200).json({
            status: 'success',
            data: { wishlist: true },
        });
    }
});
