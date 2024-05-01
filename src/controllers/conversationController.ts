import { Request, Response, NextFunction } from 'express';
import Conversation from '../models/conversationModel';
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/appError';
import { ApiResponse } from '../helpers/responseHelper';

export const startConversation = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const existingConversation = await Conversation.findOne({
            members: {
                $all: [req.body.userId, req.body.vendorId],
            },
        });

        if (existingConversation) {
            return ApiResponse(
                201,
                res,
                'Conversation already exist',
                'success',
                { savedConversation: 'Conversation already exist' }
            );
        }

        const newConversation = new Conversation({
            members: [req.body.userId, req.body.vendorId],
        });

        const savedConversation = await newConversation.save();
        return ApiResponse(
            201,
            res,
            'Conversation created',
            'success',
            savedConversation
        );
    }
);

export const conversationByUser = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const conversation = await Conversation.find({
            members: { $in: [req.params.id] },
        });
        res.status(200).json({ conversation });
    }
);
