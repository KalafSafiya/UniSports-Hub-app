require('dotenv').config();
const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');
const sequelize = require('../src/config/mysql');
const User = require('../src/models/mysql/User');
(async () => {
    try {
        const { ADMIN_NAME, ADMIN_USERNAME, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;
        if (!ADMIN_NAME || !ADMIN_USERNAME || !ADMIN_EMAIL || !ADMIN_PASSWORD || ADMIN_PASSWORD.length < 12) {
            throw new Error('Set ADMIN_NAME, ADMIN_USERNAME, ADMIN_EMAIL and ADMIN_PASSWORD (at least 12 characters) locally');
        }
        await sequelize.authenticate();
        const existing = await User.findOne({ where: { [Op.or]: [{ username: ADMIN_USERNAME }, { email: ADMIN_EMAIL }] } });
        if (existing) throw new Error('An account with that username or email already exists');
        await User.create({ name: ADMIN_NAME, username: ADMIN_USERNAME, email: ADMIN_EMAIL, password: await bcrypt.hash(ADMIN_PASSWORD, 12), role: 'Admin', status: 'Active' });
        console.log('Administrator created');
    } catch (error) {
        console.error(error.message);
        process.exitCode = 1;
    } finally { await sequelize.close(); }
})();
