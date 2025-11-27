#!/bin/bash

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}   Starting LocalStack for S3          ${NC}"
echo -e "${BLUE}========================================${NC}"

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}✗ Docker is not running!${NC}"
    echo ""
    echo "Please start Docker Desktop and try again."
    echo ""
    echo "Steps:"
    echo "  1. Open Docker Desktop application"
    echo "  2. Wait for Docker to start (whale icon in menu bar)"
    echo "  3. Run this script again"
    exit 1
fi

echo -e "${GREEN}✓ Docker is running${NC}"

# Stop and remove existing container
echo ""
echo "Cleaning up old LocalStack container..."
docker stop jobhub-localstack > /dev/null 2>&1 || true
docker rm jobhub-localstack > /dev/null 2>&1 || true

# Start LocalStack
echo ""
echo "Starting LocalStack with CORS enabled..."
docker run -d \
  --name jobhub-localstack \
  -p 4566:4566 \
  -e SERVICES=s3 \
  -e DEFAULT_REGION=us-east-1 \
  -e DEBUG=1 \
  -e HOSTNAME_EXTERNAL=localhost \
  -e "EXTRA_CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000" \
  -e "EXTRA_CORS_ALLOWED_HEADERS=*" \
  localstack/localstack:latest

if [ $? -ne 0 ]; then
    echo -e "${RED}✗ Failed to start LocalStack${NC}"
    exit 1
fi

echo -e "${GREEN}✓ LocalStack container started${NC}"

# Wait for LocalStack to be ready
echo ""
echo "Waiting for LocalStack to be ready..."
MAX_ATTEMPTS=30
ATTEMPT=0

while [ $ATTEMPT -lt $MAX_ATTEMPTS ]; do
    if curl -s http://localhost:4566/_localstack/health > /dev/null 2>&1; then
        echo -e "${GREEN}✓ LocalStack is ready!${NC}"
        break
    fi
    ATTEMPT=$((ATTEMPT + 1))
    echo -n "."
    sleep 1
done

if [ $ATTEMPT -eq $MAX_ATTEMPTS ]; then
    echo ""
    echo -e "${RED}✗ LocalStack failed to start${NC}"
    echo "Check logs with: docker logs jobhub-localstack"
    exit 1
fi

# Wait a bit more for S3 to be fully initialized
echo ""
echo "Waiting for S3 service to be fully ready..."
sleep 3

# Create S3 bucket with retries
echo "Creating S3 bucket: jobhub-uploads..."
MAX_BUCKET_ATTEMPTS=5
BUCKET_ATTEMPT=0
BUCKET_CREATED=false

while [ $BUCKET_ATTEMPT -lt $MAX_BUCKET_ATTEMPTS ]; do


    if docker exec jobhub-localstack awslocal s3 mb s3://jobhub-uploads 2>/dev/null; then
        echo -e "  ${GREEN}✓ Bucket created successfully${NC}"
        BUCKET_CREATED=true
        break
    elif docker exec jobhub-localstack awslocal s3 ls s3://jobhub-uploads 2>/dev/null; then
        echo -e "  ${YELLOW}ℹ Bucket already exists${NC}"
        BUCKET_CREATED=true
        break
    fi
    
    if [ $BUCKET_ATTEMPT -lt $MAX_BUCKET_ATTEMPTS ]; then
        echo "  Attempt $BUCKET_ATTEMPT failed, retrying..."
        sleep 2
    fi
done

if [ "$BUCKET_CREATED" = false ]; then
    echo -e "  ${RED}⚠ Could not create bucket after $MAX_BUCKET_ATTEMPTS attempts${NC}"
    echo "  You may need to create it manually:"
    echo "  docker exec jobhub-localstack awslocal s3 mb s3://jobhub-uploads"
fi

# Set bucket ACL
echo "Setting bucket permissions..."
docker exec jobhub-localstack awslocal s3api put-bucket-acl --bucket jobhub-uploads --acl public-read 2>/dev/null && \
    echo -e "  ${GREEN}✓ Permissions set${NC}" || \
    echo -e "  ${YELLOW}⚠ Could not set permissions${NC}"

# Verify bucket
echo ""
echo "Verifying bucket..."
if docker exec jobhub-localstack awslocal s3 ls | grep -q jobhub-uploads; then
    echo -e "  ${GREEN}✓ Bucket 'jobhub-uploads' is ready${NC}"
    docker exec jobhub-localstack awslocal s3 ls
else
    echo -e "  ${RED}⚠ Warning: Bucket verification failed${NC}"
    echo "  Manual creation: docker exec jobhub-localstack awslocal s3 mb s3://jobhub-uploads"
fi

echo ""
echo -e "${BLUE}========================================${NC}"
echo -e "${GREEN}   LocalStack S3 Ready!                ${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""
echo -e "${BLUE}Details:${NC}"
echo "  Endpoint: http://localhost:4566"
echo "  Bucket: jobhub-uploads"
echo "  Region: us-east-1"
echo ""
echo -e "${BLUE}Useful Commands:${NC}"
echo "  List buckets:  docker exec jobhub-localstack awslocal s3 ls"
echo "  List files:    docker exec jobhub-localstack awslocal s3 ls s3://jobhub-uploads/"
echo "  View logs:     docker logs jobhub-localstack"
echo "  Stop:          docker stop jobhub-localstack"
echo ""
echo -e "${GREEN}You can now upload files!${NC}"
echo -e "${BLUE}========================================${NC}"

