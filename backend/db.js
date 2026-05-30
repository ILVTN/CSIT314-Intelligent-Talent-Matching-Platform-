const mysql = require("mysql2/promise");
// Note: dotenv is now configured in the main index.js file

const pool = mysql.createPool({
    host: process.env.DB_HOST || "127.0.0.1",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_DATABASE || "talent_platform",
    port: process.env.DB_PORT || 3307,
    waitForConnections: true,
    connectionLimit: 10
});

module.exports = pool;