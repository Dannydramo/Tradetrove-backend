export const ApiResponse = (
    statusCode: number,
    resInstance: any,
    message: string,
    status: string,
    data: any
) => {
    resInstance.status(statusCode).json({
        status,
        message,
        data,
    });
};
