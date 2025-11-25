# JobHub - Job Portal Platform

A full-stack job portal application built with Spring Boot and React, featuring JWT authentication, AWS S3 integration, and role-based access control.

##  Architecture

### Backend (Spring Boot)
- **Java 17+** with Spring Boot 3.x
- **Spring Security** with JWT authentication
- **Spring Data JPA** with PostgreSQL
- **AWS S3** for file storage (resumes, profile pictures)
- **RESTful API** architecture

### Frontend (React)
- **React 18** with Vite
- **Zustand** for state management
- **React Router v6** for routing
- **Axios** with interceptors for API calls

##  Features

### For Job Seekers (USER Role)
- Register and create profile
- Upload resume and profile picture to S3
- Browse and search jobs
- Apply to jobs with cover letter
- Track application history
- View applied jobs in dashboard

### For Companies (COMPANY Role)
- Create and manage company profiles
- Post job listings
- View all applicants for each job
- Access candidate resumes
- Manage multiple companies

### For Admins (ADMIN Role)
- View all users and jobs
- Delete users (except other admins)
- Delete job posts
- System-wide moderation

##  Getting Started

### Prerequisites
- Java 17+
- Node.js 18+
- PostgreSQL 14+
- AWS Account (for S3)

### Backend Setup

1. **Configure PostgreSQL Database**
   ```sql
   CREATE DATABASE jobhub;
   ```

2. **Update application.properties**
   ```properties
   # Database
   spring.datasource.url=jdbc:postgresql://localhost:5432/jobhub
   spring.datasource.username=
   spring.datasource.password=
   
   # JWT Secret (use a strong secret in production)
   jwt.secret=
   
   # AWS S3
   aws.s3.bucket-name=
   aws.s3.region=us-east-1
   aws.s3.access-key=YOUR_AWS_ACCESS_KEY
   aws.s3.secret-key=YOUR_AWS_SECRET_KEY
   ```

3. **Run Backend**
   ```bash
   cd jobhub-backend
   ./gradlew bootRun
   ```
   Backend will start at `http://localhost:8080`

### Frontend Setup

1. **Install Dependencies**
   ```bash
   cd jobhub-frontend
   npm install
   ```

2. **Run Frontend**
   ```bash
   npm run dev
   ```
   Frontend will start at `http://localhost:3000`

##  API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login
- `POST /auth/refresh` - Refresh access token

### Users
- `GET /users/me` - Get current user profile
- `PUT /users/me` - Update profile
- `POST /users/me/profile-picture/upload-url` - Get S3 presigned URL for profile picture
- `POST /users/me/profile-picture` - Save profile picture URL
- `POST /users/me/resume/upload-url` - Get S3 presigned URL for resume
- `POST /users/me/resume` - Save resume URL

### Companies
- `POST /companies` - Create company (COMPANY role)
- `GET /companies` - List all companies
- `GET /companies/{id}` - Get company details
- `PUT /companies/{id}` - Update company

### Jobs
- `POST /jobs` - Create job (COMPANY role)
- `GET /jobs` - Search jobs (with pagination)
- `GET /jobs/{id}` - Get job details
- `PUT /jobs/{id}` - Update job
- `DELETE /jobs/{id}` - Delete job

### Applications
- `POST /jobs/{jobId}/apply` - Apply to job (USER role)
- `GET /jobs/{jobId}/applications` - Get applications for job (COMPANY role)
- `GET /applications/me` - Get my applications (USER role)
- `GET /applications/{id}` - Get application details

### Admin
- `GET /admin/users` - Get all users
- `DELETE /admin/users/{id}` - Delete user
- `DELETE /admin/jobs/{id}` - Delete job

##  Authentication Flow

1. User registers or logs in
2. Backend returns JWT access token (15 min) and refresh token (7 days)
3. Frontend stores tokens in localStorage
4. Access token included in Authorization header for all requests
5. When access token expires, frontend automatically refreshes using refresh token
6. If refresh fails, user is redirected to login

##  File Upload Flow

1. Frontend requests presigned S3 URL from backend
2. Backend generates presigned PUT URL (valid for 10 minutes)
3. Frontend uploads file directly to S3 using presigned URL
4. Frontend sends final S3 URL to backend to save in database

##  Database Schema

### User
- id (UUID, PK)
- name, email, password
- role (USER, COMPANY, ADMIN)
- profilePictureUrl, resumeUrl
- createdAt, updatedAt

### Company
- id (UUID, PK)
- name, description, website
- ownerId (FK → User)
- createdAt

### Job
- id (UUID, PK)
- title, description, requirements
- location, salary
- companyId (FK → Company)
- postedAt

### JobApplication
- id (UUID, PK)
- jobId (FK → Job)
- userId (FK → User)
- message, resumeUrl
- appliedAt
- Unique constraint on (jobId, userId)

### RefreshToken
- id (UUID, PK)
- token, userId (FK → User)
- expiryDate, createdAt

##  Security Features

- Password hashing with BCrypt
- JWT-based authentication
- Role-based access control (@PreAuthorize)
- CORS configuration
- Input validation (JSR-380)
- Protected routes in React
- Automatic token refresh
- Stateless session management

##  Frontend Structure

```
src/
├── api/              # API service modules
├── components/       # Reusable components
├── pages/           # Page components
│   ├── user/        # User dashboard & profile
│   ├── company/     # Company dashboard & job management
│   └── admin/       # Admin dashboard
├── store/           # Zustand state management
├── utils/           # Helper functions
└── App.jsx          # Main app with routes
```

##  Technologies Used

### Backend
- Spring Boot 3.x
- Spring Security
- Spring Data JPA
- PostgreSQL
- JWT (jjwt 0.12.3)
- AWS S3 SDK
- Lombok
- MapStruct

### Frontend
- React 18
- Vite
- Material-UI
- Zustand
- Axios
- React Router v6

##  Environment Variables

Create a `.env` file in the backend root (or use application.properties):

```env
DB_URL=jdbc:postgresql://localhost:5432/jobhub
DB_USERNAME=postgres
DB_PASSWORD=postgres
JWT_SECRET=
AWS_ACCESS_KEY=
AWS_SECRET_KEY=
AWS_BUCKET_NAME=
AWS_REGION=us-east-1
```
