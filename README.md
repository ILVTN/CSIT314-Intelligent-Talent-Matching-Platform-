# CSIT314 - Intelligent Talent Matching Platform

## Project Overview

The Intelligent Talent Matching Platform is a web-based recruitment system designed to improve the efficiency of job searching and talent acquisition. The platform supports both candidates looking for jobs and employers searching for suitable candidates.

The system provides structured candidate profiles, job postings, search and filtering functions, and intelligent recommendation features to match candidates with relevant jobs and employers with suitable applicants.

This project is developed for the CSIT314 group project. The system follows the required candidate and employer workflows, including Top-10 job recommendations for candidates and Top-10 candidate recommendations for employers.

## Main Features

### Candidate Features

- Register and log in as a candidate
- Create and manage candidate profile
- Enter education, major, skills, experience, and contact details
- Browse available job postings
- Search jobs using keywords from job descriptions
- Receive Top-10 recommended jobs
- View recommendation explanations
- Apply for jobs
- View application status

### Employer Features

- Register and log in as an employer/recruiter
- Create and manage company profile
- Create, edit, publish, unpublish, and delete job postings
- Browse candidate profiles
- Search candidates
- Filter candidates by skills, education, and experience
- Receive Top-10 recommended candidates
- Shortlist candidates
- Update application status

## Project Structure

```text
.
├── backend/
│   └── Server-side code, APIs, authentication, and business logic
│
├── database/
│   └── Database schema, SQL scripts, and seed data
│
├── frontend/
│   └── Client-side pages, components, styles, and scripts
│
├── node_modules/
│   └── Installed Node.js dependencies
│
├── .env
│   └── Environment variables
│
├── README.md
│   └── Project documentation
│
├── package-lock.json
│   └── Dependency lock file
│
└── package.json
    └── Project dependencies and scripts
