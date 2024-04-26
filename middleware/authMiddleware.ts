import { Request, Response, NextFunction } from 'express';
import { promisify } from 'util';
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/appError';
import Vendor from '../models/vendorModel';
import User from '../models/userModel';
import jwt from 'jsonwebtoken';

declare global {
    namespace Express {
        interface Request {
            vendor?: any;
            user?: any;
        }
    }
}

interface DecodedToken {
    iat: number;
    id: string;
}

type VerifyAsyncFunction = (
    token: string,
    secretOrPublicKey: jwt.Secret,
    options?: jwt.VerifyOptions
) => Promise<any>;

const verifyToken = async (token: string, secret: string): Promise<any> => {
    try {
        const verifyAsync: VerifyAsyncFunction = promisify(jwt.verify);
        const decoded = await verifyAsync(token, secret);
        return decoded;
    } catch (error) {
        throw new AppError('Unauthorized. Please login and try again', 401);
    }
};

export const vendorProtect = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        // 1. Get the token and check if it's there
        let token;
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer')
        ) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return next(
                new AppError(
                    'You are not logged in. Please log in to get access',
                    401
                )
            );
        }

        // 2. Verify the token
        const decoded = await verifyToken(token, process.env.JWT_SECRET!);

        // 3. Check if user exists
        const currentVendor = await Vendor.findById(decoded.id);

        if (!currentVendor) {
            return next(new AppError('The user does not exist', 401));
        }
        // 4. Check if user changed password after token was issued
        if (currentVendor.changedPasswordAfter(decoded.iat)) {
            return next(
                new AppError(
                    'User recently changed password. Please log in again',
                    401
                )
            );
        }

        req.vendor = currentVendor;
        next();
    }
);

export const userProtect = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        // 1. Get the token and checks if it's there
        let token;
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer')
        ) {
            token = req.headers.authorization.split(' ')[1];
        }
        if (!token) {
            return next(
                new AppError(
                    'You are not logged in. Please log in to get access',
                    401
                )
            );
        }
        // 2. Verification of token
        const decoded = await verifyToken(token, process.env.JWT_SECRET!);
        // 3. Checks if user exists
        const currentUser = await User.findById(decoded.id);
        if (!currentUser) {
            return next(new AppError('The user does not longer exist', 401));
        }
        // 4. Checks if user changed password after token was issued
        if (currentUser.changedPasswordAfter(decoded.iat)) {
            return next(
                new AppError(
                    'User recently changed password. Please login again',
                    401
                )
            );
        }

        req.user = currentUser;
        next();
    }
);
