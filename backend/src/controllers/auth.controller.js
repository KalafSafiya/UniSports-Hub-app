const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/mysql/User');

/*
    User Login
*/
exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (typeof username !== 'string' || !username.trim() || typeof password !== 'string' || !password) {
            return res.status(400).json({ message: 'Username and password are required' });
        }
        // Find user
        const user = await User.findOne({ where: { username }});
        if (!user || user.status !== 'Active') {
            return res.status(401).json({ message: "Invalid Credentials" });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid Credentials" });
        }

        // Create JWT
        const token = jwt.sign(
            {
                user_id: user.user_id,
                role: user.role
            },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        // Send response
        res.status(200).json({
            token,
            user: {
                user_id: user.user_id,
                name: user.name,
                username: user.username,
                role: user.role
            }
        });
    }
    catch {
        res.status(500).json({ message: 'Login Failed' });
    }
}