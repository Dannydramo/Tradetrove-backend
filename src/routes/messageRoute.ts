import express from 'express';
import {
    getConversationMessages,
    sendMessage,
} from '../controllers/messageController';

const router = express.Router();

router.post('/send', sendMessage);
router.get('/:conversationId', getConversationMessages);
export default router;
