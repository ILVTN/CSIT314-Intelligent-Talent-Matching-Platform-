const express = require("express");
const pool = require("../db");
const authMiddleware = require("../middleware/authMiddleware");
const Fuse = require("fuse.js"); // I'm using Fuse.js for the fuzzy search feature

const router = express.Router();

// My endpoint to get the employer's company profile.
// It uses the auth middleware to make sure the user is logged in.
router.get("/profile", authMiddleware, async (req, res) => {
    try {
        // I check the user's role here to make sure only employers can access this.
        if (req.user.role !== "employer") {
            return res.status(403).json({ error: "Forbidden" });
        }

        // Find the employer profile using the user_id from the JWT token.
        const [rows] = await pool.query(
            "SELECT company_name, company_info, contact FROM employers WHERE user_id = ?",
            [req.user.id]
        );

        if (rows.length === 0) {
            console.warn(`[WARN] No employer profile found for user_id: ${req.user.id}`);
            // This happens when a new employer signs up but hasn't saved their profile yet.
            return res.status(404).json({ error: "Employer profile not found." });
        }

        console.log(`[INFO] Fetched profile for user_id: ${req.user.id}`);
        res.json(rows[0]);

    } catch (error) {
        console.error("Get employer profile error:", error);
        res.status(500).json({ error: "Server error loading profile." });
    }
});

// My endpoint to let an employer update their company profile.
router.put("/profile", authMiddleware, async (req, res) => {
    try {
        if (req.user.role !== "employer") {
            return res.status(403).json({ error: "Forbidden" });
        }

        const { company_name, company_info, contact } = req.body;
        
        // Validation from main branch
        if (!company_name) {
            return res.status(400).json({ error: "Company name is required." });
        }

        // Update the employer's details in the database capturing [result]
        const [result] = await pool.query(
            `UPDATE employers
             SET company_name = ?,
                 company_info = ?,
                 contact = ?
             WHERE user_id = ?`,
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

// This is my advanced search for candidates, which was a Week 8 requirement.
router.get("/search-candidates", authMiddleware, async (req, res) => {
    try {
        if (req.user.role !== "employer") {
            return res.status(403).json({ error: "Only employers can search candidates." });
        }

        const { keyword, education, location, work_mode, min_experience } = req.query;

        // Step 1: I build a dynamic SQL query to filter candidates based on the form inputs.
        // I start with `WHERE 1=1` so I can easily add more `AND` conditions.
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

        // Step 2: After getting the filtered list from the database, if there's a keyword,
        // I use Fuse.js to do a fuzzy search on those results.
        if (keyword && candidates.length > 0) {
            const fuseOptions = {
                keys: ['full_name', 'skills', 'major', 'work_experience'],
                threshold: 0.4, // The threshold of 0.4 is a good balance, it can find "sofware" if someone searches for "software".
                ignoreLocation: true,
                minMatchCharLength: 2
            };
            
            const fuse = new Fuse(candidates, fuseOptions);
            const fuzzyResults = fuse.search(keyword);
            
            // Fuse.js wraps the results in an 'item' object, so I need to map over it to get my original candidate data back.
            const finalResults = fuzzyResults.map(result => result.item);
            return res.json(finalResults);
        }

        // Step 3: If the user didn't type a keyword, I just return the results from the SQL query directly.
        res.json(candidates);

    } catch (error) {
        console.error("Search candidates error:", error);
        res.status(500).json({ error: "Server error searching candidates." });
    }
});

module.exports = router;