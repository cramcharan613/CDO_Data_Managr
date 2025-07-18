#!/bin/bash

# Low Code D Deployment Script
# This script helps deploy the application in different environments

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Default values
ENVIRONMENT="development"
PORT="3000"
BUILD_ONLY=false
DOCKER_BUILD=false

# Help function
show_help() {
    echo "Usage: $0 [OPTIONS]"
    echo "Deploy Low Code D application"
    echo ""
    echo "Options:"
    echo "  -e, --environment   Environment (development, staging, production) [default: development]"
    echo "  -p, --port         Port number [default: 3000]"
    echo "  -b, --build-only   Only build, don't start server"
    echo "  -d, --docker       Build and run with Docker"
    echo "  -h, --help         Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0                              # Start development server"
    echo "  $0 -e production -p 8080       # Deploy to production on port 8080"
    echo "  $0 -b                          # Build only"
    echo "  $0 -d                          # Build and run with Docker"
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -e|--environment)
            ENVIRONMENT="$2"
            shift 2
            ;;
        -p|--port)
            PORT="$2"
            shift 2
            ;;
        -b|--build-only)
            BUILD_ONLY=true
            shift
            ;;
        -d|--docker)
            DOCKER_BUILD=true
            shift
            ;;
        -h|--help)
            show_help
            exit 0
            ;;
        *)
            echo "Unknown option: $1"
            show_help
            exit 1
            ;;
    esac
done

# Print deployment info
echo -e "${GREEN}🚀 Low Code D Deployment${NC}"
echo -e "Environment: ${YELLOW}$ENVIRONMENT${NC}"
echo -e "Port: ${YELLOW}$PORT${NC}"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed. Please install Node.js 18 or higher.${NC}"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node --version | cut -d 'v' -f 2 | cut -d '.' -f 1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo -e "${RED}❌ Node.js version 18 or higher is required. Current version: $(node --version)${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Node.js $(node --version) detected${NC}"

# Docker deployment
if [ "$DOCKER_BUILD" = true ]; then
    echo -e "${YELLOW}🐳 Building Docker image...${NC}"
    
    if ! command -v docker &> /dev/null; then
        echo -e "${RED}❌ Docker is not installed. Please install Docker.${NC}"
        exit 1
    fi
    
    # Build Docker image
    docker build -t low-code-d:latest .
    
    if [ "$BUILD_ONLY" = true ]; then
        echo -e "${GREEN}✅ Docker image built successfully!${NC}"
        exit 0
    fi
    
    # Stop existing container if running
    docker stop low-code-d 2>/dev/null || true
    docker rm low-code-d 2>/dev/null || true
    
    # Run Docker container
    echo -e "${YELLOW}🏃 Starting Docker container...${NC}"
    docker run -d --name low-code-d -p $PORT:80 low-code-d:latest
    
    echo -e "${GREEN}✅ Application deployed with Docker!${NC}"
    echo -e "🌐 Access the application at: ${YELLOW}http://localhost:$PORT${NC}"
    exit 0
fi

# Install dependencies
echo -e "${YELLOW}📦 Installing dependencies...${NC}"
npm ci

# Type checking
echo -e "${YELLOW}🔍 Running type checking...${NC}"
npm run type-check

# Linting
echo -e "${YELLOW}🔧 Running linting...${NC}"
npm run lint

# Build the application
echo -e "${YELLOW}🏗️ Building application...${NC}"
if [ "$ENVIRONMENT" = "production" ]; then
    NODE_ENV=production npm run build
else
    npm run build
fi

# Exit if build-only
if [ "$BUILD_ONLY" = true ]; then
    echo -e "${GREEN}✅ Build completed successfully!${NC}"
    echo -e "📁 Build files are in the 'dist' directory"
    exit 0
fi

# Start the application
echo -e "${YELLOW}🚀 Starting application...${NC}"

if [ "$ENVIRONMENT" = "production" ]; then
    # Production deployment
    echo -e "${GREEN}🌟 Starting production server...${NC}"
    PORT=$PORT npm run preview
else
    # Development deployment
    echo -e "${GREEN}🛠️ Starting development server...${NC}"
    PORT=$PORT npm run dev
fi

# Health check
echo -e "${YELLOW}🔍 Running health check...${NC}"
sleep 5
if curl -f http://localhost:$PORT/health &> /dev/null; then
    echo -e "${GREEN}✅ Health check passed!${NC}"
else
    echo -e "${YELLOW}⚠️ Health check endpoint not available (this is normal for development)${NC}"
fi

echo -e "${GREEN}🎉 Deployment completed successfully!${NC}"
echo -e "🌐 Access the application at: ${YELLOW}http://localhost:$PORT${NC}"
echo ""
echo -e "${YELLOW}📋 Available commands:${NC}"
echo -e "  npm run dev      - Start development server"
echo -e "  npm run build    - Build for production"
echo -e "  npm run preview  - Preview production build"
echo -e "  npm run lint     - Run linting"
echo -e "  npm run test     - Run tests"