# Docker Deployment Guide

This guide explains how to run JobHub using Docker and Docker Compose.

## Prerequisites

- Docker 20.10+
- Docker Compose 2.0+
- At least 4GB RAM available for Docker

## Quick Start

### 1. Build and Start All Services

```bash
docker-compose up -d
```

This command will:
- Build the backend Spring Boot application
- Build the frontend React application
- Start PostgreSQL database
- Start S3 Ninja storage emulator
- Start all services in the background

### 2. Wait for Services to be Healthy

Check service status:
```bash
docker-compose ps
```

All services should show "healthy" status after 1-2 minutes.

### 3. Initialize S3 Bucket

Open S3 Ninja UI: http://localhost:55000/ui

- Click "Create Bucket"
- Enter bucket name: `jobhub-uploads`
- Click "Create"

### 4. Access the Application

- Frontend: http://localhost:5173
- Backend API: http://localhost:8080
- S3 Ninja UI: http://localhost:55000/ui
- API Documentation: http://localhost:8080/swagger-ui.html (if configured)

### 5. Seed Database (Optional)

```bash
./seed-db.sh
```

## Service Details

### PostgreSQL (Port 5432)

Database service with persistent storage.

```bash
# Access database
docker exec -it jobhub-postgres psql -U jobhub_user -d jobhub

# View database logs
docker-compose logs postgres
```

### S3 Ninja (Port 55000)

S3-compatible storage emulator with web UI.

```bash
# Access S3 Ninja container
docker exec -it jobhub-s3ninja sh

# View S3 Ninja logs
docker-compose logs s3ninja
```

S3 Ninja UI: http://localhost:55000/ui

### Backend (Port 8080)

Spring Boot REST API.

```bash
# View backend logs
docker-compose logs -f backend

# View last 100 lines
docker-compose logs --tail=100 backend

# Restart backend
docker-compose restart backend
```

Health check: http://localhost:8080/actuator/health

### Frontend (Port 5173)

React application served by Nginx.

```bash
# View frontend logs
docker-compose logs -f frontend

# Restart frontend
docker-compose restart frontend
```

## Common Docker Commands

### View All Services
```bash
docker-compose ps
```

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres
docker-compose logs -f s3ninja
```

### Restart Services
```bash
# Restart all
docker-compose restart

# Restart specific service
docker-compose restart backend
```

### Stop Services
```bash
# Stop all services (keeps data)
docker-compose stop

# Stop and remove containers (keeps data)
docker-compose down

# Stop and remove everything including volumes (removes data)
docker-compose down -v
```

### Rebuild Services
```bash
# Rebuild and restart all
docker-compose up -d --build

# Rebuild specific service
docker-compose up -d --build backend
```

## Environment Variables

You can customize the deployment by setting environment variables in a `.env` file:

```bash
# .env file
POSTGRES_PASSWORD=custom_password
JWT_SECRET=custom_secret_key
S3_NINJA_PORT=55000
BACKEND_PORT=8080
FRONTEND_PORT=5173
```

## Volumes and Data Persistence

The docker-compose configuration uses named volumes for data persistence:

- `postgres_data` - Database files
- `s3ninja_data` - Uploaded files

### Backup Data
```bash
# Backup PostgreSQL
docker exec jobhub-postgres pg_dump -U jobhub_user jobhub > backup.sql

# Backup S3 data
docker run --rm -v jobhub_s3ninja_data:/data -v $(pwd):/backup alpine \
  tar czf /backup/s3-backup.tar.gz /data
```

### Restore Data
```bash
# Restore PostgreSQL
cat backup.sql | docker exec -i jobhub-postgres psql -U jobhub_user -d jobhub

# Restore S3 data
docker run --rm -v jobhub_s3ninja_data:/data -v $(pwd):/backup alpine \
  tar xzf /backup/s3-backup.tar.gz -C /
```

### Clean All Data
```bash
# Warning: This will delete all data!
docker-compose down -v
```

## Troubleshooting

### Service Won't Start

Check logs:
```bash
docker-compose logs [service-name]
```

Common issues:
- Port already in use
- Insufficient memory
- Build errors

### Database Connection Error

1. Check if PostgreSQL is healthy:
```bash
docker-compose ps postgres
```

2. Wait for health check to pass (up to 30 seconds)

3. Verify connection:
```bash
docker exec jobhub-postgres pg_isready -U jobhub_user
```

### File Upload Not Working

1. Check S3 Ninja is running:
```bash
docker-compose ps s3ninja
```

2. Verify bucket exists:
   - Open http://localhost:55000/ui
   - Check for `jobhub-uploads` bucket

3. Create bucket if missing:
   - Click "Create Bucket" in UI
   - Enter `jobhub-uploads`

### Backend Health Check Failing

1. Check backend logs:
```bash
docker-compose logs backend
```

2. Wait for database migration to complete

3. Verify all environment variables are set

### Frontend Not Loading

1. Check Nginx logs:
```bash
docker-compose logs frontend
```

2. Verify backend is accessible:
```bash
curl http://localhost:8080/actuator/health
```

3. Check browser console for errors

## Production Considerations

### Security

1. Change default passwords:
```yaml
POSTGRES_PASSWORD=strong_random_password
JWT_SECRET=strong_random_secret
```

2. Use secrets management:
```bash
# Docker secrets
docker secret create postgres_password password.txt
```

3. Enable HTTPS with reverse proxy (Nginx, Traefik)

### Performance

1. Adjust resource limits in docker-compose.yml:
```yaml
services:
  backend:
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 2G
```

2. Configure JVM options:
```yaml
environment:
  JAVA_OPTS: -Xms512m -Xmx2g
```

3. Enable caching for frontend static files

### Monitoring

1. Add monitoring services:
   - Prometheus for metrics
   - Grafana for dashboards
   - ELK stack for logs

2. Configure health checks for all services

3. Set up alerts for service failures

## Scaling

### Horizontal Scaling

Run multiple backend instances behind a load balancer:

```yaml
services:
  backend:
    deploy:
      replicas: 3
```

### Database Replication

Set up PostgreSQL primary-replica configuration for read scaling.

### S3 Migration

For production, migrate from S3 Ninja to AWS S3:

1. Create S3 bucket in AWS
2. Update backend environment:
```yaml
AWS_S3_ENDPOINT: ""  # Remove for AWS S3
AWS_S3_PATH_STYLE_ENABLED: "false"
AWS_S3_ACCESS_KEY: actual_aws_key
AWS_S3_SECRET_KEY: actual_aws_secret
```

## Development Workflow

### Local Development with Docker

1. Start only dependencies:
```yaml
# docker-compose.dev.yml
services:
  postgres:
    # ... same as main
  s3ninja:
    # ... same as main
```

```bash
docker-compose -f docker-compose.dev.yml up -d
```

2. Run backend and frontend locally

### Hot Reload

For development with hot reload:

1. Mount source code as volume:
```yaml
services:
  backend:
    volumes:
      - ./jobhub-backend/src:/app/src
```

2. Use development mode

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Build and Deploy

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Build images
        run: docker-compose build
      - name: Push to registry
        run: docker-compose push
```

### Deploy to Cloud

Deploy to AWS ECS, Azure Container Instances, or Google Cloud Run using the Docker images.

## Support

For issues with Docker deployment, check:
- Docker logs: `docker-compose logs`
- Docker status: `docker-compose ps`
- System resources: `docker stats`

Create an issue if problems persist.

