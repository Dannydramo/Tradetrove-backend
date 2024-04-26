import express from 'express';
import {
    conversationByUser,
    startConversation,
} from '../controllers/conversationController';

const router = express.Router();

router.post('/new', startConversation);
router.get('/:id', conversationByUser);
export default router;
