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
exports.userProtect = exports.vendorProtect = void 0;
const util_1 = require("util");
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const appError_1 = __importDefault(require("../utils/appError"));
const vendorModel_1 = __importDefault(require("../models/vendorModel"));
const userModel_1 = __importDefault(require("../models/userModel"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const verifyToken = (token, secret) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const verifyAsync = (0, util_1.promisify)(jsonwebtoken_1.default.verify);
        const decoded = yield verifyAsync(token, secret);
        return decoded;
    }
    catch (error) {
        throw new appError_1.default('Unauthorized. Please login and try again', 401);
    }
});
exports.vendorProtect = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // 1. Get the token and check if it's there
    let token;
    if (req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
        return next(new appError_1.default('You are not logged in. Please log in to get access', 401));
    }
    // 2. Verify the token
    const decoded = yield verifyToken(token, process.env.JWT_SECRET);
    // 3. Check if user exists
    const currentVendor = yield vendorModel_1.default.findById(decoded.id);
    if (!currentVendor) {
        return next(new appError_1.default('The user does not exist', 401));
    }
    // 4. Check if user changed password after token was issued
    if (currentVendor.changedPasswordAfter(decoded.iat)) {
        return next(new appError_1.default('User recently changed password. Please log in again', 401));
    }
    req.vendor = currentVendor;
    next();
}));
exports.userProtect = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // 1. Get the token and checks if it's there
    let token;
    if (req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
        return next(new appError_1.default('You are not logged in. Please log in to get access', 401));
    }
    // 2. Verification of token
    const decoded = yield verifyToken(token, process.env.JWT_SECRET);
    // 3. Checks if user exists
    const currentUser = yield userModel_1.default.findById(decoded.id);
    if (!currentUser) {
        return next(new appError_1.default('The user does not longer exist', 401));
    }
    // 4. Checks if user changed password after token was issued
    if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next(new appError_1.default('User recently changed password. Please login again', 401));
    }
    req.user = currentUser;
    next();
}));
