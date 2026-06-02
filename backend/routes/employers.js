const express = require("express");
const pool = require("../db");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// GET employer profile
router.get("/profile", authMiddleware, async (req, res) => {
    try {
        if (req.user.role !== "employer") {
            return res.status(403).json({ error: "Only employers can access this." });
        }

        const [rows] = await pool.query(
            "SELECT * FROM employers WHERE user_id = ?",
            [req.user.id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ error: "Employer profile not found." });
        }

        res.json(rows[0]);

    } catch (error) {
        console.error("Get employer profile error:", error);
        res.status(500).json({ error: "Server error loading employer profile." });
    }
});

// UPDATE employer profile
router.put("/profile", authMiddleware, async (req, res) => {
    try {
        if (req.user.role !== "employer") {
            return res.status(403).json({ error: "Only employers can update this." });
        }

        const { company_name, company_info, contact } = req.body;
        if (!company_name) {
            return res.status(400).json({ error: "Company name is required." });
        }
        await pool.query(
            `UPDATE employers
             SET company_name = ?,
                 company_info = ?,
                 contact = ?
             WHERE user_id = ?`,
            [company_name, company_info, contact, req.user.id]
        );

        res.json({ message: "Employer profile updated successfully." });

    } catch (error) {
        console.error("Update employer profile error:", error);
        res.status(500).json({ error: "Server error updating employer profile." });
    }
});

module.exports = router;