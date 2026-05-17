const express = require("express");
const pool = require("../db");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// GET candidate profile
router.get("/profile", authMiddleware, async (req, res) => {
    try {
        if (req.user.role !== "candidate") {
            return res.status(403).json({ error: "Only candidates can access this." });
        }

        const [rows] = await pool.query(
            "SELECT * FROM candidates WHERE user_id = ?",
            [req.user.id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ error: "Candidate profile not found." });
        }

        res.json(rows[0]);

    } catch (error) {
        console.error("Get candidate profile error:", error);
        res.status(500).json({ error: "Server error loading candidate profile." });
    }
});

// UPDATE candidate profile
router.put("/profile", authMiddleware, async (req, res) => {
    try {
        if (req.user.role !== "candidate") {
            return res.status(403).json({ error: "Only candidates can update this." });
        }

        const {
            full_name,
            contact,
            education,
            major,
            years_experience,
            skills,
            preferred_work_mode,
            preferred_location
        } = req.body;

        await pool.query(
            `UPDATE candidates 
             SET full_name = ?, 
                 contact = ?, 
                 education = ?, 
                 major = ?, 
                 years_experience = ?, 
                 skills = ?, 
                 preferred_work_mode = ?, 
                 preferred_location = ?
             WHERE user_id = ?`,
            [
                full_name,
                contact,
                education,
                major,
                years_experience,
                skills,
                preferred_work_mode,
                preferred_location,
                req.user.id
            ]
        );

        res.json({ message: "Candidate profile updated successfully." });

    } catch (error) {
        console.error("Update candidate profile error:", error);
        res.status(500).json({ error: "Server error updating candidate profile." });
    }
});

// GET ALL CANDIDATES + SEARCH/FILTER FOR EMPLOYERS
router.get("/", authMiddleware, async (req, res) => {
    try {
        if (req.user.role !== "employer") {
            return res.status(403).json({ error: "Only employers can view candidates." });
        }

        const {
            keyword,
            education,
            location,
            work_mode,
            min_experience
        } = req.query;

        let sql = `
            SELECT 
                candidates.*,
                users.email
            FROM candidates
            JOIN users ON candidates.user_id = users.id
            WHERE 1 = 1
        `;

        const params = [];

        if (keyword) {
            sql += `
                AND (
                    LOWER(candidates.full_name) LIKE ?
                    OR LOWER(candidates.skills) LIKE ?
                    OR LOWER(candidates.major) LIKE ?
                )
            `;
            const searchValue = `%${keyword.toLowerCase()}%`;
            params.push(searchValue, searchValue, searchValue);
        }

        if (education) {
            sql += ` AND LOWER(candidates.education) LIKE ?`;
            params.push(`%${education.toLowerCase()}%`);
        }

        if (location) {
            sql += ` AND LOWER(candidates.preferred_location) LIKE ?`;
            params.push(`%${location.toLowerCase()}%`);
        }

        if (work_mode) {
            sql += ` AND candidates.preferred_work_mode = ?`;
            params.push(work_mode);
        }

        if (min_experience) {
            sql += ` AND candidates.years_experience >= ?`;
            params.push(Number(min_experience));
        }

        sql += ` ORDER BY candidates.years_experience DESC`;

        const [candidates] = await pool.query(sql, params);

        res.json(candidates);

    } catch (error) {
        console.error("Search candidates error:", error);
        res.status(500).json({ error: "Server error searching candidates." });
    }
});

module.exports = router;