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
exports.vendorByBusinessName = exports.getUserdetails = exports.loginUser = exports.registerUser = void 0;
const catchAsync_1 = __importDefault(require("./../utils/catchAsync"));
const userModel_1 = __importDefault(require("./../models/userModel"));
const vendorModel_1 = __importDefault(require("./../models/vendorModel"));
const createToken_1 = require("../utils/createToken");
const appError_1 = __importDefault(require("../utils/appError"));
const responseHelper_1 = require("../helpers/responseHelper");
exports.registerUser = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const newUser = yield userModel_1.default.create({
        username: req.body.userName,
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
    });
    (0, createToken_1.createSendToken)(newUser, 201, res, 'Account created successfully');
}));
exports.loginUser = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password) {
        return next(new appError_1.default('Please provide email and password', 400));
    }
    const user = yield userModel_1.default.findOne({ email }).select('+password');
    if (!user || !(yield user.correctPassword(password, user.password))) {
        return next(new appError_1.default('Incorrect email or password', 401));
    }
    (0, createToken_1.createSendToken)(user, 201, res, 'Account created successfully');
}));
exports.getUserdetails = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.userId || req.user.id;
    const user = yield userModel_1.default.findById(userId);
    if (!user) {
        return next(new appError_1.default('Could not find user', 404));
    }
    user.password = undefined;
    user.confirmPassword = undefined;
    return (0, responseHelper_1.ApiResponse)(201, res, 'user fetched successfully', 'success', user);
}));
exports.vendorByBusinessName = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { businessName, vendorId } = req.query;
    const vendor = businessName
        ? yield vendorModel_1.default.findOne({ businessName })
        : yield vendorModel_1.default.findById(vendorId);
    if (!vendor) {
        return next(new appError_1.default('Vendor not found', 404));
    }
    return (0, responseHelper_1.ApiResponse)(201, res, 'Vendor fetched successfully', 'success', vendor);
}));
