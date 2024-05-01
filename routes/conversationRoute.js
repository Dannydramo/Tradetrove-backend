const express = require('express');
const {
    conversationByUser,
    startConversation,
} = require('../controllers/conversationController');

const router = express.Router();

router.post('/new', startConversation);
router.get('/:id', conversationByUser);
module.exports = router;
