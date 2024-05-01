import mongoose from 'mongoose';

const conversationSchema = new mongoose.Schema({
    members: { type: Array, required: true },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.model('Conversation', conversationSchema);
