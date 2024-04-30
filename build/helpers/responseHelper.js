"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiResponse = void 0;
const ApiResponse = (statusCode, resInstance, message, status, data) => {
    resInstance.status(statusCode).json({
        status,
        message,
        data,
    });
};
exports.ApiResponse = ApiResponse;
