const mysql = require('mysql2/promise');
require('dotenv').config();

/**
 * @module config/db
 * @description Configuration et initialisation du pool de connexion MySQL via mysql2/promise.
 */

/**
 * Pool de connexion à la base de données.
 * @type {import('mysql2/promise').Pool}
 */
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

module.exports = pool;