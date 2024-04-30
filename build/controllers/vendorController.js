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
exports.getAllMonthSalesAmount = exports.getVendorStatistics = exports.getAllVendor = exports.changeVendorPassword = exports.updateVendorDetails = exports.getVendorDetails = exports.loginVendor = exports.registerVendor = void 0;
const catchAsync_1 = __importDefault(require("./../utils/catchAsync"));
const vendorModel_1 = __importDefault(require("./../models/vendorModel"));
const createToken_1 = require("../utils/createToken");
const appError_1 = __importDefault(require("../utils/appError"));
const responseHelper_1 = require("../helpers/responseHelper");
const vendorHelper_1 = require("../helpers/vendorHelper");
const date_fns_1 = require("date-fns");
const orderModel_1 = __importDefault(require("./../models/orderModel"));
const mongoose_1 = __importDefault(require("mongoose"));
const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach((el) => {
        if (allowedFields.includes(el)) {
            newObj[el] = obj[el];
        }
    });
    return newObj;
};
exports.registerVendor = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const newVendor = yield vendorModel_1.default.create({
        businessName: req.body.businessName,
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
    });
    (0, createToken_1.createSendToken)(newVendor, 201, res, 'Account created successfully');
}));
exports.loginVendor = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password) {
        return next(new appError_1.default('Please provide email and password', 400));
    }
    const vendor = yield vendorModel_1.default.findOne({ email }).select('+password');
    if (!vendor ||
        !(yield vendor.correctPassword(password, vendor.password))) {
        return next(new appError_1.default('Incorrect email or password', 401));
    }
    (0, createToken_1.createSendToken)(vendor, 201, res, 'Login  successful');
}));
exports.getVendorDetails = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const vendorId = req.params.vendorId || req.vendor.id;
    const vendor = yield vendorModel_1.default.findById(vendorId);
    if (!vendor) {
        return next(new appError_1.default('Could not find vendor', 404));
    }
    vendor.password = undefined;
    vendor.confirmPassword = undefined;
    return (0, responseHelper_1.ApiResponse)(201, res, 'Vendor fetched successfully', 'success', vendor);
}));
exports.updateVendorDetails = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.body.password || req.body.confirmPassword) {
        return next(new appError_1.default('This is not the route for updating passsword', 400));
    }
    const filteredBody = filterObj(req.body, 'businessName', 'email', 'phoneNumber', 'address', 'city', 'state', 'country', 'logo', 'description', 'coverImage');
    const updatedVendor = yield vendorModel_1.default.findByIdAndUpdate(req.vendor.id, filteredBody, {
        new: true,
        runValidators: true,
    });
    return (0, responseHelper_1.ApiResponse)(201, res, 'Vendor details updated successfully', 'success', updatedVendor);
}));
exports.changeVendorPassword = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { password, newPassword, confirmNewPassword } = req.body;
    const vendor = yield vendorModel_1.default.findById(req.vendor.id).select('+password');
    if (!vendor) {
        return next(new appError_1.default('Vendor not found', 404));
    }
    if (!(yield vendor.correctPassword(password, vendor.password))) {
        return next(new appError_1.default('Your current password is wrong', 401));
    }
    vendor.password = newPassword;
    vendor.confirmPassword = confirmNewPassword;
    yield vendor.save();
    return (0, responseHelper_1.ApiResponse)(201, res, 'Password changed successfully', 'success', null);
}));
exports.getAllVendor = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const vendors = yield vendorModel_1.default.find();
    if (!vendors) {
        return next(new appError_1.default('Could not find any vendor', 400));
    }
    return (0, responseHelper_1.ApiResponse)(201, res, 'Vendors fetched successfully', 'success', vendors);
}));
exports.getVendorStatistics = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const vendorId = req.vendor.id;
    const totalUsers = yield (0, vendorHelper_1.calculateTotalUsersForVendor)(vendorId);
    const totalSales = yield (0, vendorHelper_1.calculateTotalSalesForVendor)(vendorId);
    const totalAmount = yield (0, vendorHelper_1.calculateTotalAmount)(vendorId);
    const totalProducts = yield (0, vendorHelper_1.calculateTotalProductsForVendor)(vendorId);
    const payload = {
        totalAmount,
        totalProducts,
        totalSales,
        totalUsers,
    };
    return (0, responseHelper_1.ApiResponse)(201, res, 'Vendor statistics fetched successfully', 'success', payload);
}));
exports.getAllMonthSalesAmount = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const vendorId = req.vendor.id;
    const monthlyAmounts = yield orderModel_1.default.aggregate([
        {
            $match: { vendor: new mongoose_1.default.Types.ObjectId(vendorId) },
        },
        {
            $group: {
                _id: {
                    month: { $month: '$createdAt' },
                    year: { $year: '$createdAt' },
                },
                totalAmount: { $sum: '$totalPrice' },
            },
        },
    ]);
    const currentYear = new Date().getFullYear();
    const labels = [];
    const amounts = Array.from({ length: 12 }, (_, index) => {
        const month = index + 1;
        const match = monthlyAmounts.find((item) => item._id.month === month && item._id.year === currentYear);
        const totalAmount = match ? match.totalAmount : 0;
        labels.push((0, date_fns_1.format)(new Date(`${currentYear}-${month}-01`), 'MMM'));
        return totalAmount;
    });
    const payload = { labels, amounts };
    return (0, responseHelper_1.ApiResponse)(201, res, 'Vendor statistics fetched successfully', 'success', payload);
}));
