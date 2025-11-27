#!/bin/bash

# Script to start S3 Ninja for local development

set -e

echo "================================================"
echo "Starting S3 Ninja for JobHub"
echo "================================================"
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "Error: Docker is not running. Please start Docker first."
    exit 1
fi

# Stop existing S3 Ninja container if running
if docker ps -a --format '{{.Names}}' | grep -q "^jobhub-s3ninja$"; then
    echo "Stopping existing S3 Ninja container..."
    docker stop jobhub-s3ninja > /dev/null 2>&1 || true
    docker rm jobhub-s3ninja > /dev/null 2>&1 || true
fi

# Start S3 Ninja
echo "Starting S3 Ninja container..."
docker run -d \
  --name jobhub-s3ninja \
  -p 55000:9000 \
  -v s3ninja-data:/home/sirius/data \
  scireum/s3-ninja:latest

# Wait for S3 Ninja to be ready
echo "Waiting for S3 Ninja to start..."
for i in {1..30}; do
    if curl -s http://localhost:55000/ui > /dev/null 2>&1; then
        echo "S3 Ninja is ready!"
        break
    fi
    if [ $i -eq 30 ]; then
        echo "Error: S3 Ninja failed to start within 30 seconds"
        docker logs jobhub-s3ninja
        exit 1
    fi
    sleep 1
done

echo ""
echo "================================================"
echo "S3 Ninja started successfully!"
echo "================================================"
echo ""
echo "S3 Ninja UI: http://localhost:55000/ui"
echo "API Endpoint: http://localhost:55000"
echo ""
echo "Next steps:"
echo "1. Open http://localhost:55000/ui in your browser"
echo "2. Click 'Create Bucket'"
echo "3. Enter bucket name: jobhub-uploads"
echo "4. Click 'Create'"
echo ""
echo "Or use AWS CLI:"
echo "  aws s3 mb s3://jobhub-uploads --endpoint-url http://localhost:55000"
echo ""
echo "To stop S3 Ninja:"
echo "  docker stop jobhub-s3ninja"
echo ""
echo "To view logs:"
echo "  docker logs jobhub-s3ninja"
echo ""

