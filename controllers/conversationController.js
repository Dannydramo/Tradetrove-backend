const Conversation = require('../models/conversationModel');
const catchAsync = require('../utils/catchAsync');
const { ApiResponse } = require('../helpers/responseHelper');

const startConversation = catchAsync(async (req, res, next) => {
    const existingConversation = await Conversation.findOne({
        members: {
            $all: [req.body.userId, req.body.vendorId],
        },
    });

    if (existingConversation) {
        return ApiResponse(201, res, 'Conversation already exist', 'success', {
            savedConversation: 'Conversation already exist',
        });
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
});

const conversationByUser = catchAsync(async (req, res, next) => {
    const conversation = await Conversation.find({
        members: { $in: [req.params.id] },
    });
    res.status(200).json({ conversation });
});

module.exports = { startConversation, conversationByUser };
