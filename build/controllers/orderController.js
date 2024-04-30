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
exports.getUserOrders = exports.getAllOrders = void 0;
const catchAsync_1 = __importDefault(require("./../utils/catchAsync"));
const orderModel_1 = __importDefault(require("./../models/orderModel"));
const appError_1 = __importDefault(require("../utils/appError"));
const responseHelper_1 = require("../helpers/responseHelper");
exports.getAllOrders = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const orders = yield orderModel_1.default.find({ vendor: req.vendor.id }).populate('user products');
    if (!orders) {
        return next(new appError_1.default('There is no order associated with you', 404));
    }
    return (0, responseHelper_1.ApiResponse)(201, res, 'Orders fetched Successfully', 'success', orders);
}));
exports.getUserOrders = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const orders = yield orderModel_1.default.find({ user: req.user.id }).populate('user products');
    if (!orders) {
        return next(new appError_1.default('There is no order associated with you', 404));
    }
    return (0, responseHelper_1.ApiResponse)(201, res, 'Orders fetched Successfully', 'success', orders);
}));
