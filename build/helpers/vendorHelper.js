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
exports.calculateTotalProductsForVendor = exports.calculateTotalAmount = exports.calculateTotalSalesForVendor = exports.calculateTotalUsersForVendor = void 0;
const productModel_1 = __importDefault(require("./../models/productModel"));
const orderModel_1 = __importDefault(require("./../models/orderModel"));
const mongoose_1 = __importDefault(require("mongoose"));
const calculateTotalUsersForVendor = (vendorId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const totalUsersResult = yield orderModel_1.default.aggregate([
            { $match: { vendor: new mongoose_1.default.Types.ObjectId(vendorId) } },
            { $group: { _id: '$user' } },
            { $count: 'totalUsers' },
        ]);
        return totalUsersResult.length > 0 ? totalUsersResult[0].totalUsers : 0;
    }
    catch (error) {
        console.error('Error calculating total users for vendor:', error);
        throw new Error('Failed to calculate total users for vendor');
    }
});
exports.calculateTotalUsersForVendor = calculateTotalUsersForVendor;
const calculateTotalSalesForVendor = (vendorId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const totalSalesResult = yield orderModel_1.default.aggregate([
            { $match: { vendor: new mongoose_1.default.Types.ObjectId(vendorId) } },
            { $group: { _id: null, totalSales: { $sum: '$totalPrice' } } },
        ]);
        return totalSalesResult.length > 0 ? totalSalesResult[0].totalSales : 0;
    }
    catch (error) {
        console.error('Error calculating total sales for vendor:', error);
        throw new Error('Failed to calculate total sales for vendor');
    }
});
exports.calculateTotalSalesForVendor = calculateTotalSalesForVendor;
const calculateTotalAmount = (vendorId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const totalAmountResult = yield orderModel_1.default.aggregate([
            { $match: { vendor: vendorId } },
            { $group: { _id: null, totalAmount: { $sum: '$totalPrice' } } },
        ]);
        return totalAmountResult.length > 0
            ? totalAmountResult[0].totalAmount
            : 0;
    }
    catch (error) {
        console.error('Error calculating total amount:', error);
        throw new Error('Failed to calculate total amount');
    }
});
exports.calculateTotalAmount = calculateTotalAmount;
const calculateTotalProductsForVendor = (vendorId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const totalProducts = yield productModel_1.default.countDocuments({
            vendor: vendorId,
        });
        return totalProducts;
    }
    catch (error) {
        console.error('Error calculating total products for vendor:', error);
        throw new Error('Failed to calculate total products for vendor');
    }
});
exports.calculateTotalProductsForVendor = calculateTotalProductsForVendor;
