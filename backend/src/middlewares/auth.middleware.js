const jwt = require('jsonwebtoken');
const User = require('../models/mysql/User');
module.exports = async (req, res, next) => {
    const match = /^Bearer\s+(\S+)$/i.exec(req.headers.authorization || '');
    if (!match) return res.status(401).json({ message: 'No token provided' });
    let decoded;
    try {
        decoded = jwt.verify(match[1], process.env.JWT_SECRET);
    } catch {
        return res.status(401).json({ message: 'Invalid token' });
    }
    try {
        const user = await User.findByPk(decoded.user_id);
        if (!user || user.status !== 'Active') return res.status(401).json({ message: 'Account unavailable' });
        req.user = { user_id: user.user_id, role: user.role };
        return next();
    } catch (error) { return next(error); }
};
