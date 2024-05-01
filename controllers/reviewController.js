const { ApiResponse } = require('../helpers/responseHelper');
const Review = require('../models/reviewModel');
const Product = require('../models/productModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.createReview = catchAsync(async (req, res, next) => {
    const { productId, rating, comment } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
        return next(new AppError('Product not found', 404));
    }

    const review = await Review.create({
        user: req.user.id,
        product: productId,
        rating,
        comment,
    });

    return ApiResponse(
        201,
        res,
        'Review created successfully',
        'success',
        review
    );
});

exports.getReviewsByProduct = catchAsync(async (req, res, next) => {
    const { productId } = req.params;

    const product = await Product.findById(productId);
    if (!product) {
        return next(new AppError('Product not found', 404));
    }

    const reviews = await Review.find({ product: productId }).populate('user');

    return ApiResponse(
        200,
        res,
        'Reviews retrieved successfully',
        'success',
        reviews
    );
});

exports.deleteReview = catchAsync(async (req, res, next) => {
    const { reviewId } = req.params;

    const review = await Review.findByIdAndDelete(reviewId);
    if (!review) {
        return next(new AppError('Review not found', 404));
    }

    return ApiResponse(
        204,
        res,
        'Review deleted successfully',
        'success',
        null
    );
});
