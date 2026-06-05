# API Documentation

**Project:** Intelligent Talent Matching Platform  
**Subject:** CSIT314  
**Backend:** Node.js, Express.js, MySQL  
**Base URL:** `https://talentmatch.up.railway.app`  
**Local Development URL:** `http://localhost:3000`

---

## 1. API Overview

The Intelligent Talent Matching Platform backend exposes a REST API through a Node.js and Express.js server. The API supports user registration, login, membership updates, candidate profile management, employer profile management, job posting management, job applications, search and filtering, fuzzy search, and recommendation results.

The API is divided into the following modules:

| Module | Route Prefix | Purpose |
|---|---|---|
| Authentication | `/api/auth` | Handles registration, login, JWT generation, and membership updates. |
| Candidates | `/api/candidates` | Handles candidate profile retrieval, candidate profile update, and candidate searching. |
| Employers | `/api/employers` | Handles employer profile retrieval, employer profile update, and advanced candidate searching. |
| Jobs | `/api/jobs` | Handles job creation, job searching, job editing, job deletion, applications, and application status updates. |
| Recommendations | `/api/recommendations` | Handles candidate-to-job and employer-to-candidate recommendation results. |

All request and response data uses JSON format unless otherwise stated.

---

## 2. Authentication and Authorization

Most API endpoints require authentication. Protected requests must include a JSON Web Token in the `Authorization` header using the Bearer token format:

```http
Authorization: Bearer <token>
```

Public endpoints such as registration and login do not require a token. After a successful login, the backend returns a JWT token and user object. The frontend stores this token and includes it in later protected API requests.

Role-based access control is applied across the API:

- Candidate-only routes are restricted to users with the `candidate` role.
- Employer-only routes are restricted to users with the `employer` role.
- Candidate users cannot manage employer job postings.
- Employer users cannot modify candidate-only profile data.

---

## 3. Common Response Format

Successful responses return a JSON object, a JSON list, or a confirmation message.

Example success response:

```json
{
  "message": "Operation completed successfully."
}
```

Error responses follow this format:

```json
{
  "error": "Error message"
}
```

---

## 4. Common HTTP Status Codes

| Status Code | Meaning |
|---|---|
| `200 OK` | The request was completed successfully. |
| `201 Created` | A new record was created successfully. |
| `400 Bad Request` | Required fields are missing or invalid. |
| `401 Unauthorized` | The JWT token is missing, invalid, or expired. |
| `403 Forbidden` | The logged-in user does not have permission to access the endpoint. |
| `404 Not Found` | The requested profile, job, or application could not be found. |
| `500 Internal Server Error` | An unexpected server-side error occurred. |

---

## 5. API Endpoint Summary

| Module | Method | Endpoint | Role | Purpose |
|---|---|---|---|---|
| Auth | `POST` | `/api/auth/register` | Public | Register a new candidate or employer account. |
| Auth | `POST` | `/api/auth/login` | Public | Log in and return a JWT token with user details. |
| Auth | `PUT` | `/api/auth/membership` | Candidate / Employer | Update the logged-in user's membership status. |
| Candidates | `GET` | `/api/candidates/profile` | Candidate | Retrieve the logged-in candidate's profile. |
| Candidates | `PUT` | `/api/candidates/profile` | Candidate | Update the logged-in candidate's profile. |
| Candidates | `GET` | `/api/candidates` | Employer | Search and filter candidates using the candidates route. |
| Employers | `GET` | `/api/employers/profile` | Employer | Retrieve the logged-in employer's company profile. |
| Employers | `PUT` | `/api/employers/profile` | Employer | Update the logged-in employer's company profile. |
| Employers | `GET` | `/api/employers/search-candidates` | Employer | Search and filter candidates using the employer-side advanced search route. |
| Jobs | `POST` | `/api/jobs` | Employer | Create a new job posting. |
| Jobs | `GET` | `/api/jobs` | Candidate | Search and filter available job postings. |
| Jobs | `GET` | `/api/jobs/my-jobs` | Employer | Retrieve all jobs created by the logged-in employer. |
| Jobs | `GET` | `/api/jobs/:jobId` | Employer | Retrieve one job posting owned by the logged-in employer. |
| Jobs | `PUT` | `/api/jobs/:jobId` | Employer | Update one job posting owned by the logged-in employer. |
| Jobs | `DELETE` | `/api/jobs/:jobId` | Employer | Delete one job posting owned by the logged-in employer. |
| Applications | `POST` | `/api/jobs/:jobId/apply` | Candidate | Apply for a job posting. |
| Applications | `GET` | `/api/jobs/my-applications` | Candidate | Retrieve applications submitted by the logged-in candidate. |
| Applications | `GET` | `/api/jobs/applications` | Employer | Retrieve applications submitted to the employer's job postings. |
| Applications | `PUT` | `/api/jobs/applications/:applicationId/status` | Employer | Accept or reject a candidate application. |
| Recommendations | `GET` | `/api/recommendations/jobs` | Candidate | Retrieve recommended jobs for the logged-in candidate. |
| Recommendations | `GET` | `/api/recommendations/candidates/:jobId` | Employer | Retrieve recommended candidates for a selected job. |

---

# 6. Authentication Endpoints

## 6.1 Register User

**Endpoint:** `POST /api/auth/register`

**Description:** Creates a new user account. The user can register as either a candidate or an employer. The backend validates required fields, checks that the selected role is valid, prevents duplicate email registration, hashes the password using bcrypt, creates a user record, and then creates the related candidate or employer profile record.

**Authentication:** Not required.

**Request Body:**

```json
{
  "email": "candidate@example.com",
  "password": "password123",
  "role": "candidate"
}
```

**Successful Response:** `201 Created`

```json
{
  "message": "Registration successful.",
  "userId": 1,
  "role": "candidate"
}
```

**Possible Error Responses:**

```json
{ "error": "Email, password, and role are required." }
```

```json
{ "error": "Invalid role." }
```

```json
{ "error": "Email already registered." }
```

```json
{ "error": "Server error during registration." }
```

---

## 6.2 Login User

**Endpoint:** `POST /api/auth/login`

**Description:** Authenticates an existing user. The backend checks whether the email exists, compares the entered password with the stored hashed password using bcrypt, and returns a JWT token if the credentials are valid.

**Authentication:** Not required.

**Request Body:**

```json
{
  "email": "candidate@example.com",
  "password": "password123"
}
```

**Successful Response:** `200 OK`

```json
{
  "message": "Login successful.",
  "token": "jwt_token_here",
  "user": {
    "id": 1,
    "email": "candidate@example.com",
    "role": "candidate",
    "membership": "free"
  }
}
```

**Possible Error Responses:**

```json
{ "error": "Email and password are required." }
```

```json
{ "error": "Invalid email or password." }
```

```json
{ "error": "Server error during login." }
```

---

## 6.3 Update Membership

**Endpoint:** `PUT /api/auth/membership`

**Description:** Updates the logged-in user's membership status. The system supports two membership values: `free` and `member`. The membership value is used by the recommendation system to determine whether to return only the Top 10 recommendation results or the full ranked list.

**Authentication:** Required.  
**Allowed Roles:** Candidate or Employer.

**Request Body:**

```json
{
  "membership": "member"
}
```

**Successful Response:** `200 OK`

```json
{
  "message": "Membership updated successfully.",
  "membership": "member"
}
```

**Possible Error Responses:**

```json
{ "error": "User ID and membership are required." }
```

```json
{ "error": "Invalid membership type." }
```

```json
{ "error": "Invalid or expired token." }
```

```json
{ "error": "Server error updating membership." }
```

---

# 7. Candidate Endpoints

## 7.1 Get Candidate Profile

**Endpoint:** `GET /api/candidates/profile`

**Description:** Returns the profile of the currently logged-in candidate. The profile includes the candidate's full name, contact details, education, major, years of experience, work experience, skills, preferred work mode, and preferred location.

**Authentication:** Required.  
**Allowed Role:** Candidate.

**Successful Response:** `200 OK`

```json
{
  "id": 1,
  "user_id": 1,
  "full_name": "Tien Dat Bui",
  "contact": "candidate@example.com",
  "education": "Bachelor",
  "major": "Computer Science",
  "years_experience": 2,
  "work_experience": "Internship and software project experience.",
  "skills": "JavaScript, SQL, Node.js",
  "preferred_work_mode": "Hybrid",
  "preferred_location": "Sydney"
}
```

**Possible Error Responses:**

```json
{ "error": "Only candidates can access this." }
```

```json
{ "error": "Candidate profile not found." }
```

```json
{ "error": "Server error loading candidate profile." }
```

---

## 7.2 Update Candidate Profile

**Endpoint:** `PUT /api/candidates/profile`

**Description:** Updates the logged-in candidate's profile. The backend validates that years of experience is not negative and that the preferred work mode is one of the accepted values: `Remote`, `On-site`, or `Hybrid`.

**Authentication:** Required.  
**Allowed Role:** Candidate.

**Request Body:**

```json
{
  "full_name": "Tien Dat Bui",
  "contact": "candidate@example.com",
  "education": "Bachelor",
  "major": "Computer Science",
  "years_experience": 2,
  "work_experience": "Completed frontend and backend development projects.",
  "skills": "JavaScript, SQL, Node.js",
  "preferred_work_mode": "Hybrid",
  "preferred_location": "Sydney"
}
```

**Successful Response:** `200 OK`

```json
{ "message": "Candidate profile updated successfully." }
```

**Possible Error Responses:**

```json
{ "error": "Years of experience cannot be negative." }
```

```json
{ "error": "Invalid preferred work mode." }
```

```json
{ "error": "Only candidates can update this." }
```

```json
{ "error": "Server error updating candidate profile." }
```

---

## 7.3 Search and Filter Candidates

**Endpoint:** `GET /api/candidates`

**Description:** Allows employers to search and filter candidate profiles. Structured filters are applied using SQL conditions, and keyword search is processed using Fuse.js fuzzy search.

**Authentication:** Required.  
**Allowed Role:** Employer.

**Query Parameters:**

| Parameter | Description | Example |
|---|---|---|
| `keyword` | Fuzzy keyword search across candidate fields. | `keyword=javascript` |
| `education` | Filters candidates by education level. | `education=Bachelor` |
| `location` | Filters candidates by preferred location. | `location=Sydney` |
| `work_mode` | Filters candidates by preferred work mode. | `work_mode=Hybrid` |
| `min_experience` | Filters candidates with at least this many years of experience. | `min_experience=2` |

**Example Request:**

```http
GET /api/candidates?keyword=javascript&location=Sydney&work_mode=Hybrid&min_experience=1
```

**Successful Response:** `200 OK`

```json
[
  {
    "id": 1,
    "user_id": 1,
    "full_name": "Tien Dat Bui",
    "email": "candidate@example.com",
    "education": "Bachelor",
    "major": "Computer Science",
    "years_experience": 2,
    "work_experience": "Frontend and backend project experience.",
    "skills": "JavaScript, SQL, Node.js",
    "preferred_work_mode": "Hybrid",
    "preferred_location": "Sydney"
  }
]
```

**Possible Error Responses:**

```json
{ "error": "Only employers can view candidates." }
```

```json
{ "error": "Server error searching candidates." }
```

---

# 8. Employer Endpoints

## 8.1 Get Employer Profile

**Endpoint:** `GET /api/employers/profile`

**Description:** Returns the company profile for the currently logged-in employer.

**Authentication:** Required.  
**Allowed Role:** Employer.

**Successful Response:** `200 OK`

```json
{
  "company_name": "Business Techno",
  "company_info": "A company hiring technology candidates.",
  "contact": "hr@businesstechno.com"
}
```

**Possible Error Responses:**

```json
{ "error": "Forbidden" }
```

```json
{ "error": "Employer profile not found." }
```

```json
{ "error": "Server error loading profile." }
```

---

## 8.2 Update Employer Profile

**Endpoint:** `PUT /api/employers/profile`

**Description:** Updates the logged-in employer's company profile. The backend requires a company name before updating the profile.

**Authentication:** Required.  
**Allowed Role:** Employer.

**Request Body:**

```json
{
  "company_name": "Business Techno",
  "company_info": "A company hiring technology candidates.",
  "contact": "hr@businesstechno.com"
}
```

**Successful Response:** `200 OK`

```json
{ "message": "Company profile updated successfully." }
```

**Possible Error Responses:**

```json
{ "error": "Company name is required." }
```

```json
{ "error": "Forbidden" }
```

```json
{ "error": "Employer profile not found to update." }
```

```json
{ "error": "Server error updating profile." }
```

---

## 8.3 Advanced Candidate Search

**Endpoint:** `GET /api/employers/search-candidates`

**Description:** Provides the employer-side advanced candidate search used by the employer dashboard. The route first applies structured SQL filters such as education, location, work mode, and minimum experience. If a keyword is provided, the filtered results are then processed using Fuse.js fuzzy search. This supports typo-tolerant and approximate searching.

**Authentication:** Required.  
**Allowed Role:** Employer.

**Query Parameters:**

| Parameter | Description | Example |
|---|---|---|
| `keyword` | Fuzzy search keyword. | `keyword=software` |
| `education` | Candidate education filter. | `education=Bachelor` |
| `location` | Candidate preferred location filter. | `location=Sydney` |
| `work_mode` | Candidate preferred work mode filter. | `work_mode=Remote` |
| `min_experience` | Minimum years of experience. | `min_experience=1` |

**Example Request:**

```http
GET /api/employers/search-candidates?keyword=software&education=Bachelor&location=Sydney&work_mode=Remote&min_experience=1
```

---

# 9. Job Endpoints

## 9.1 Create Job Posting

**Endpoint:** `POST /api/jobs`

**Description:** Allows an employer to create a new job posting. The backend checks that the user is an employer, finds the employer profile, validates required fields, validates years of experience, validates work mode, and inserts the job into the database.

**Authentication:** Required.  
**Allowed Role:** Employer.

**Request Body:**

```json
{
  "job_title": "Junior Web Developer",
  "company_info": "Business Techno",
  "job_description": "Build responsive websites using HTML, CSS, JavaScript and Node.js.",
  "required_education": "Bachelor",
  "required_skills": "JavaScript, SQL, Node.js",
  "years_experience": 1,
  "work_mode": "Hybrid",
  "job_location": "Sydney"
}
```

**Successful Response:** `201 Created`

```json
{ "message": "Job created successfully." }
```

---

## 9.2 Search and Filter Jobs

**Endpoint:** `GET /api/jobs`

**Description:** Allows candidates to browse, search, and filter job postings. SQL filters are applied for location, work mode, education, and maximum required experience. If a keyword is provided, Fuse.js is used to perform fuzzy keyword search across job title, company name, company information, job description, required skills, required education, work mode, and job location.

**Authentication:** Required.  
**Allowed Role:** Candidate.

**Query Parameters:**

| Parameter | Description | Example |
|---|---|---|
| `keyword` | Fuzzy keyword search across job fields. | `keyword=developer` |
| `location` | Job location filter. | `location=Sydney` |
| `work_mode` | Work mode filter. | `work_mode=Hybrid` |
| `education` | Required education filter. | `education=Bachelor` |
| `max_experience` | Maximum years of experience required by the job. | `max_experience=2` |

---

## 9.3 Get Employer's Own Job Postings

**Endpoint:** `GET /api/jobs/my-jobs`

**Description:** Returns all job postings created by the logged-in employer, ordered by creation date.

**Authentication:** Required.  
**Allowed Role:** Employer.

---

## 9.4 Get Single Job Posting

**Endpoint:** `GET /api/jobs/:jobId`

**Description:** Returns one job posting owned by the logged-in employer. This endpoint can be used when loading job details for editing.

**Authentication:** Required.  
**Allowed Role:** Employer.

---

## 9.5 Update Job Posting

**Endpoint:** `PUT /api/jobs/:jobId`

**Description:** Updates a job posting owned by the logged-in employer. The backend validates ownership, required fields, years of experience, and work mode before updating the job.

**Authentication:** Required.  
**Allowed Role:** Employer.

---

## 9.6 Delete Job Posting

**Endpoint:** `DELETE /api/jobs/:jobId`

**Description:** Deletes a job posting owned by the logged-in employer. Related applications are deleted before the job is removed, preventing orphaned application records.

**Authentication:** Required.  
**Allowed Role:** Employer.

---

# 10. Application Endpoints

## 10.1 Apply for Job

**Endpoint:** `POST /api/jobs/:jobId/apply`

**Description:** Allows a candidate to apply for a job posting. The backend checks the candidate profile, prevents duplicate applications, and inserts a new application record with the default `submitted` status.

**Authentication:** Required.  
**Allowed Role:** Candidate.

---

## 10.2 Get Candidate's Applications

**Endpoint:** `GET /api/jobs/my-applications`

**Description:** Returns all applications submitted by the logged-in candidate, including job details and company name.

**Authentication:** Required.  
**Allowed Role:** Candidate.

---

## 10.3 Get Employer's Applications

**Endpoint:** `GET /api/jobs/applications`

**Description:** Returns all applications submitted to jobs owned by the logged-in employer. The response includes application status, job title, candidate profile details, and candidate email.

**Authentication:** Required.  
**Allowed Role:** Employer.

---

## 10.4 Update Application Status

**Endpoint:** `PUT /api/jobs/applications/:applicationId/status`

**Description:** Allows an employer to accept or reject an application submitted to one of their own job postings. The backend verifies that the employer owns the related job before updating the application status.

**Authentication:** Required.  
**Allowed Role:** Employer.

**Request Body:**

```json
{
  "status": "accepted"
}
```

---

# 11. Recommendation Endpoints

## 11.1 Get Recommended Jobs

**Endpoint:** `GET /api/recommendations/jobs`

**Description:** Returns job recommendations for the logged-in candidate. The backend calculates a match score by comparing the candidate profile with each job posting. Scoring considers skill matches, education alignment, years of experience, preferred work mode, and preferred location. Results are sorted from highest score to lowest score.

**Membership Rule:**

- Free users receive a maximum of 10 recommended jobs.
- Member users receive the full ranked recommendation list.

**Authentication:** Required.  
**Allowed Role:** Candidate.

---

## 11.2 Get Recommended Candidates for a Job

**Endpoint:** `GET /api/recommendations/candidates/:jobId`

**Description:** Returns recommended candidates for a selected job owned by the logged-in employer. The backend calculates a match score by comparing the job requirements with each candidate profile. Scoring considers matching skills, education, years of experience, preferred work mode, and preferred location. The employer-side candidate recommendation response also includes `match_reasons` to explain why a candidate was recommended.

**Membership Rule:**

- Free users receive a maximum of 10 recommended candidates.
- Member users receive the full ranked recommendation list.

**Authentication:** Required.  
**Allowed Role:** Employer.

---

# 12. Search and Filtering Design

The API supports keyword search, structured filters, combined keyword and filter search, and fuzzy search.

## 12.1 Candidate Job Search

Candidate job search uses:

```http
GET /api/jobs
```

This allows candidates to filter jobs by location, work mode, required education, and maximum required years of experience. When a keyword is entered, Fuse.js is used to match across job title, company name, company information, job description, required skills, required education, work mode, and job location.

## 12.2 Employer Candidate Search

Employer candidate search uses:

```http
GET /api/employers/search-candidates
```

This allows employers to filter candidates by education, preferred location, preferred work mode, and minimum years of experience. When a keyword is entered, Fuse.js is used to match candidate-related fields such as full name, skills, major, and work experience.

---

# 13. Membership-Based Recommendation Rule

The recommendation system applies the Week 8 membership requirement.

| User Type | Membership Status | Recommendation Limit |
|---|---|---|
| Candidate | Free | Maximum Top 10 recommended jobs |
| Candidate | Member | Unlimited recommended jobs |
| Employer | Free | Maximum Top 10 recommended candidates |
| Employer | Member | Unlimited recommended candidates |

---

# 14. API Security Summary

The API applies the following security and reliability controls:

1. **Password hashing:** User passwords are hashed using bcrypt before being stored in the database.
2. **JWT authentication:** Protected routes require a valid JWT token in the Authorization header.
3. **Role-based access control:** Candidate-only and employer-only functions check the user role before allowing access.
4. **Parameterized SQL queries:** SQL queries use placeholders to reduce SQL injection risk.
5. **Environment variables:** Database connection values and JWT secrets are stored in environment variables.
6. **Error handling:** Errors are returned in JSON format so the frontend can show readable messages to users.

---

# 15. API Design Summary

The API structure separates the platform into clear modules: authentication, candidate management, employer management, job management, application management, and recommendations. This modular structure improves maintainability because each route file is responsible for a specific area of the system.

The API supports the main functional requirements of the Intelligent Talent Matching Platform:

- Candidates can register, log in, manage profiles, search jobs, apply for jobs, view applications, and receive job recommendations.
- Employers can register, log in, manage company profiles, create and manage job postings, review applications, search candidates, and receive candidate recommendations.
- Member users can access unlimited recommendation results, while free users are limited to the Top 10 results.
- Keyword search, filter search, combined keyword plus filter search, and fuzzy search are supported through SQL filtering and Fuse.js fuzzy matching.
