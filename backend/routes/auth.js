
const authMiddleware = require("../middleware/authMiddleware");
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../db");

const router = express.Router();

// REGISTER
router.post("/register", async (req, res) => {
    try {
        const { email, password, role } = req.body;

        if (!email || !password || !role) {
            return res.status(400).json({ error: "Email, password, and role are required." });
        }

        if (role !== "candidate" && role !== "employer") {
            return res.status(400).json({ error: "Invalid role." });
        }

        const [existingUsers] = await pool.query(
            "SELECT id FROM users WHERE email = ?",
            [email]
        );

        if (existingUsers.length > 0) {
            return res.status(400).json({ error: "Email already registered." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const [result] = await pool.query(
            "INSERT INTO users (email, password, role) VALUES (?, ?, ?)",
            [email, hashedPassword, role]
        );

        const userId = result.insertId;

        if (role === "candidate") {
            await pool.query(
                "INSERT INTO candidates (user_id) VALUES (?)",
                [userId]
            );
        }

        if (role === "employer") {
            await pool.query(
                "INSERT INTO employers (user_id) VALUES (?)",
                [userId]
            );
        }

        res.status(201).json({
            message: "Registration successful.",
            userId,
            role
        });

    } catch (error) {
        console.error("Register error:", error);
        res.status(500).json({ error: "Server error during registration." });
    }
});

// LOGIN
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required." });
        }

        const [users] = await pool.query(
            "SELECT * FROM users WHERE email = ?",
            [email]
        );

        if (users.length === 0) {
            return res.status(400).json({ error: "Invalid email or password." });
        }

        const user = users[0];

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(400).json({ error: "Invalid email or password." });
        }

        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
                role: user.role,
                membership: user.membership
            },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.json({
            message: "Login successful.",
            token,
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                membership: user.membership
            }
        });

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ error: "Server error during login." });
    }
});

// UPGRADE MEMBERSHIP
router.put("/membership", authMiddleware, async (req, res) => {
    try {
        const { membership } = req.body;
        const userId = req.user.id;

        if (!userId || !membership) {
            return res.status(400).json({ error: "User ID and membership are required." });
        }

        if (membership !== "free" && membership !== "member") {
            return res.status(400).json({ error: "Invalid membership type." });
        }

        await pool.query(
            "UPDATE users SET membership = ? WHERE id = ?",
            [membership, userId]
        );

        res.json({
            message: "Membership updated successfully.",
            membership
        });

    } catch (error) {
        console.error("Membership update error:", error);
        res.status(500).json({ error: "Server error updating membership." });
    }
});

module.exports = router;