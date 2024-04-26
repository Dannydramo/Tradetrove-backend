import { Request, Response, NextFunction } from 'express';
import Message from './../models/messageModel';
import catchAsync from '../utils/catchAsync';

export const sendMessage = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const newMessage = new Message(req.body);
        const savedMessage = await newMessage.save();
        res.status(200).json({ savedMessage });
    }
);

export const getConversationMessages = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const messages = await Message.find({
            conversationId: req.params.conversationId,
        });
        res.status(200).json(messages);
    }
);
