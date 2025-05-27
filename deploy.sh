#!/bin/bash

# Màu sắc cho output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Kiểm tra file .env
if [ ! -f .env ]; then
    echo -e "${RED}Error: .env file not found!${NC}"
    echo "Please create .env file with DOCKER_USERNAME=tranvanhung26092002"
    exit 1
fi

# Load biến môi trường từ file .env
source .env

# Kiểm tra DOCKER_USERNAME
if [ -z "$DOCKER_USERNAME" ]; then
    echo -e "${RED}Error: DOCKER_USERNAME not set in .env file${NC}"
    exit 1
fi

echo -e "${YELLOW}Starting deployment process...${NC}"

# Đăng nhập DockerHub
echo -e "${YELLOW}Logging into DockerHub...${NC}"
docker login -u tranvanhung26092002

# Build và push frontend
echo -e "${YELLOW}Building and pushing frontend...${NC}"

# Build Docker image
imageName="tranvanhung26092002/react-app:latest"
echo -e "${GREEN}Building Docker image: $imageName${NC}"
docker build -t $imageName .

# Push Docker image
echo -e "${GREEN}Pushing to DockerHub...${NC}"
docker push $imageName

# Kiểm tra kết quả push
if [ $? -ne 0 ]; then
    echo -e "${RED}Push failed!${NC}"
    exit 1
fi

# Pull image mới nhất và restart hệ thống
echo -e "${GREEN}Pulling latest images and restarting system...${NC}"
docker-compose pull
docker-compose down
docker-compose up -d

# Kiểm tra container có chạy thành công không
if [ $? -eq 0 ]; then
    echo -e "${GREEN}Deployment completed successfully!${NC}"
    echo -e "${YELLOW}Your frontend is running at: http://localhost:80${NC}"
else
    echo -e "${RED}Failed to start container!${NC}"
    exit 1
fi 