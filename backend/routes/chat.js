const express = require('express');
const chatController = require('../controllers/chat');

const router = express.Router();

// Fetch messages by chatId and userId
router.get('/:receiverId/:senderId', chatController.getMessagesByChatIdAndUserId);

// Send a new message
router.post('/', chatController.sendMessage);

module.exports = router;
