const { ApiResponse } = require('../helpers/responseHelper');
const catchAsync = require('../utils/catchAsync');
const Product = require('../models/productModel');
const AppError = require('../utils/appError');

exports.createProduct = catchAsync(async (req, res, next) => {
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
});

exports.getAllProducts = catchAsync(async (req, res, next) => {
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
});

exports.getProductById = catchAsync(async (req, res, next) => {
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
});

exports.getLatestProduct = catchAsync(async (req, res, next) => {
    const latestProduct = await Product.find()
        .sort({ createdAt: -1 })
        .populate('vendor')
        .limit(4);

    if (!latestProduct) {
        return next(new AppError('No products found', 404));
    }

    return ApiResponse(
        200,
        res,
        'Latest product fetched successfully',
        'success',
        latestProduct
    );
});

exports.getProductsByVendor = catchAsync(async (req, res, next) => {
    const vendorId = req.params.vendorId || req.vendor.id;
    const products = await Product.find({ vendor: vendorId });

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
});

exports.editProduct = catchAsync(async (req, res, next) => {
    const { productId } = req.params;
    const { productName, description, category, price, inStock, images } =
        req.body;

    const updatedProduct = await Product.findByIdAndUpdate(
        productId,
        { productName, description, category, price, inStock, images },
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
});

exports.deleteProduct = catchAsync(async (req, res, next) => {
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
});

exports.getTwoRandomProducts = catchAsync(async (req, res, next) => {
    const randomProducts = await Product.aggregate([
        { $sample: { size: 20 } },
        {
            $lookup: {
                from: 'vendors',
                localField: 'vendor',
                foreignField: '_id',
                as: 'vendorDetails',
            },
        },
        {
            $unwind: '$vendorDetails',
        },
        {
            $project: {
                'vendorDetails.password': 0,
            },
        },
    ]);

    if (!randomProducts.length) {
        return next(new AppError('Could not find any products', 404));
    }

    return ApiResponse(
        200,
        res,
        'Random products from each vendor fetched successfully',
        'success',
        randomProducts
    );
});
