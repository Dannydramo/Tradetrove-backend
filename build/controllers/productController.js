"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.editProduct = exports.getProductsByVendor = exports.getProductById = exports.getAllProducts = exports.createProduct = void 0;
const catchAsync_1 = __importDefault(require("./../utils/catchAsync"));
const productModel_1 = __importDefault(require("./../models/productModel"));
const appError_1 = __importDefault(require("../utils/appError"));
const responseHelper_1 = require("../helpers/responseHelper");
exports.createProduct = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { productName, description, category, price, inStock, images } = req.body;
    const newProduct = yield productModel_1.default.create({
        productName,
        description,
        category,
        price,
        inStock,
        images,
        vendor: req.vendor.id,
    });
    if (newProduct) {
        return (0, responseHelper_1.ApiResponse)(201, res, 'Product created Successfully', 'success', newProduct);
    }
    else {
        return next(new appError_1.default('Failed to create product', 500));
    }
}));
exports.getAllProducts = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const products = yield productModel_1.default.find().populate('vendor');
    if (!products) {
        return next(new appError_1.default('Could not find any product', 400));
    }
    return (0, responseHelper_1.ApiResponse)(201, res, 'Products fetched Successfully', 'success', products);
}));
exports.getProductById = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { productId } = req.params;
    const product = yield productModel_1.default.findById(productId)
        .populate('vendor');
    // .populate('reviews');
    if (!product) {
        return next(new appError_1.default('Could not find product details', 400));
    }
    return (0, responseHelper_1.ApiResponse)(201, res, 'Product fetched Successfully', 'success', product);
}));
exports.getProductsByVendor = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const vendorId = req.params.vendorId || req.vendor.id;
    const products = yield productModel_1.default.find({ vendor: vendorId });
    if (!products) {
        return next(new appError_1.default('Could not find any product related to the vendor', 404));
    }
    return (0, responseHelper_1.ApiResponse)(201, res, 'Products fetched Successfully', 'success', products);
}));
exports.editProduct = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { productId } = req.params;
    const { productName, description, category, price, inStock, images } = req.body;
    const updatedProduct = yield productModel_1.default.findByIdAndUpdate(productId, { productName, description, category, price, inStock, images }, { new: true });
    if (!updatedProduct) {
        return next(new appError_1.default('Failed to update product', 500));
    }
    return (0, responseHelper_1.ApiResponse)(201, res, 'Product updated Successfully', 'success', updatedProduct);
}));
exports.deleteProduct = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { productId } = req.params;
    const deletedProduct = yield productModel_1.default.findByIdAndDelete(productId);
    if (!deletedProduct) {
        return next(new appError_1.default('Could not find the product to be deleted', 400));
    }
    return (0, responseHelper_1.ApiResponse)(201, res, 'Product deleted Successfully', 'success', null);
}));
