import { Request, Response, NextFunction } from 'express';
import catchAsync from './../utils/catchAsync';
import User from './../models/userModel';
import { createSendToken } from '../utils/createToken';
import AppError from '../utils/appError';

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
