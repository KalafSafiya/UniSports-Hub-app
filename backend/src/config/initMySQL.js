const mysql = require('mysql2/promise');
require('dotenv').config();
module.exports = async function initMySQL() {
    if (!process.env.MYSQL_DB) throw new Error('MYSQL_DB is required');
    const connection = await mysql.createConnection({
        host: process.env.MYSQL_HOST,
        port: Number(process.env.MYSQL_PORT || 3306),
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASS
    });
    try {
        await connection.query('CREATE DATABASE IF NOT EXISTS ??', [process.env.MYSQL_DB]);
    } finally {
        await connection.end();
    }
};
