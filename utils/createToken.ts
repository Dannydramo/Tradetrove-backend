import jwt from 'jsonwebtoken';

const signJwt = (id: string) => {
    return jwt.sign({ id: id }, process.env.JWT_SECRET!, {
        expiresIn: process.env.JWT_EXPIRESIN,
    });
};

export const createSendToken = (
    user: any,
    statusCode: number,
    res: any,
    message: string
) => {
    const token = signJwt(user._id);
    const cookiesOption: any = {
        expires: new Date(
            Date.now() +
                Number(process.env.JWT_COOKIE_EXPIRES_IN) * 60 * 60 * 1000
        ),
        httpOnly: true,
    };

    if (process.env.NODE_ENV === 'production') cookiesOption.secure = true;

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
