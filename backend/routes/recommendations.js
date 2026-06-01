const express = require("express");
const pool = require("../db");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

function textIncludes(source, target) {
    if (!source || !target) return false;
    return source.toLowerCase().includes(target.toLowerCase());
}

function countSkillMatches(userSkills, requiredSkills) {
    if (!userSkills || !requiredSkills) return 0;

    const userSkillList = userSkills
        .toLowerCase()
        .split(",")
        .map(skill => skill.trim())
        .filter(Boolean);

    const requiredSkillList = requiredSkills
        .toLowerCase()
        .split(",")
        .map(skill => skill.trim())
        .filter(Boolean);

    let count = 0;

    for (const skill of requiredSkillList) {
        if (userSkillList.includes(skill)) {
            count++;
        }
    }

    return count;
}

// CANDIDATE: RECOMMENDED JOBS
router.get("/jobs", authMiddleware, async (req, res) => {
    try {
        if (req.user.role !== "candidate") {
            return res.status(403).json({ error: "Only candidates can access job recommendations." });
        }

        const [candidateRows] = await pool.query(
            "SELECT * FROM candidates WHERE user_id = ?",
            [req.user.id]
        );

        if (candidateRows.length === 0) {
            return res.status(404).json({ error: "Candidate profile not found." });
        }

        const candidate = candidateRows[0];

        const [jobs] = await pool.query(
            `SELECT jobs.*, employers.company_name
             FROM jobs
             JOIN employers ON jobs.employer_id = employers.id`
        );

        const recommendations = jobs.map(job => {
            let score = 0;

            const skillMatches = countSkillMatches(candidate.skills, job.required_skills);
            score += skillMatches * 3;

            if (textIncludes(candidate.education, job.required_education)) {
                score += 2;
            }

            if (
                candidate.years_experience !== null &&
                job.years_experience !== null &&
                Number(candidate.years_experience) >= Number(job.years_experience)
            ) {
                score += 2;
            }

            if (
                candidate.preferred_work_mode &&
                job.work_mode &&
                candidate.preferred_work_mode === job.work_mode
            ) {
                score += 1;
            }

            if (textIncludes(candidate.preferred_location, job.job_location)) {
                score += 1;
            }

            return {
                ...job,
                match_score: score
            };
        });

        recommendations.sort((a, b) => b.match_score - a.match_score);

        const [userRows] = await pool.query(
            "SELECT membership FROM users WHERE id = ?",
            [req.user.id]
        );

        const membership = userRows[0]?.membership || "free";

        const result = membership === "member"
            ? recommendations
            : recommendations.slice(0, 10);

        res.json(result);

    } catch (error) {
        console.error("Recommended jobs error:", error);
        res.status(500).json({ error: "Server error loading job recommendations." });
    }
});

// EMPLOYER: RECOMMENDED CANDIDATES FOR A JOB
router.get("/candidates/:jobId", authMiddleware, async (req, res) => {
    try {
        if (req.user.role !== "employer") {
            return res.status(403).json({ error: "Only employers can access candidate recommendations." });
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
            "SELECT * FROM jobs WHERE id = ? AND employer_id = ?",
            [jobId, employerId]
        );

        if (jobRows.length === 0) {
            return res.status(404).json({ error: "Job not found or not owned by employer." });
        }

        const job = jobRows[0];

        const [candidates] = await pool.query(
            `SELECT candidates.*, users.email
             FROM candidates
             JOIN users ON candidates.user_id = users.id`
        );

        const recommendations = candidates.map(candidate => {
            let score = 0;

            const skillMatches = countSkillMatches(candidate.skills, job.required_skills);
            score += skillMatches * 3;

            if (textIncludes(candidate.education, job.required_education)) {
                score += 2;
            }

            if (
                candidate.years_experience !== null &&
                job.years_experience !== null &&
                Number(candidate.years_experience) >= Number(job.years_experience)
            ) {
                score += 2;
            }

            if (
                candidate.preferred_work_mode &&
                job.work_mode &&
                candidate.preferred_work_mode === job.work_mode
            ) {
                score += 1;
            }

            if (textIncludes(candidate.preferred_location, job.job_location)) {
                score += 1;
            }

            return {
                ...candidate,
                match_score: score
            };
        });

        recommendations.sort((a, b) => b.match_score - a.match_score);

        const [userRows] = await pool.query(
            "SELECT membership FROM users WHERE id = ?",
            [req.user.id]
        );

        const membership = userRows[0]?.membership || "free";

        const result = membership === "member"
            ? recommendations
            : recommendations.slice(0, 10);

        res.json(result);

    } catch (error) {
        console.error("Recommended candidates error:", error);
        res.status(500).json({ error: "Server error loading candidate recommendations." });
    }
});

module.exports = router;