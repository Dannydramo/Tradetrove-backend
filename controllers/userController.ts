import { Request, Response, NextFunction } from 'express';
import catchAsync from './../utils/catchAsync';
import User from './../models/userModel';
import Vendor from './../models/vendorModel';
import { createSendToken } from '../utils/createToken';
import AppError from '../utils/appError';
import { ApiResponse } from '../helpers/responseHelper';
import { FilterQuery } from 'mongoose';
import { VendorTypes } from '../types/VendorInterface';

export const registerUser = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const newUser = await User.create({
            username: req.body.userName,
            email: req.body.email,
            password: req.body.password,
            confirmPassword: req.body.confirmPassword,
        });
        createSendToken(newUser, 201, res, 'Account created successfully');
    }
);

export const loginUser = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const { email, password } = req.body;
        if (!email || !password) {
            return next(new AppError('Please provide email and password', 400));
        }
        const user = await User.findOne({ email }).select('+password');
        if (!user || !(await user.correctPassword(password, user.password))) {
            return next(new AppError('Incorrect email or password', 401));
        }
        createSendToken(user, 201, res, 'Account created successfully');
    }
);

export const vendorByBusinessName = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const { businessName, vendorId } = req.query;

        const vendor = businessName
            ? await Vendor.findOne({ businessName } as FilterQuery<VendorTypes>)
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
    }
);
