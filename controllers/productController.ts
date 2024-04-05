import { Request, Response, NextFunction } from 'express';
import catchAsync from './../utils/catchAsync';
import Product from './../models/productModel';
import Vendor from './../models/vendorModel';
import AppError from '../utils/appError';
import { ApiResponse } from '../helpers/responseHelper';

declare global {
    namespace Express {
        interface Request {
            vendor?: any;
        }
    }
}

export const createProduct = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const { productName, description, category, price, inStock, images } =
            req.body;
        const newProduct = await Product.create({
            productName,
            description,
            category,
            price,
            inStock,
            images,
            vendor: req.vendor.id,
        });

        if (newProduct) {
            return ApiResponse(
                201,
                res,
                'Product created Successfully',
                'success',
                newProduct
            );
        } else {
            return next(new AppError('Failed to create product', 500));
        }
    }
);

export const getAllProducts = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const products = await Product.find().populate('vendor');
        if (!products) {
            return next(new AppError('Could not find any product', 400));
        }
        return ApiResponse(
            201,
            res,
            'Products fetched Successfully',
            'success',
            products
        );
    }
);

export const getProductById = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const { productId } = req.params;
        const product = await Product.findById(productId).populate('vendor');
        if (!product) {
            return next(new AppError('Could not find product details', 400));
        }

        return ApiResponse(
            201,
            res,
            'Product fetched Successfully',
            'success',
            product
        );
    }
);

export const getProductsByVendor = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const products = await Product.find({ vendor: req.vendor.id });

        if (!products) {
            return next(
                new AppError(
                    'Could not find any product related to the vendor',
                    404
                )
            );
        }
        return ApiResponse(
            201,
            res,
            'Products fetched Successfully',
            'success',
            products
        );
    }
);

export const editProduct = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const { productId } = req.params;
        const { productName, description, category, price, quantity, images } =
            req.body;

        const updatedProduct = await Product.findByIdAndUpdate(
            productId,
            { productName, description, category, price, quantity, images },
            { new: true }
        );
        if (!updatedProduct) {
            return next(new AppError('Failed to update product', 500));
        }
        return ApiResponse(
            201,
            res,
            'Product updated Successfully',
            'success',
            updatedProduct
        );
    }
);

export const deleteProduct = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const { productId } = req.params;
        const deletedProduct = await Product.findByIdAndDelete(productId);
        if (!deletedProduct) {
            return next(
                new AppError('Could not find the product to be deleted', 400)
            );
        }
        return ApiResponse(
            201,
            res,
            'Product deleted Successfully',
            'success',
            null
        );
    }
);
