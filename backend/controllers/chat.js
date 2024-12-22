const pool = require('../db');

const getMessagesByChatIdAndUserId = async (req, res) => {
    const { receiverId, senderId } = req.params;

    try {
        const [result] = await pool.query(
            `SELECT * FROM chats WHERE (user_1_id = ? AND user_2_id=?)OR(user_2_id = ? AND user_1_id=?)`,
            [parseInt(senderId), parseInt(receiverId), parseInt(senderId), parseInt(receiverId)]
        );

        if (result.length === 0) {
            let newChatId = senderId.toString() + receiverId.toString();
            const [result2] = await pool.query(
                `INSERT INTO chats (chatId,user_1_id, user_2_id) VALUES (?, ?, ?)`,
                [newChatId, parseInt(senderId), parseInt(receiverId)]
            );
            res.status(200).json({ chatId: newChatId, messages: [] });
        } else {
            const [rows] = await pool.query(
                `SELECT * FROM messages
            WHERE chatId = ?
            ORDER BY messages.created_at ASC`,
                [result[0].chatId]
            );
            res.status(200).json({ chatId: result[0].chatId, messages: rows });
        }
    } catch (error) {
        console.log(error);

        res.status(500).json({ error: error.message });
    }
};

// Send a new message
const sendMessage = async (req, res) => {
    const { senderId, receiverId, message, chatId } = req.body;

    try {
        const [result] = await pool.query(
            `INSERT INTO messages (sender_id,receiver_id, message,chatId)
             VALUES (?, ?, ?,?)`,
            [senderId, receiverId, message, chatId]
        );
        const [messageResult] = await pool.query(
            `SELECT * FROM messages WHERE id = ?`,
            [result.insertId]
        );
        res.status(200).json({
            id: messageResult[0].id,
            senderId: messageResult[0].sender_id,
            receiverId: messageResult[0].receiver_id,
            message: messageResult[0].message,
            created_at: messageResult[0].created_at, // Get created_at directly from the DB
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getMessagesByChatIdAndUserId,
    sendMessage,
};