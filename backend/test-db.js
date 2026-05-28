const pool = require("./db");

async function testDatabase() {
    try {
        const connection = await pool.getConnection();

        console.log("Database connected successfully!");

        const [rows] = await connection.query("SELECT DATABASE() AS database_name");
        console.log("Connected to database:", rows[0].database_name);

        connection.release();
    } catch (error) {
        console.error("Database connection failed:");
        console.error(error.message);
    } finally {
        await pool.end();
    }
}

testDatabase();