const Fuse = require("fuse.js");
const express = require("express");
const pool = require("../db");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// CREATE JOB
router.post("/", authMiddleware, async (req, res) => {
    try {
        if (req.user.role !== "employer") {
            return res.status(403).json({ error: "Only employers can create jobs." });
        }

        const [employers] = await pool.query(
            "SELECT id FROM employers WHERE user_id = ?",
            [req.user.id]
        );

        if (employers.length === 0) {
            return res.status(404).json({ error: "Employer profile not found." });
        }

        const employerId = employers[0].id;

        const {
            job_title,
            company_info,
            job_description,
            required_education,
            required_skills,
            years_experience,
            work_mode,
            job_location
        } = req.body;

        if (!job_title || !job_description) {
            return res.status(400).json({ error: "Job title and description are required." });
        }

        if (years_experience && Number(years_experience) < 0) {
            return res.status(400).json({ error: "Years of experience cannot be negative." });
        }

        if (work_mode && !["Remote", "On-site", "Hybrid"].includes(work_mode)) {
            return res.status(400).json({ error: "Invalid work mode." });
        }

        await pool.query(
            `INSERT INTO jobs 
            (employer_id, job_title, company_info, job_description, required_education, required_skills, years_experience, work_mode, job_location)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                employerId,
                job_title,
                company_info,
                job_description,
                required_education,
                required_skills,
                years_experience,
                work_mode,
                job_location
            ]
        );

        res.status(201).json({ message: "Job created successfully." });

    } catch (error) {
        console.error("Create job error:", error);
        res.status(500).json({ error: "Server error creating job." });
    }
});

// GET JOBS CREATED BY CURRENT EMPLOYER
router.get("/my-jobs", authMiddleware, async (req, res) => {
    try {
        if (req.user.role !== "employer") {
            return res.status(403).json({ error: "Only employers can access this." });
        }

        const [employers] = await pool.query(
            "SELECT id FROM employers WHERE user_id = ?",
            [req.user.id]
        );

        if (employers.length === 0) {
            return res.status(404).json({ error: "Employer profile not found." });
        }

        const employerId = employers[0].id;

        const [jobs] = await pool.query(
            "SELECT * FROM jobs WHERE employer_id = ? ORDER BY created_at DESC",
            [employerId]
        );

        res.json(jobs);

    } catch (error) {
        console.error("Get my jobs error:", error);
        res.status(500).json({ error: "Server error loading jobs." });
    }
});

// EMPLOYER VIEW APPLICATIONS FOR THEIR JOBS
router.get("/applications", authMiddleware, async (req, res) => {
    try {
        if (req.user.role !== "employer") {
            return res.status(403).json({ error: "Only employers can view applications." });
        }

        const [employerRows] = await pool.query(
            "SELECT id FROM employers WHERE user_id = ?",
            [req.user.id]
        );

        if (employerRows.length === 0) {
            return res.status(404).json({ error: "Employer profile not found." });
        }

        const employerId = employerRows[0].id;

        const [applications] = await pool.query(
            `SELECT 
                applications.id AS application_id,
                applications.status,
                applications.created_at,
                jobs.job_title,
                candidates.full_name,
                candidates.contact,
                candidates.education,
                candidates.major,
                candidates.years_experience,
                candidates.skills,
                candidates.preferred_work_mode,
                candidates.preferred_location,
                users.email
             FROM applications
             JOIN jobs ON applications.job_id = jobs.id
             JOIN candidates ON applications.candidate_id = candidates.id
             JOIN users ON candidates.user_id = users.id
             WHERE jobs.employer_id = ?
             ORDER BY applications.created_at DESC`,
            [employerId]
        );

        res.json(applications);

    } catch (error) {
        console.error("View applications error:", error);
        res.status(500).json({ error: "Server error loading applications." });
    }
});

// CANDIDATE VIEW MY APPLICATIONS
router.get("/my-applications", authMiddleware, async (req, res) => {
    try {
        if (req.user.role !== "candidate") {
            return res.status(403).json({ error: "Only candidates can view their applications." });
        }

        const [candidateRows] = await pool.query(
            "SELECT id FROM candidates WHERE user_id = ?",
            [req.user.id]
        );

        if (candidateRows.length === 0) {
            return res.status(404).json({ error: "Candidate profile not found." });
        }

        const candidateId = candidateRows[0].id;

        const [applications] = await pool.query(
            `SELECT 
                applications.id AS application_id,
                applications.status,
                applications.created_at,
                jobs.job_title,
                jobs.job_description,
                jobs.required_skills,
                jobs.required_education,
                jobs.years_experience,
                jobs.work_mode,
                jobs.job_location,
                employers.company_name
             FROM applications
             JOIN jobs ON applications.job_id = jobs.id
             JOIN employers ON jobs.employer_id = employers.id
             WHERE applications.candidate_id = ?
             ORDER BY applications.created_at DESC`,
            [candidateId]
        );

        res.json(applications);

    } catch (error) {
        console.error("Candidate applications error:", error);
        res.status(500).json({ error: "Server error loading your applications." });
    }
});

// GET ALL JOBS + SEARCH/FILTER FOR CANDIDATES
router.get("/", authMiddleware, async (req, res) => {
    try {
        if (req.user.role !== "candidate") {
            return res.status(403).json({ error: "Only candidates can view jobs." });
        }

        const {
            keyword,
            location,
            work_mode,
            education,
            max_experience
        } = req.query;

        let sql = `
            SELECT 
                jobs.*,
                employers.company_name
            FROM jobs
            JOIN employers ON jobs.employer_id = employers.id
            WHERE 1 = 1
        `;

        const params = [];

        if (location) {
            sql += ` AND LOWER(jobs.job_location) LIKE ?`;
            params.push(`%${location.toLowerCase()}%`);
        }

        if (work_mode) {
            sql += ` AND jobs.work_mode = ?`;
            params.push(work_mode);
        }

        if (education) {
            sql += ` AND LOWER(jobs.required_education) LIKE ?`;
            params.push(`%${education.toLowerCase()}%`);
        }

        if (max_experience) {
            sql += ` AND jobs.years_experience <= ?`;
            params.push(Number(max_experience));
        }

        sql += ` ORDER BY jobs.created_at DESC`;

        const [jobs] = await pool.query(sql, params);

        let results = jobs;

        if (keyword) {
            const fuse = new Fuse(jobs, {
                keys: [
                    "job_title",
                    "company_name",
                    "company_info",
                    "job_description",
                    "required_skills",
                    "required_education",
                    "work_mode",
                    "job_location"
                ],
                threshold: 0.4
            });

            results = fuse.search(keyword).map(result => result.item);
        }

        res.json(results);

    } catch (error) {
        console.error("Search jobs error:", error);
        res.status(500).json({ error: "Server error searching jobs." });
    }
});

// GET A SINGLE JOB BY ID (for editing)
router.get("/:jobId", authMiddleware, async (req, res) => {
    try {
        if (req.user.role !== "employer") {
            return res.status(403).json({ error: "Only employers can access this." });
        }

        const { jobId } = req.params;

        const [employerRows] = await pool.query(
            "SELECT id FROM employers WHERE user_id = ?",
            [req.user.id]
        );

        if (employerRows.length === 0) {
            return res.status(404).json({ error: "Employer profile not found." });
        }

        const employerId = employerRows[0].id;

        const [jobs] = await pool.query(
            "SELECT * FROM jobs WHERE id = ? AND employer_id = ?",
            [jobId, employerId]
        );

        if (jobs.length === 0) {
            return res.status(404).json({ error: "Job not found or you do not own this job." });
        }

        res.json(jobs[0]);

    } catch (error) {
        console.error("Get single job error:", error);
        res.status(500).json({ error: "Server error loading job." });
    }
});

// DELETE A JOB
router.delete("/:jobId", authMiddleware, async (req, res) => {
    try {
        if (req.user.role !== "employer") {
            return res.status(403).json({ error: "Only employers can delete jobs." });
        }

        const { jobId } = req.params;

        const [employerRows] = await pool.query(
            "SELECT id FROM employers WHERE user_id = ?",
            [req.user.id]
        );

        if (employerRows.length === 0) {
            return res.status(404).json({ error: "Employer profile not found." });
        }

        const employerId = employerRows[0].id;

        const [jobRows] = await pool.query(
            "SELECT id FROM jobs WHERE id = ? AND employer_id = ?",
            [jobId, employerId]
        );

        if (jobRows.length === 0) {
            return res.status(404).json({ error: "Job not found or you do not own this job." });
        }

        await pool.query(
            "DELETE FROM applications WHERE job_id = ?",
            [jobId]
        );

        await pool.query(
            "DELETE FROM jobs WHERE id = ? AND employer_id = ?",
            [jobId, employerId]
        );

        res.json({ message: "Job deleted successfully." });

    } catch (error) {
        console.error("Delete job error:", error);
        res.status(500).json({ error: "Server error deleting job." });
    }
});

// CANDIDATE APPLY FOR JOB
router.post("/:jobId/apply", authMiddleware, async (req, res) => {
    try {
        if (req.user.role !== "candidate") {
            return res.status(403).json({ error: "Only candidates can apply for jobs." });
        }

        const { jobId } = req.params;

        const [candidateRows] = await pool.query(
            "SELECT id FROM candidates WHERE user_id = ?",
            [req.user.id]
        );

        if (candidateRows.length === 0) {
            return res.status(404).json({ error: "Candidate profile not found." });
        }

        const candidateId = candidateRows[0].id;

        const [existing] = await pool.query(
            "SELECT id FROM applications WHERE candidate_id = ? AND job_id = ?",
            [candidateId, jobId]
        );

        if (existing.length > 0) {
            return res.status(400).json({ error: "You already applied for this job." });
        }

        await pool.query(
            "INSERT INTO applications (candidate_id, job_id, status) VALUES (?, ?, ?)",
            [candidateId, jobId, "submitted"]
        );

        res.status(201).json({ message: "Application submitted successfully." });

    } catch (error) {
        console.error("Apply job error:", error);
        res.status(500).json({ error: "Server error applying for job." });
    }
});

// EMPLOYER UPDATE APPLICATION STATUS
router.put("/applications/:applicationId/status", authMiddleware, async (req, res) => {
    try {
        if (req.user.role !== "employer") {
            return res.status(403).json({ error: "Only employers can update applications." });
        }

        const { applicationId } = req.params;
        const { status } = req.body;

        if (status !== "accepted" && status !== "rejected") {
            return res.status(400).json({ error: "Invalid status." });
        }

        const [employerRows] = await pool.query(
            "SELECT id FROM employers WHERE user_id = ?",
            [req.user.id]
        );

        if (employerRows.length === 0) {
            return res.status(404).json({ error: "Employer profile not found." });
        }

        const employerId = employerRows[0].id;

        const [applicationRows] = await pool.query(
            `SELECT applications.id
             FROM applications
             JOIN jobs ON applications.job_id = jobs.id
             WHERE applications.id = ? AND jobs.employer_id = ?`,
            [applicationId, employerId]
        );

        if (applicationRows.length === 0) {
            return res.status(404).json({ error: "Application not found." });
        }

        await pool.query(
            "UPDATE applications SET status = ? WHERE id = ?",
            [status, applicationId]
        );

        res.json({ message: `Application ${status} successfully.` });

    } catch (error) {
        console.error("Update application status error:", error);
        res.status(500).json({ error: "Server error updating application status." });
    }
});

// UPDATE A JOB
router.put("/:jobId", authMiddleware, async (req, res) => {
    try {
        if (req.user.role !== "employer") {
            return res.status(403).json({ error: "Only employers can update jobs." });
        }

        const { jobId } = req.params;

        const [employerRows] = await pool.query(
            "SELECT id FROM employers WHERE user_id = ?",
            [req.user.id]
        );

        if (employerRows.length === 0) {
            return res.status(404).json({ error: "Employer profile not found." });
        }

        const employerId = employerRows[0].id;

        const {
            job_title,
            company_info,
            job_description,
            required_education,
            required_skills,
            years_experience,
            work_mode,
            job_location
        } = req.body;

        if (!job_title || !job_description) {
            return res.status(400).json({ error: "Job title and description are required." });
        }

        if (years_experience && Number(years_experience) < 0) {
            return res.status(400).json({ error: "Years of experience cannot be negative." });
        }

        if (work_mode && !["Remote", "On-site", "Hybrid"].includes(work_mode)) {
            return res.status(400).json({ error: "Invalid work mode." });
        }

        const [result] = await pool.query(
            `UPDATE jobs SET 
                job_title = ?, 
                company_info = ?, 
                job_description = ?, 
                required_education = ?, 
                required_skills = ?, 
                years_experience = ?, 
                work_mode = ?, 
                job_location = ?
             WHERE id = ? AND employer_id = ?`,
            [
                job_title,
                company_info,
                job_description,
                required_education,
                required_skills,
                years_experience || 0,
                work_mode,
                job_location,
                jobId,
                employerId
            ]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Job not found or you do not own this job." });
        }

        res.json({ message: "Job updated successfully." });

    } catch (error) {
        console.error("Update job error:", error);
        res.status(500).json({ error: "Server error updating job." });
    }
});

module.exports = router;