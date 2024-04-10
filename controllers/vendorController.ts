import { Request, Response, NextFunction } from 'express';
import catchAsync from './../utils/catchAsync';
import Vendor from './../models/vendorModel';
import { createSendToken } from '../utils/createToken';
import AppError from '../utils/appError';
import { VendorFilteredBody } from '../types/VendorInterface';
import { ApiResponse } from '../helpers/responseHelper';
import {
    calculateTotalAmount,
    calculateTotalProductsForVendor,
    calculateTotalSalesForVendor,
    calculateTotalUsersForVendor,
} from '../helpers/vendorHelper';
import { format } from 'date-fns';
import Order from './../models/orderModel';
declare global {
    namespace Express {
        interface Request {
            vendor?: any;
        }
    }
}

const filterObj = (
    obj: any,
    ...allowedFields: (keyof VendorFilteredBody)[]
): VendorFilteredBody => {
    const newObj: VendorFilteredBody = {};
    Object.keys(obj).forEach((el) => {
        if (allowedFields.includes(el as keyof VendorFilteredBody)) {
            newObj[el as keyof VendorFilteredBody] = obj[el];
        }
    });
    return newObj;
};

export const registerVendor = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const newVendor = await Vendor.create({
            businessName: req.body.businessName,
            email: req.body.email,
            password: req.body.password,
            confirmPassword: req.body.confirmPassword,
        });
        createSendToken(newVendor, 201, res, 'Account created successfully');
    }
);

export const loginVendor = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const { email, password } = req.body;
        if (!email || !password) {
            return next(new AppError('Please provide email and password', 400));
        }
        const vendor = await Vendor.findOne({ email }).select('+password');
        if (
            !vendor ||
            !(await vendor.correctPassword(password, vendor.password!))
        ) {
            return next(new AppError('Incorrect email or password', 401));
        }
        createSendToken(vendor, 201, res, 'Login  successful');
    }
);

export const getVendorDetails = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const vendor = await Vendor.findById(req.vendor.id);
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
    }
);

export const updateVendorDetails = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        if (req.body.password || req.body.confirmPassword) {
            return next(
                new AppError(
                    'This is not the route for updating passsword',
                    400
                )
            );
        }

        const filteredBody: VendorFilteredBody = filterObj(
            req.body,
            'businessName',
            'email',
            'phoneNumber',
            'address',
            'city',
            'state',
            'country',
            'logo'
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
    }
);

export const changeVendorPassword = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const { password, newPassword, confirmNewPassword } = req.body;
        const vendor = await Vendor.findById(req.vendor.id).select('+password');

        if (!vendor) {
            return next(new AppError('Vendor not found', 404));
        }

        if (!(await vendor.correctPassword(password, vendor.password!))) {
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
    }
);

export const getAllVendor = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const vendors = await Vendor.find();
        if (!vendors) {
            return next(new AppError('Could not find any vendor', 400));
        }
        return ApiResponse(
            201,
            res,
            'Vendors fetches successfully',
            'success',
            vendors
        );
    }
);
export const getVendorStatistics = catchAsync(
    async (req: Request, res: Response) => {
        const vendorId = req.vendor.id;

        const totalUsers = await calculateTotalUsersForVendor(vendorId);
        const totalSales = await calculateTotalSalesForVendor(vendorId);
        const totalAmount = await calculateTotalAmount();
        const totalProducts = await calculateTotalProductsForVendor(vendorId);

        const payload = {
            totalAmount,
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
    }
);

export const getAllMonthSalesAmount = catchAsync(
    async (req: Request, res: Response) => {
        const vendorId = req.vendor.id;

        const monthlyAmounts = await Order.aggregate([
            { $match: { vendor: vendorId } },
            {
                $group: {
                    _id: {
                        $dateToString: {
                            format: '%m-%Y',
                            date: '$createdAt',
                        },
                    },
                    totalAmount: { $sum: '$totalPrice' },
                },
            },
        ]);

        const allMonths = Array.from({ length: 12 }, (_, index) => index + 1);

        const data = allMonths.map((month) => {
            const monthStr = month.toString().padStart(2, '0');
            const yearStr = new Date().getFullYear();
            const label = format(new Date(`${yearStr}-${monthStr}-01`), 'MMM');
            const match = monthlyAmounts.find((item) => {
                const [foundMonth, foundYear] = item._id.split('-');
                return parseInt(foundMonth) === month && foundYear === yearStr;
            });
            const totalAmount = match ? match.totalAmount : 0;
            return { label, totalAmount };
        });

        const labels = data.map((item) => item.label);
        const amounts = data.map((item) => item.totalAmount);
        const payload = {
            labels,
            amounts,
        };

        return ApiResponse(
            201,
            res,
            'Vendor statistics fetched successfully',
            'success',
            payload
        );
    }
);
