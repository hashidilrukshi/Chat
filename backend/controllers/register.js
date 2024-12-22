const bcrypt = require('bcrypt');
const db = require('../db');

exports.registerUser = async (req, res) => {
    console.log(req.body);
    const { userName, phoneNumber, email, password } = req.body;


    if (!userName || !phoneNumber || !email || !password) {
        return res.status(400).send('All fields are required.');
    }

    try {

        const [existingUser] = await db.execute('SELECT email FROM users WHERE email = ?', [email]);

        if (existingUser.length > 0) {
            return res.status(400).send('Email already exists. Please use a different email.');
        }


        const hashedPassword = await bcrypt.hash(password, 10);


        const [result] = await db.execute(
            'INSERT INTO users (userName, phoneNumber, email, password) VALUES (?, ?, ?, ?)',
            [userName, phoneNumber, email, hashedPassword]
        );

        console.log('User registered successfully:', result);

        // Respond with a success message and include user details 
        res.status(200).json({
            message: 'User registered successfully!',
            userId: result.insertId,
            userName,
            email,
        });
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).send('Error during registration.');
    }
};
