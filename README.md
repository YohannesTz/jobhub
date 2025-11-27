# JobHub - Job Portal Platform

A full-stack job portal application built with Spring Boot and React, featuring JWT authentication, S3-compatible storage, and role-based access control.

## Screenshots

### Landing Page
![Landing Page](screenshots/landing-main.png)
*Modern landing page with call-to-action*

### Job Listings
![Job Listings](screenshots/joblistings.png)
*Browse jobs without authentication*

![Job Detail](screenshots/joblistings-detail.png)
*Detailed job view with Apply Now button*

![Login Prompt](screenshots/joblistings-detail-loginprompt.png)
*Login prompt modal for unauthenticated users*

### Authentication
![Login Page](screenshots/login.png)
*Clean login interface*

![Create Account](screenshots/creat-account.png)
*User registration form*

![Talent Signup](screenshots/talent-signup.png)
*Talent signup process*

### User Dashboard
![Talent Dashboard](screenshots/talent-dashboard.png)
*User dashboard with application tracking*

![Talent Profile](screenshots/talent-profile.png)
*User profile management with file uploads*

![Apply to Job](screenshots/apply-to-job.png)
*Job application form*

### Company Dashboard
![Company Dashboard](screenshots/company-dashboard.png)
*Company dashboard and job management*

![Create Company](screenshots/company-dashboard-creat-company.png)
*Company profile creation*

![Post New Job](screenshots/post-new-job.png)
*Job posting form*

### Infrastructure
![S3 Ninja Dashboard](screenshots/s3-ninja-dashboard.png)
*S3 Ninja web interface for file management*

## Table of Contents

- [Features](#features)
- [Architecture](#architecture)
- [Quick Start with Docker](#quick-start-with-docker)
- [Development Setup (Without Docker)](#development-setup-without-docker)
- [Using S3 Ninja](#using-s3-ninja)
- [API Endpoints](#api-endpoints)
- [Authentication Flow](#authentication-flow)
- [Login Prompt Feature](#login-prompt-feature)
- [Database Schema](#database-schema)
- [Security Features](#security-features)
- [Technologies Used](#technologies-used)
- [Environment Variables](#environment-variables)
- [Production Deployment](#production-deployment)
- [Troubleshooting](#troubleshooting)
- [Development Scripts](#development-scripts)

## Features

### For Job Seekers (USER Role)
- Register and create profile
- Upload resume and profile picture to S3-compatible storage
- Browse and search jobs without authentication
- Apply to jobs with cover letter (requires login)
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

## Architecture

### Backend (Spring Boot)
- Java 17+ with Spring Boot 3.x
- Spring Security with JWT authentication
- Spring Data JPA with PostgreSQL
- AWS S3 SDK for file storage (compatible with S3 Ninja)
- RESTful API architecture

### Frontend (React)
- React 18 with Vite
- Zustand for state management
- React Router v6 for routing
- Axios with interceptors for API calls
- Tailwind CSS for styling

### Storage
- S3 Ninja - S3-compatible storage emulator for local development
- Supports presigned URLs for direct file uploads
- Compatible with AWS S3 API

## Quick Start with Docker

### Prerequisites
- Docker and Docker Compose installed
- At least 4GB of RAM available for Docker

### Running with Docker Compose

1. Clone the repository:
```bash
git clone <repository-url>
cd jobhub
```

2. Build and start all services:
```bash
docker-compose up -d
```

This will start:
- PostgreSQL database on port 5432
- S3 Ninja on port 55000
- Backend API on port 8080
- Frontend on port 5173

3. Access the application:
- Frontend: http://localhost:5173
- Backend API: http://localhost:8080
- S3 Ninja UI: http://localhost:55000/ui

4. Initialize the S3 bucket:
```bash
# Access S3 Ninja UI at http://localhost:55000/ui
# Click "Create Bucket"
# Enter bucket name: jobhub-uploads
# Click "Create"
```

5. Seed the database (optional):
```bash
./seed-db.sh
```

6. Stop all services:
```bash
docker-compose down
```

## Development Setup (Without Docker)

### Prerequisites
- Java 17+
- Node.js 18+
- PostgreSQL 14+
- Docker (for S3 Ninja)

### 1. Start S3 Ninja

S3 Ninja is an S3-compatible storage emulator for local development.

```bash
# Start S3 Ninja with Docker
docker run -d \
  --name jobhub-s3ninja \
  -p 55000:9000 \
  -v s3ninja-data:/home/sirius/data \
  scireum/s3-ninja:latest
```

Access S3 Ninja UI: http://localhost:55000/ui

#### Create S3 Bucket in S3 Ninja:
1. Open http://localhost:55000/ui
2. Click "Create Bucket"
3. Enter bucket name: `jobhub-uploads`
4. Click "Create"

#### S3 Ninja Features:
- Full S3 API compatibility
- Web-based UI for browsing files
- Support for presigned URLs
- No AWS account required
- Perfect for local development

### 2. Setup PostgreSQL Database

```bash
# Create database
createdb jobhub

# Or with psql
psql -U postgres
CREATE DATABASE jobhub;
CREATE USER jobhub_user WITH PASSWORD 'jobhub_pass';
GRANT ALL PRIVILEGES ON DATABASE jobhub TO jobhub_user;
\q
```

### 3. Configure Backend

Update `jobhub-backend/src/main/resources/application.properties`:

```properties
# Database Configuration
spring.datasource.url=jdbc:postgresql://localhost:5432/jobhub
spring.datasource.username=jobhub_user
spring.datasource.password=jobhub_pass

# JWT Configuration
jwt.secret=YOUR_SECRET_KEY_HERE
jwt.access-token-expiration=900000
jwt.refresh-token-expiration=604800000

# S3 Ninja Configuration
aws.s3.bucket-name=jobhub-uploads
aws.s3.region=us-east-1
aws.s3.access-key=AKIAIOSFODNN7EXAMPLE
aws.s3.secret-key=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
aws.s3.endpoint=http://localhost:55000
aws.s3.path-style-enabled=true
```

Note: The S3 access keys shown above are dummy values. S3 Ninja accepts any credentials.

### 4. Start Backend

```bash
cd jobhub-backend
./gradlew bootRun
```

Backend will start at: http://localhost:8080

### 5. Start Frontend

```bash
cd jobhub-frontend
npm install
npm run dev
```

Frontend will start at: http://localhost:5173

### 6. Seed Database (Optional)

```bash
./seed-db.sh
```

This creates:
- 1 Admin user (admin@admin.com / password123)
- 2 Company users (company@company.com, company2@company.com / password123)
- 3 Regular users (user@user.com, user2@user.com, user3@user.com / password123)
- 3 Companies
- 12 Job postings

## Using S3 Ninja

### Web Interface

Access the S3 Ninja web interface at: http://localhost:55000/ui

Features:
- View all buckets
- Browse files in buckets
- Upload files manually
- Delete files
- View file details

### API Compatibility

S3 Ninja is fully compatible with the AWS S3 API. The application uses:
- Presigned URLs for secure file uploads
- Path-style bucket access
- Standard S3 operations (PUT, GET, DELETE)

### File Upload Flow

1. Frontend requests a presigned URL from backend
2. Backend generates presigned URL using S3 Ninja endpoint
3. Frontend uploads file directly to S3 Ninja using presigned URL
4. Backend saves the file URL in database

### Accessing Uploaded Files

Files are accessible at:
```
http://localhost:55000/jobhub-uploads/[folder]/[filename]
```

Example:
- Profile pictures: http://localhost:55000/jobhub-uploads/profile-pictures/uuid-filename.jpg
- Resumes: http://localhost:55000/jobhub-uploads/resumes/uuid-filename.pdf

### S3 Ninja vs LocalStack

This project uses S3 Ninja instead of LocalStack for several reasons:
- Lighter weight and faster startup
- Simpler setup with single Docker command
- Built-in web UI for file management
- No additional configuration required
- Sufficient for S3-only use cases

If you need other AWS services, consider switching to LocalStack.

## API Endpoints

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

### Jobs (Public Endpoints)
- `GET /jobs` - List all jobs (no authentication required)
- `GET /jobs/{id}` - Get job details (no authentication required)

### Jobs (Protected Endpoints)
- `POST /jobs` - Create job (COMPANY role)
- `PUT /jobs/{id}` - Update job (COMPANY role)
- `DELETE /jobs/{id}` - Delete job (COMPANY or ADMIN role)

### Applications
- `POST /jobs/{jobId}/apply` - Apply to job (USER role)
- `GET /jobs/{jobId}/applications` - Get applications for job (COMPANY role)
- `GET /applications/me` - Get my applications (USER role)

### Companies
- `POST /companies` - Create company (COMPANY role)
- `GET /companies` - List all companies
- `GET /companies/{id}` - Get company details
- `PUT /companies/{id}` - Update company (COMPANY role)

### Admin
- `GET /admin/users` - Get all users (ADMIN role)
- `DELETE /admin/users/{id}` - Delete user (ADMIN role)
- `DELETE /admin/jobs/{id}` - Delete job (ADMIN role)

## Authentication Flow

1. User registers or logs in
2. Backend returns JWT access token (15 min) and refresh token (7 days)
3. Frontend stores tokens in localStorage
4. Access token included in Authorization header for all requests
5. When access token expires, frontend automatically refreshes using refresh token
6. If refresh fails or token expires, user is automatically logged out with message

## Login Prompt Feature

Users can browse jobs without logging in. When they try to apply:
1. A modal prompts them to login
2. After login, they are automatically redirected back to the job
3. They can then apply immediately

This provides a seamless experience for job seekers.

## Database Schema

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

## Security Features

- Password hashing with BCrypt
- JWT-based authentication
- Role-based access control
- CORS configuration
- Input validation
- Protected routes in React
- Automatic token refresh
- Secure file upload with presigned URLs
- Path-style S3 access for compatibility

## Technologies Used

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
- Tailwind CSS
- Zustand
- Axios
- React Router v6

### Infrastructure
- Docker & Docker Compose
- PostgreSQL 15
- S3 Ninja (S3-compatible storage)
- Nginx (for production frontend)

## Environment Variables

### Backend Environment Variables
```bash
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/jobhub
SPRING_DATASOURCE_USERNAME=jobhub_user
SPRING_DATASOURCE_PASSWORD=jobhub_pass
AWS_S3_ENDPOINT=http://localhost:55000
AWS_S3_BUCKET_NAME=jobhub-uploads
AWS_S3_ACCESS_KEY=AKIAIOSFODNN7EXAMPLE
AWS_S3_SECRET_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
AWS_S3_REGION=us-east-1
AWS_S3_PATH_STYLE_ENABLED=true
JWT_SECRET=your-secret-key
```

### Frontend Environment Variables
```bash
VITE_API_BASE_URL=http://localhost:8080/api
```

## Production Deployment

### Using AWS S3 Instead of S3 Ninja

For production, replace S3 Ninja with actual AWS S3:

1. Create an S3 bucket in AWS
2. Create IAM user with S3 permissions
3. Update application.properties:
```properties
aws.s3.bucket-name=your-production-bucket
aws.s3.region=us-east-1
aws.s3.access-key=YOUR_AWS_ACCESS_KEY
aws.s3.secret-key=YOUR_AWS_SECRET_KEY
# Remove these lines:
# aws.s3.endpoint=http://localhost:55000
# aws.s3.path-style-enabled=true
```

### Security Considerations

- Use environment variables for secrets
- Enable HTTPS
- Set up proper CORS policies
- Use strong JWT secret
- Enable rate limiting
- Set up proper logging and monitoring
- Regular security updates

## Troubleshooting

### S3 Ninja Connection Issues

```bash
# Check if S3 Ninja is running
docker ps | grep s3-ninja

# Restart S3 Ninja
docker restart jobhub-s3ninja

# View S3 Ninja logs
docker logs jobhub-s3ninja
```

### Database Connection Issues

```bash
# Check if PostgreSQL is running
docker ps | grep postgres

# Connect to database
psql -U jobhub_user -d jobhub -h localhost
```

### File Upload Issues

1. Ensure S3 Ninja is running: http://localhost:55000/ui
2. Verify bucket exists: `jobhub-uploads`
3. Check backend logs for S3 errors
4. Verify endpoint configuration in application.properties

### Backend Won't Start

```bash
# Check Java version
java -version

# Clean and rebuild
cd jobhub-backend
./gradlew clean build
```

### Frontend Won't Start

```bash
# Clear node modules and reinstall
cd jobhub-frontend
rm -rf node_modules package-lock.json
npm install
```

## Development Scripts

### Start All Services
```bash
docker-compose up -d
```

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
```

### Stop All Services
```bash
docker-compose down
```

### Reset Everything
```bash
# Stop and remove all containers, networks, volumes
docker-compose down -v
```

## License

This project is licensed under the MIT License.

## Support

For issues and questions, please create an issue in the repository.
