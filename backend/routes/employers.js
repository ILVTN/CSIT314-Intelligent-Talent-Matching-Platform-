const express = require("express");
const pool = require("../db");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// GET a company profile
router.get("/profile", authMiddleware, async (req, res) => {
    try {
        if (req.user.role !== "employer") {
            return res.status(403).json({ error: "Forbidden" });
        }

        const [rows] = await pool.query(
            "SELECT company_name, company_info, contact FROM employers WHERE user_id = ?",
            [req.user.id]
        );

        if (rows.length === 0) {
            console.warn(`[WARN] No employer profile found for user_id: ${req.user.id}`);
            return res.status(404).json({ error: "Employer profile not found." });
        }

        console.log(`[INFO] Fetched profile for user_id: ${req.user.id}`);
        res.json(rows[0]);

    } catch (error) {
        console.error("Get employer profile error:", error);
        res.status(500).json({ error: "Server error loading profile." });
    }
});

// UPDATE a company profile
router.put("/profile", authMiddleware, async (req, res) => {
    try {
        if (req.user.role !== "employer") {
            return res.status(403).json({ error: "Forbidden" });
        }

        const { company_name, company_info, contact } = req.body;

        const [result] = await pool.query(
            "UPDATE employers SET company_name = ?, company_info = ?, contact = ? WHERE user_id = ?",
            [company_name, company_info, contact, req.user.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Employer profile not found to update." });
        }

        console.log(`[INFO] Updated profile for user_id: ${req.user.id}`);
        res.json({ message: "Company profile updated successfully." });

    } catch (error) {
        console.error("Update employer profile error:", error);
        res.status(500).json({ error: "Server error updating profile." });
    }
});

module.exports = router;