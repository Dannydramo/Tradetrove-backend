import { Request, Response, NextFunction } from 'express';
import catchAsync from './../utils/catchAsync';
import Order from './../models/orderModel';
import AppError from '../utils/appError';
import { ApiResponse } from '../helpers/responseHelper';

declare global {
    namespace Express {
        interface Request {
            vendor?: any;
        }
    }
}

export const getAllOrders = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const orders = await Order.find({ vendor: req.vendor.id }).populate(
            'user products'
        );

        if (!orders) {
            return next(
                new AppError('There is no order associated with you', 404)
            );
        }
        return ApiResponse(
            201,
            res,
            'Orders fetched Successfully',
            'success',
            orders
        );
    }
);
export const getUserOrders = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const orders = await Order.find({ user: req.user.id }).populate(
            'user products'
        );

        if (!orders) {
            return next(
                new AppError('There is no order associated with you', 404)
            );
        }
        return ApiResponse(
            201,
            res,
            'Orders fetched Successfully',
            'success',
            orders
        );
    }
);
