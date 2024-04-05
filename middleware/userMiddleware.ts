import { Request, Response, NextFunction } from 'express';
import { promisify } from 'util';
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/appError';
import User from '../models/userModel';
import jwt from 'jsonwebtoken';

declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}

interface DecodedToken {
    iat: number;
    id: string;
}

const userProtect = catchAsync(
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
        const decoded = (await promisify(jwt.verify)(
            token
        )) as unknown as DecodedToken;

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

export default userProtect;
