const express = require('express');
const db = require('../db');
const router = express.Router();

router.get('/users/:senderId', async (req, res) => {
    const { senderId } = req.params;
    try {
        const [users] = await db.execute('SELECT id,userName FROM users WHERE id != ?', [senderId]);
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).send('Error fetching users.');
    }
});

module.exports = router;
