const express = require('express');
const {
    getConversationMessages,
    sendMessage,
} = require('../controllers/messageController');

const router = express.Router();

router.post('/send', sendMessage);
router.get('/:conversationId', getConversationMessages);
module.exports = router;
