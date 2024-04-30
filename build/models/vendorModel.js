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
const mongoose_1 = __importDefault(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const vendorSchema = new mongoose_1.default.Schema({
    businessName: {
        type: String,
        unique: true,
        required: [true, 'Business name is required'],
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'Email is required'],
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        min: 6,
        select: false,
    },
    confirmPassword: {
        type: String,
        required: [true, 'Confirm Password is required'],
        min: 6,
        validate: {
            validator: function (el) {
                return el === this.password;
            },
            message: 'Password must be the same with Confirm Password',
        },
    },
    logo: String,
    address: String,
    phoneNumber: String,
    city: String,
    state: String,
    country: String,
    description: String,
    coverImage: String,
    active: {
        type: Boolean,
        default: true,
        select: false,
    },
    orders: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'Order',
            select: false,
        },
    ],
    created_at: {
        type: Date,
        default: Date.now,
    },
    updated_at: {
        type: Date,
        default: null,
    },
});
vendorSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!this.isModified('password'))
            return next();
        this.password = yield bcryptjs_1.default.hash(this.password, 12);
        this.confirmPassword = undefined;
        next();
    });
});
vendorSchema.methods.correctPassword = function (candidatePassword, userPassword) {
    return bcryptjs_1.default.compare(candidatePassword, userPassword);
};
vendorSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
    if (this.passwordChangedAt) {
        const changedTimeAt = Math.floor(this.passwordChangedAt.getTime() / 1000);
        return JWTTimestamp < changedTimeAt;
    }
    return false;
};
exports.default = mongoose_1.default.model('Vendor', vendorSchema);
