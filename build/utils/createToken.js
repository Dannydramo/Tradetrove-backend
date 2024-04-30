"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSendToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const signJwt = (id) => {
    return jsonwebtoken_1.default.sign({ id: id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRESIN,
    });
};
const createSendToken = (user, statusCode, res, message) => {
    const token = signJwt(user._id);
    const cookiesOption = {
        expires: new Date(Date.now() +
            Number(process.env.JWT_COOKIE_EXPIRES_IN) * 60 * 60 * 1000),
        httpOnly: true,
    };
    if (process.env.NODE_ENV === 'production')
        cookiesOption.secure = true;
    res.cookie('token', token, cookiesOption);
    user.password = undefined;
    res.status(statusCode).json({
        status: 'success',
        token,
        message,
        data: {
            user,
        },
    });
};
exports.createSendToken = createSendToken;
