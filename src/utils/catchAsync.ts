import { Request, Response, NextFunction } from 'express';

export default (fn: (arg0: any, arg1: any, arg2: any) => Promise<any>) => {
    return (req: Request, res: Response, next: NextFunction) => {
        fn(req, res, next).catch(next);
    };
};
