const mysql = require("mysql2/promise");
// Note: dotenv is now configured in the main index.js file

const pool = mysql.createPool({
    host: process.env.DB_HOST || "127.0.0.1",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_DATABASE || "talent_platform",
<<<<<<< HEAD
    port: process.env.DB_PORT || 3307,
=======
    port: process.env.DB_PORT || 3306,
>>>>>>> 0afc0ad243a2a8d880cd1fe3b73e92c394605616
    waitForConnections: true,
    connectionLimit: 10
});

module.exports = pool;