const express = require("express");
const pool = require("../db");
const authMiddleware = require("../middleware/authMiddleware");
const Fuse = require("fuse.js"); // Added for Week 8 Fuzzy Search

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

// WEEK 8 REQUIREMENT: Advanced Search & Filter with Fuzzy Matching
router.get("/search-candidates", authMiddleware, async (req, res) => {
    try {
        if (req.user.role !== "employer") {
            return res.status(403).json({ error: "Only employers can search candidates." });
        }

        const { keyword, education, location, work_mode, min_experience } = req.query;

        // 1. Build dynamic SQL for hard filters (Location, Work Mode, Education, Experience)
        let query = `
            SELECT candidates.*, users.email 
            FROM candidates 
            JOIN users ON candidates.user_id = users.id 
            WHERE 1=1
        `;
        const queryParams = [];

        if (education) {
            query += " AND education LIKE ?";
            queryParams.push(`%${education}%`);
        }
        if (location) {
            query += " AND preferred_location LIKE ?";
            queryParams.push(`%${location}%`);
        }
        if (work_mode) {
            query += " AND preferred_work_mode = ?";
            queryParams.push(work_mode);
        }
        if (min_experience) {
            query += " AND years_experience >= ?";
            queryParams.push(Number(min_experience));
        }

        const [candidates] = await pool.query(query, queryParams);

        // 2. If there is a Keyword, apply Fuse.js Fuzzy Search to the filtered results
        if (keyword && candidates.length > 0) {
            const fuseOptions = {
                keys: ['full_name', 'skills', 'major', 'work_experience'],
                threshold: 0.4, // 0.4 allows for typos (e.g., "sofware" matches "software")
                ignoreLocation: true,
                minMatchCharLength: 2
            };
            
            const fuse = new Fuse(candidates, fuseOptions);
            const fuzzyResults = fuse.search(keyword);
            
            // Fuse returns an array of objects structured as { item: { ...data } }
            const finalResults = fuzzyResults.map(result => result.item);
            return res.json(finalResults);
        }

        // 3. If no keyword, return the results matched purely by SQL filters
        res.json(candidates);

    } catch (error) {
        console.error("Search candidates error:", error);
        res.status(500).json({ error: "Server error searching candidates." });
    }
});

module.exports = router;