-- Switch to the correct database
USE talent_platform;

-- Insert all the sample data

INSERT INTO users (email, password, role, membership)
VALUES
('candidate@test.com', '$2b$10$GEjWK2df.E8wdxLp6rw/I.mssFd99.PGMe5mgyMNlIHuKTG9xu7Hq', 'candidate', 'free'),
('candidate2@test.com', '$2b$10$GEjWK2df.E8wdxLp6rw/I.mssFd99.PGMe5mgyMNlIHuKTG9xu7Hq', 'candidate', 'free'),
('employer@test.com', '$2b$10$GEjWK2df.E8wdxLp6rw/I.mssFd99.PGMe5mgyMNlIHuKTG9xu7Hq', 'employer', 'member');

INSERT INTO candidates (
    user_id,
    full_name,
    contact,
    education,
    major,
    years_experience,
    skills,
    preferred_work_mode,
    preferred_location
)
VALUES
(
    1,
    'John Smith',
    'john.smith@email.com',
    'Bachelor',
    'Computer Science',
    2,
    'JavaScript, SQL, Node.js',
    'Hybrid',
    'Sydney'
),
(
    2,
    'Emily Nguyen',
    'emily.nguyen@email.com',
    'Master',
    'Data Science',
    3,
    'Python, Data Analysis, Machine Learning',
    'Remote',
    'Melbourne'
);

INSERT INTO employers (
    user_id,
    company_name,
    company_info,
    contact
)
VALUES
(
    3,
    'TechHire Australia',
    'A recruitment company helping technology candidates find suitable jobs.',
    'hr@techhire.com'
);

INSERT INTO jobs (
    employer_id,
    job_title,
    company_info,
    job_description,
    required_education,
    required_skills,
    years_experience,
    work_mode,
    job_location
)
VALUES
(
    1,
    'Junior Web Developer',
    'TechHire Australia',
    'Build responsive websites using HTML, CSS, JavaScript and Node.js.',
    'Bachelor',
    'JavaScript, SQL, Node.js',
    1,
    'Hybrid',
    'Sydney'
),
(
    1,
    'Data Analyst',
    'TechHire Australia',
    'Analyse business data and create reports using Python and machine learning tools.',
    'Master',
    'Python, Data Analysis, Machine Learning',
    2,
    'Remote',
    'Melbourne'
),
(
    1,
    'Frontend Developer',
    'TechHire Australia',
    'Develop user interfaces using HTML, CSS, JavaScript and modern frontend practices.',
    'Bachelor',
    'HTML, CSS, JavaScript',
    1,
    'Hybrid',
    'Sydney'
);

INSERT INTO applications (
    candidate_id,
    job_id,
    status
)
VALUES
(1, 1, 'submitted'),
(2, 2, 'accepted');
