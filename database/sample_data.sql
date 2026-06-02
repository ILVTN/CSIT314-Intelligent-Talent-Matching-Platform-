USE talent_platform;

INSERT INTO users (email, password, role, membership)
VALUES
('candidate1@test.com', '$2b$10$GEjWK2df.E8wdxLp6rw/I.mssFd99.PGMe5mgyMNlIHuKTG9xu7Hq', 'candidate', 'free'),
('candidate2@test.com', '$2b$10$GEjWK2df.E8wdxLp6rw/I.mssFd99.PGMe5mgyMNlIHuKTG9xu7Hq', 'candidate', 'free'),
('candidate3@test.com', '$2b$10$GEjWK2df.E8wdxLp6rw/I.mssFd99.PGMe5mgyMNlIHuKTG9xu7Hq', 'candidate', 'free'),
('candidate4@test.com', '$2b$10$GEjWK2df.E8wdxLp6rw/I.mssFd99.PGMe5mgyMNlIHuKTG9xu7Hq', 'candidate', 'free'),
('candidate5@test.com', '$2b$10$GEjWK2df.E8wdxLp6rw/I.mssFd99.PGMe5mgyMNlIHuKTG9xu7Hq', 'candidate', 'free'),
('candidate6@test.com', '$2b$10$GEjWK2df.E8wdxLp6rw/I.mssFd99.PGMe5mgyMNlIHuKTG9xu7Hq', 'candidate', 'free'),
('candidate7@test.com', '$2b$10$GEjWK2df.E8wdxLp6rw/I.mssFd99.PGMe5mgyMNlIHuKTG9xu7Hq', 'candidate', 'free'),
('candidate8@test.com', '$2b$10$GEjWK2df.E8wdxLp6rw/I.mssFd99.PGMe5mgyMNlIHuKTG9xu7Hq', 'candidate', 'free'),
('candidate9@test.com', '$2b$10$GEjWK2df.E8wdxLp6rw/I.mssFd99.PGMe5mgyMNlIHuKTG9xu7Hq', 'candidate', 'free'),
('candidate10@test.com', '$2b$10$GEjWK2df.E8wdxLp6rw/I.mssFd99.PGMe5mgyMNlIHuKTG9xu7Hq', 'candidate', 'free'),
('candidate11@test.com', '$2b$10$GEjWK2df.E8wdxLp6rw/I.mssFd99.PGMe5mgyMNlIHuKTG9xu7Hq', 'candidate', 'member'),
('candidate12@test.com', '$2b$10$GEjWK2df.E8wdxLp6rw/I.mssFd99.PGMe5mgyMNlIHuKTG9xu7Hq', 'candidate', 'member'),
('candidate13@test.com', '$2b$10$GEjWK2df.E8wdxLp6rw/I.mssFd99.PGMe5mgyMNlIHuKTG9xu7Hq', 'candidate', 'free'),
('candidate14@test.com', '$2b$10$GEjWK2df.E8wdxLp6rw/I.mssFd99.PGMe5mgyMNlIHuKTG9xu7Hq', 'candidate', 'free'),
('candidate15@test.com', '$2b$10$GEjWK2df.E8wdxLp6rw/I.mssFd99.PGMe5mgyMNlIHuKTG9xu7Hq', 'candidate', 'free'),
('employer@test.com', '$2b$10$GEjWK2df.E8wdxLp6rw/I.mssFd99.PGMe5mgyMNlIHuKTG9xu7Hq', 'employer', 'member');

INSERT INTO candidates (
    user_id,
    full_name,
    contact,
    education,
    major,
    years_experience,
    work_experience,
    skills,
    preferred_work_mode,
    preferred_location
)
VALUES
(1, 'Tien Bui', 'tiendat@email.com', 'Bachelor', 'Computer Science', 2,
 'Worked as a junior web developer intern building responsive websites.',
 'JavaScript, SQL, Node.js', 'Hybrid', 'Sydney'),

(2, 'Emily Nguyen', 'emily@email.com', 'Master', 'Data Science', 3,
 'Worked on data analysis projects using Python and machine learning models.',
 'Python, Data Analysis, Machine Learning', 'Remote', 'Melbourne'),

(3, 'Ronan Conroy', 'conroy@email.com', 'Bachelor', 'Information Technology', 1,
 'Completed university projects in web design and frontend development.',
 'HTML, CSS, JavaScript', 'Hybrid', 'Sydney'),

(4, 'Anh Quoc Nguyen', 'aqnguyen@email.com', 'Bachelor', 'Software Engineering', 4,
 'Worked as a backend developer building REST APIs and database systems.',
 'Node.js, Express, MySQL, API Development', 'On-site', 'Brisbane'),

(5, 'Van Trang Nguyen', 'dylannguyen@email.com', 'Master', 'Cyber Security', 2,
 'Assisted with security monitoring, vulnerability checks, and system support.',
 'Cybersecurity, Linux, Networking', 'On-site', 'Canberra'),

(6, 'To Infinity', 'toinfinity@email.com', 'Bachelor', 'Computer Science', 5,
 'Worked as a full stack developer on internal business applications.',
 'React, Node.js, MongoDB, JavaScript', 'Remote', 'Sydney'),

(7, 'And Beyond', 'andbeyond@email.com', 'Master', 'Artificial Intelligence', 3,
 'Built machine learning prototypes and analysed datasets for prediction tasks.',
 'Python, TensorFlow, Machine Learning, Data Science', 'Remote', 'Melbourne'),

(8, 'Porsche Nine', 'p911@email.com', 'Bachelor', 'Information Systems', 2,
 'Worked on business analysis documentation and system testing.',
 'Business Analysis, SQL, Testing, Documentation', 'Hybrid', 'Perth'),

(9, 'Lionel Messi', 'messi@email.com', 'Bachelor', 'Software Engineering', 6,
 'Developed enterprise applications and managed cloud deployment pipelines.',
 'Java, Spring Boot, AWS, SQL', 'Hybrid', 'Sydney'),

(10, 'Sophia Tran', 'sophiatran@email.com', 'Master', 'Data Analytics', 4,
 'Created dashboards and reports using BI tools and SQL databases.',
 'Power BI, SQL, Excel, Data Analysis', 'Remote', 'Adelaide'),

(11, 'Thomas Muller', 'thomas@email.com', 'Bachelor', 'Computer Science', 1,
 'Completed internship in mobile application development.',
 'React Native, JavaScript, Firebase', 'Hybrid', 'Sydney'),

(12, 'Kamala Harris', 'harris@email.com', 'Bachelor', 'Information Technology', 3,
 'Worked as a QA tester for web applications and API testing.',
 'Software Testing, Selenium, Postman, Jira', 'On-site', 'Melbourne'),

(13, 'Micheal Jackson', 'micheal@email.com', 'Master', 'Web Development', 2,
 'Built small business websites and maintained frontend components.',
 'HTML, CSS, JavaScript, PHP', 'Remote', 'Brisbane'),

(14, 'Max Verstappen', 'max@email.com', 'Master', 'Information Systems', 5,
 'Managed system requirements, stakeholder meetings, and project documentation.',
 'Project Management, Agile, Business Analysis, SQL', 'Hybrid', 'Sydney'),

(15, 'Alan Walker', 'alanwalker@email.com', 'Bachelor', 'Cloud Computing', 3,
 'Supported cloud infrastructure, deployment, and server monitoring.',
 'AWS, Docker, Linux, DevOps', 'Remote', 'Perth');


INSERT INTO employers (
    user_id,
    company_name,
    company_info,
    contact
)
VALUES
(
    16,
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
(1, 'Junior Web Developer',
 'TechHire Australia',
 'Build responsive websites using HTML, CSS, JavaScript and Node.js.',
 'Bachelor',
 'JavaScript, SQL, Node.js',
 1,
 'Hybrid',
 'Sydney'),

(1, 'Data Analyst',
 'TechHire Australia',
 'Analyse business data and create reports using Python and machine learning tools.',
 'Master',
 'Python, Data Analysis, Machine Learning',
 2,
 'Remote',
 'Melbourne'),

(1, 'Frontend Developer',
 'TechHire Australia',
 'Develop user interfaces using HTML, CSS, JavaScript and modern frontend practices.',
 'Bachelor',
 'HTML, CSS, JavaScript',
 1,
 'Hybrid',
 'Sydney'),

(1, 'Backend Developer',
 'TechHire Australia',
 'Develop backend APIs, database queries, and server-side business logic.',
 'Bachelor',
 'Node.js, Express, MySQL, API Development',
 2,
 'On-site',
 'Brisbane'),

(1, 'Cyber Security Assistant',
 'TechHire Australia',
 'Support security monitoring, vulnerability scanning, and network protection tasks.',
 'Diploma',
 'Cybersecurity, Linux, Networking',
 1,
 'On-site',
 'Canberra'),

(1, 'Full Stack Developer',
 'TechHire Australia',
 'Build and maintain full stack web applications using frontend and backend technologies.',
 'Bachelor',
 'React, Node.js, MongoDB, JavaScript',
 3,
 'Remote',
 'Sydney'),

(1, 'Machine Learning Developer',
 'TechHire Australia',
 'Develop machine learning models and assist with AI-related software prototypes.',
 'Master',
 'Python, TensorFlow, Machine Learning, Data Science',
 2,
 'Remote',
 'Melbourne'),

(1, 'Business Analyst',
 'TechHire Australia',
 'Collect system requirements, prepare documentation, and support software development teams.',
 'Bachelor',
 'Business Analysis, SQL, Testing, Documentation',
 2,
 'Hybrid',
 'Perth'),

(1, 'Java Developer',
 'TechHire Australia',
 'Develop enterprise-level applications using Java, Spring Boot, and SQL databases.',
 'Bachelor',
 'Java, Spring Boot, AWS, SQL',
 4,
 'Hybrid',
 'Sydney'),

(1, 'BI Reporting Analyst',
 'TechHire Australia',
 'Create dashboards, reporting solutions, and data visualisations for business users.',
 'Master',
 'Power BI, SQL, Excel, Data Analysis',
 3,
 'Remote',
 'Adelaide'),

(1, 'Mobile App Developer',
 'TechHire Australia',
 'Develop cross-platform mobile applications using React Native and Firebase.',
 'Bachelor',
 'React Native, JavaScript, Firebase',
 1,
 'Hybrid',
 'Sydney'),

(1, 'QA Tester',
 'TechHire Australia',
 'Test web applications, write test cases, and perform API testing.',
 'Bachelor',
 'Software Testing, Selenium, Postman, Jira',
 2,
 'On-site',
 'Melbourne'),

(1, 'PHP Web Developer',
 'TechHire Australia',
 'Develop and maintain PHP-based websites and frontend pages.',
 'Diploma',
 'HTML, CSS, JavaScript, PHP',
 1,
 'Remote',
 'Brisbane'),

(1, 'IT Project Coordinator',
 'TechHire Australia',
 'Assist project managers with Agile ceremonies, documentation, and project tracking.',
 'Master',
 'Project Management, Agile, Business Analysis, SQL',
 3,
 'Hybrid',
 'Sydney'),

(1, 'Cloud Support Engineer',
 'TechHire Australia',
 'Support cloud infrastructure, deployment pipelines, Docker containers, and Linux servers.',
 'Bachelor',
 'AWS, Docker, Linux, DevOps',
 2,
 'Remote',
 'Perth');


INSERT INTO applications (
    candidate_id,
    job_id,
    status
)
VALUES
(1, 1, 'submitted'),
(2, 2, 'accepted'),
(3, 3, 'submitted'),
(4, 4, 'accepted'),
(5, 5, 'rejected');