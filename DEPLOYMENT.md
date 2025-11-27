# Deployment Guide

This document provides comprehensive deployment instructions for the JobHub application.

## Deployment Options

1. Docker Compose (Recommended for local/staging)
2. Manual Setup (Development)
3. Cloud Deployment (Production)

## Option 1: Docker Compose (Recommended)

This is the easiest way to get JobHub running with all dependencies.

### Prerequisites

- Docker 20.10+
- Docker Compose 2.0+
- 4GB RAM minimum

### Steps

1. Clone the repository:
```bash
git clone <repository-url>
cd jobhub
```

2. Start all services:
```bash
docker-compose up -d
```

3. Wait for services to be healthy (1-2 minutes):
```bash
docker-compose ps
```

4. Create S3 bucket:
   - Open http://localhost:55000/ui
   - Click "Create Bucket"
   - Enter: `jobhub-uploads`
   - Click "Create"

5. Seed database (optional):
```bash
./seed-db.sh
```

6. Access application:
   - Frontend: http://localhost:5173
   - Backend: http://localhost:8080
   - S3 Ninja: http://localhost:55000/ui

### Stopping Services

```bash
# Stop without removing data
docker-compose stop

# Stop and remove containers (keeps data)
docker-compose down

# Stop and remove everything including data
docker-compose down -v
```

## Option 2: Manual Setup (Development)

For local development without Docker.

### Prerequisites

- Java 17+
- Node.js 18+
- PostgreSQL 14+
- Docker (for S3 Ninja only)

### Step 1: Start S3 Ninja

```bash
./start-s3ninja.sh
```

Or manually:
```bash
docker run -d \
  --name jobhub-s3ninja \
  -p 55000:9000 \
  -v s3ninja-data:/home/sirius/data \
  scireum/s3-ninja:latest
```

Create bucket at: http://localhost:55000/ui

### Step 2: Setup Database

```bash
# Create database
createdb jobhub

# Or with psql
psql -U postgres -c "CREATE DATABASE jobhub;"
psql -U postgres -c "CREATE USER jobhub_user WITH PASSWORD 'jobhub_pass';"
psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE jobhub TO jobhub_user;"
```

### Step 3: Configure Backend

Edit `jobhub-backend/src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/jobhub
spring.datasource.username=jobhub_user
spring.datasource.password=jobhub_pass

aws.s3.endpoint=http://localhost:55000
aws.s3.bucket-name=jobhub-uploads
aws.s3.path-style-enabled=true
```

### Step 4: Start Backend

```bash
cd jobhub-backend
./gradlew bootRun
```

Backend: http://localhost:8080

### Step 5: Start Frontend

```bash
cd jobhub-frontend
npm install
npm run dev
```

Frontend: http://localhost:5173

### Step 6: Seed Database (Optional)

```bash
./seed-db.sh
```

## Option 3: Cloud Deployment (Production)

### AWS Deployment

#### Architecture
- Frontend: AWS S3 + CloudFront
- Backend: AWS ECS (Fargate)
- Database: AWS RDS (PostgreSQL)
- Storage: AWS S3
- Load Balancer: AWS ALB

#### Steps

1. Create RDS PostgreSQL database
2. Create S3 bucket for file uploads
3. Build Docker images
4. Push to AWS ECR
5. Deploy to ECS
6. Configure ALB
7. Deploy frontend to S3
8. Configure CloudFront

#### Environment Variables (Production)

```bash
# Database
SPRING_DATASOURCE_URL=jdbc:postgresql://your-rds-endpoint:5432/jobhub
SPRING_DATASOURCE_USERNAME=admin
SPRING_DATASOURCE_PASSWORD=<secure-password>

# S3 (use IAM roles instead of access keys)
AWS_S3_BUCKET_NAME=your-production-bucket
AWS_S3_REGION=us-east-1

# JWT
JWT_SECRET=<strong-random-secret>
JWT_ACCESS_TOKEN_EXPIRATION=900000
JWT_REFRESH_TOKEN_EXPIRATION=604800000
```

### Digital Ocean Deployment

#### Using App Platform

1. Connect GitHub repository
2. Configure services:
   - Backend: Docker (Spring Boot)
   - Frontend: Static Site (React)
   - Database: Managed PostgreSQL
   - Spaces: S3-compatible storage

3. Set environment variables

4. Deploy

### Heroku Deployment

#### Backend

```bash
# Login to Heroku
heroku login

# Create app
heroku create jobhub-backend

# Add PostgreSQL
heroku addons:create heroku-postgresql:mini

# Set environment variables
heroku config:set JWT_SECRET=<your-secret>
heroku config:set AWS_S3_BUCKET_NAME=<your-bucket>

# Deploy
git subtree push --prefix jobhub-backend heroku main
```

#### Frontend

```bash
# Create app
heroku create jobhub-frontend

# Add buildpack
heroku buildpacks:set mars/create-react-app

# Set environment
heroku config:set VITE_API_BASE_URL=https://jobhub-backend.herokuapp.com/api

# Deploy
git subtree push --prefix jobhub-frontend heroku main
```

## Configuration

### Environment Variables

#### Backend

Required:
- `SPRING_DATASOURCE_URL` - Database connection string
- `SPRING_DATASOURCE_USERNAME` - Database username
- `SPRING_DATASOURCE_PASSWORD` - Database password
- `JWT_SECRET` - Secret key for JWT signing
- `AWS_S3_BUCKET_NAME` - S3 bucket name

Optional (for S3 Ninja / LocalStack):
- `AWS_S3_ENDPOINT` - S3 endpoint URL
- `AWS_S3_PATH_STYLE_ENABLED` - Enable path-style access
- `AWS_S3_ACCESS_KEY` - S3 access key (use IAM role in production)
- `AWS_S3_SECRET_KEY` - S3 secret key (use IAM role in production)

#### Frontend

- `VITE_API_BASE_URL` - Backend API base URL

### Security Considerations

1. Never commit secrets to git
2. Use environment variables for all sensitive data
3. Use IAM roles instead of access keys in AWS
4. Enable HTTPS in production
5. Set up CORS properly
6. Use strong JWT secrets
7. Enable rate limiting
8. Set up monitoring and alerts

### Database Migrations

The application uses Hibernate's `ddl-auto=update` for schema management. For production:

1. Change to `ddl-auto=validate`
2. Use Flyway or Liquibase for migrations
3. Version control all schema changes

### Logging

#### Development
```properties
logging.level.com.github.yohannesTz.jobhub=DEBUG
```

#### Production
```properties
logging.level.com.github.yohannesTz.jobhub=INFO
logging.file.name=/var/log/jobhub/application.log
logging.file.max-size=10MB
logging.file.max-history=30
```

### Performance Tuning

#### Backend (Spring Boot)

```properties
# Connection pool
spring.datasource.hikari.maximum-pool-size=10
spring.datasource.hikari.minimum-idle=5

# JVM options
-Xms512m -Xmx2g
-XX:+UseG1GC
```

#### Frontend (React)

```javascript
// vite.config.js
export default defineConfig({
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
        }
      }
    }
  }
})
```

## Monitoring

### Health Checks

Backend health endpoint: `/actuator/health`

```bash
curl http://localhost:8080/actuator/health
```

### Metrics

Backend metrics endpoint: `/actuator/metrics`

Available metrics:
- JVM memory
- HTTP requests
- Database connections
- S3 operations

### Logging

Centralized logging with:
- ELK Stack (Elasticsearch, Logstash, Kibana)
- Datadog
- CloudWatch (AWS)
- Stackdriver (GCP)

## Backup and Recovery

### Database Backup

```bash
# Backup
pg_dump -U jobhub_user -h localhost jobhub > backup.sql

# Restore
psql -U jobhub_user -h localhost jobhub < backup.sql
```

### S3 Backup

```bash
# Backup from S3 Ninja
docker run --rm \
  -v s3ninja-data:/data \
  -v $(pwd):/backup \
  alpine tar czf /backup/s3-backup.tar.gz /data

# Sync to AWS S3 (for production migration)
aws s3 sync s3://jobhub-uploads s3://production-bucket
```

## Troubleshooting

### Application Won't Start

1. Check Docker is running
2. Verify ports are not in use
3. Check logs: `docker-compose logs`
4. Ensure minimum RAM requirements met

### Database Connection Error

1. Verify PostgreSQL is running
2. Check credentials in configuration
3. Test connection: `psql -U jobhub_user -h localhost jobhub`
4. Check firewall rules

### File Upload Not Working

1. Verify S3 Ninja is running: http://localhost:55000/ui
2. Check bucket exists: `jobhub-uploads`
3. Verify backend S3 configuration
4. Check CORS settings
5. Review backend logs for S3 errors

### Frontend Can't Connect to Backend

1. Check backend is running: http://localhost:8080/actuator/health
2. Verify VITE_API_BASE_URL is correct
3. Check CORS configuration in backend
4. Review browser console for errors

## Support

For deployment issues:
- Check Docker logs
- Review application logs
- Verify configurations
- Check system resources

Create an issue if problems persist.

