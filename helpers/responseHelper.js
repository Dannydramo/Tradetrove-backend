exports.ApiResponse = (statusCode, resInstance, message, status, data) => {
    resInstance.status(statusCode).json({
        status,
        message,
        data,
    });
};
