export default class AppError extends Error {
    public readonly name: string;
    public readonly isOperational: boolean;
    public readonly statusCode: number;
    public readonly status: string;
    code: number | undefined;

    constructor(message: string, statusCode: number) {
        super(message);

        this.name = this.constructor.name;
        this.isOperational = true;
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';

        Error.captureStackTrace(this, this.constructor);
    }
}
