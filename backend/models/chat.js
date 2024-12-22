const pool = require('../db');


const getMessagesByChatId = async (chatId) => {
    try {
        const [rows] = await pool.query(
            `SELECT messages.*, users.name AS sender_name, users.profile_picture
             FROM messages
             LEFT JOIN users ON messages.sender_id = users.id
             WHERE chat_id = ?
             ORDER BY messages.created_at ASC`,
            [chatId]
        );
        return rows;
    } catch (error) {
        throw new Error('Error fetching messages: ' + error.message);
    }
};

const saveMessage = async (chatId, senderId, message) => {
    try {
        const [result] = await pool.query(
            'INSERT INTO messages (chat_id, sender_id, message) VALUES (?, ?, ?)',
            [chatId, senderId, message]
        );
        return result.insertId;
    } catch (error) {
        throw new Error('Error saving message: ' + error.message);
    }
};

module.exports = {
    getMessagesByChatId,
    saveMessage,
};
