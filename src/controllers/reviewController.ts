import { Request, Response, NextFunction } from 'express';
import Review from '../models/reviewModel';
import Product from '../models/productModel';
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/appError';
import { ApiResponse } from '../helpers/responseHelper';

export const createReview = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
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
    }
);

export const getReviewsByProduct = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const { productId } = req.params;

        const product = await Product.findById(productId);
        if (!product) {
            return next(new AppError('Product not found', 404));
        }

        const reviews = await Review.find({ product: productId }).populate(
            'user'
        );

        return ApiResponse(
            200,
            res,
            'Reviews retrieved successfully',
            'success',
            reviews
        );
    }
);

export const deleteReview = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
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
    }
);
