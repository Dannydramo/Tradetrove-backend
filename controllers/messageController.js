const Message = require('../models/messageModel');
const catchAsync = require('../utils/catchAsync');

exports.sendMessage = catchAsync(async (req, res, next) => {
    const newMessage = new Message(req.body);
    const savedMessage = await newMessage.save();
    res.status(200).json({ savedMessage });
});

exports.getConversationMessages = catchAsync(async (req, res, next) => {
    const messages = await Message.find({
        conversationId: req.params.conversationId,
    });
    res.status(200).json(messages);
});
