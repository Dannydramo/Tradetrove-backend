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
exports.deleteReview = exports.getReviewsByProduct = exports.createReview = void 0;
const reviewModel_1 = __importDefault(require("../models/reviewModel"));
const productModel_1 = __importDefault(require("../models/productModel"));
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const appError_1 = __importDefault(require("../utils/appError"));
const responseHelper_1 = require("../helpers/responseHelper");
exports.createReview = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { productId, rating, comment } = req.body;
    const product = yield productModel_1.default.findById(productId);
    if (!product) {
        return next(new appError_1.default('Product not found', 404));
    }
    const review = yield reviewModel_1.default.create({
        user: req.user.id,
        product: productId,
        rating,
        comment,
    });
    return (0, responseHelper_1.ApiResponse)(201, res, 'Review created successfully', 'success', review);
}));
exports.getReviewsByProduct = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { productId } = req.params;
    const product = yield productModel_1.default.findById(productId);
    if (!product) {
        return next(new appError_1.default('Product not found', 404));
    }
    const reviews = yield reviewModel_1.default.find({ product: productId }).populate('user');
    return (0, responseHelper_1.ApiResponse)(200, res, 'Reviews retrieved successfully', 'success', reviews);
}));
exports.deleteReview = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { reviewId } = req.params;
    const review = yield reviewModel_1.default.findByIdAndDelete(reviewId);
    if (!review) {
        return next(new appError_1.default('Review not found', 404));
    }
    return (0, responseHelper_1.ApiResponse)(204, res, 'Review deleted successfully', 'success', null);
}));
