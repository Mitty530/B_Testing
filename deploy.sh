#!/bin/bash

# Borouge ESG Intelligence Platform - Deployment Script
# This script prepares and deploys the application to Vercel

set -e  # Exit on any error

echo "🚀 Borouge ESG Intelligence Platform - Deployment Script"
echo "======================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if required tools are installed
check_dependencies() {
    print_status "Checking dependencies..."
    
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 18 or later."
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed. Please install npm."
        exit 1
    fi
    
    # Check Node.js version
    NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        print_error "Node.js version 18 or later is required. Current version: $(node --version)"
        exit 1
    fi
    
    print_success "Dependencies check passed"
}

# Install dependencies
install_dependencies() {
    print_status "Installing dependencies..."
    
    # Install root dependencies
    print_status "Installing root dependencies..."
    npm install
    
    # Install frontend dependencies
    print_status "Installing frontend dependencies..."
    cd frontend
    npm install
    cd ..
    
    print_success "Dependencies installed successfully"
}

# Build frontend
build_frontend() {
    print_status "Building frontend for production..."
    
    cd frontend
    npm run build
    cd ..
    
    if [ -d "frontend/build" ]; then
        print_success "Frontend build completed successfully"
    else
        print_error "Frontend build failed"
        exit 1
    fi
}

# Validate environment variables
validate_env() {
    print_status "Validating environment variables..."
    
    if [ ! -f ".env.production" ]; then
        print_warning ".env.production file not found. Creating template..."
        cat > .env.production << EOF
# Borouge ESG Intelligence Platform - Production Environment Variables
# Please update these values before deployment

SUPABASE_URL=https://dqvhivaguuyzlmxfvgrm.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRxdmhpdmFndXV5emxteGZ2Z3JtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgxOTMzOTgsImV4cCI6MjA2Mzc2OTM5OH0.TuGFEQlyvvrU_KzAwwGcJzRomb9DH_o-tN3xpdcqh24
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRxdmhpdmFndXV5emxteGZ2Z3JtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODE5MzM5OCwiZXhwIjoyMDYzNzY5Mzk4fQ.bTJ307Y0RJWpNYBUks0siLfuEXlfuVDzLe5ZuxPJ4H0
GEMINI_API_KEY=AIzaSyD0wqgnyyHSgz0joVRQOhNZFjfctcdVpWg
GNEWS_API_KEY=c39602764051b36252013d0cdc8127d5
NEWSAPI_AI_KEY=8ce2612e-3e1f-44a5-9350-4f22ea4be225
NODE_ENV=production
EOF
        print_warning "Please update .env.production with your actual API keys before deploying"
    fi
    
    # Check if Vercel CLI is installed
    if ! command -v vercel &> /dev/null; then
        print_warning "Vercel CLI is not installed. Installing..."
        npm install -g vercel
    fi
    
    print_success "Environment validation completed"
}

# Set up environment variables in Vercel
setup_vercel_env() {
    print_status "Setting up environment variables in Vercel..."
    
    # Check if user is logged in to Vercel
    if ! vercel whoami &> /dev/null; then
        print_status "Please log in to Vercel..."
        vercel login
    fi
    
    # Load environment variables from .env.production
    if [ -f ".env.production" ]; then
        print_status "Loading environment variables from .env.production..."
        
        # Extract variables and set them in Vercel
        SUPABASE_URL=$(grep SUPABASE_URL .env.production | cut -d '=' -f2)
        SUPABASE_ANON_KEY=$(grep SUPABASE_ANON_KEY .env.production | cut -d '=' -f2)
        SUPABASE_SERVICE_ROLE_KEY=$(grep SUPABASE_SERVICE_ROLE_KEY .env.production | cut -d '=' -f2)
        GEMINI_API_KEY=$(grep GEMINI_API_KEY .env.production | cut -d '=' -f2)
        GNEWS_API_KEY=$(grep GNEWS_API_KEY .env.production | cut -d '=' -f2)
        NEWSAPI_AI_KEY=$(grep NEWSAPI_AI_KEY .env.production | cut -d '=' -f2)
        
        # Set environment variables in Vercel
        vercel env add SUPABASE_URL production <<< "$SUPABASE_URL"
        vercel env add SUPABASE_ANON_KEY production <<< "$SUPABASE_ANON_KEY"
        vercel env add SUPABASE_SERVICE_ROLE_KEY production <<< "$SUPABASE_SERVICE_ROLE_KEY"
        vercel env add GEMINI_API_KEY production <<< "$GEMINI_API_KEY"
        vercel env add GNEWS_API_KEY production <<< "$GNEWS_API_KEY"
        vercel env add NEWSAPI_AI_KEY production <<< "$NEWSAPI_AI_KEY"
        vercel env add NODE_ENV production <<< "production"
        
        print_success "Environment variables set in Vercel"
    else
        print_error ".env.production file not found. Cannot set environment variables."
        exit 1
    fi
}

# Deploy to Vercel
deploy_to_vercel() {
    print_status "Deploying to Vercel..."
    
    # Check if user is logged in to Vercel
    if ! vercel whoami &> /dev/null; then
        print_status "Please log in to Vercel..."
        vercel login
    fi
    
    # Deploy to production
    print_status "Deploying to production..."
    vercel --prod
    
    print_success "Deployment completed!"
}

# Test deployment
test_deployment() {
    print_status "Testing deployment..."
    
    # Get deployment URL
    DEPLOYMENT_URL=$(vercel --prod --confirm)
    
    print_status "Testing API endpoints..."
    print_status "Health check: $DEPLOYMENT_URL/api/health"
    print_status "API test: $DEPLOYMENT_URL/api/test"
    
    print_success "Deployment tests completed!"
}

# Main deployment process
main() {
    echo ""
    print_status "Starting deployment process..."
    echo ""
    
    # Step 1: Check dependencies
    check_dependencies
    echo ""
    
    # Step 2: Install dependencies
    install_dependencies
    echo ""
    
    # Step 3: Build frontend
    build_frontend
    echo ""
    
    # Step 4: Validate environment
    validate_env
    echo ""
    
    # Step 5: Set up environment variables in Vercel
    setup_vercel_env
    echo ""
    
    # Step 6: Deploy to Vercel
    deploy_to_vercel
    echo ""
    
    # Step 7: Test deployment
    test_deployment
    echo ""
    
    print_success "🎉 Borouge ESG Intelligence Platform deployed successfully!"
    echo ""
    print_status "Next steps:"
    echo "1. Verify environment variables in Vercel dashboard"
    echo "2. Configure custom domain (optional)"
    echo "3. Test the deployed application"
    echo "4. Monitor performance and usage"
    echo ""
    print_status "Visit your Vercel dashboard to manage the deployment:"
    print_status "https://vercel.com/dashboard"
}

# Handle script arguments
case "${1:-}" in
    "deps")
        check_dependencies
        install_dependencies
        ;;
    "build")
        build_frontend
        ;;
    "env")
        validate_env
        ;;
    "setup-env")
        setup_vercel_env
        ;;
    "deploy")
        deploy_to_vercel
        ;;
    "test")
        test_deployment
        ;;
    "help"|"-h"|"--help")
        echo "Usage: $0 [command]"
        echo ""
        echo "Commands:"
        echo "  deps       Install dependencies only"
        echo "  build      Build frontend only"
        echo "  env        Validate environment only"
        echo "  setup-env  Set up environment variables in Vercel"
        echo "  deploy     Deploy to Vercel only"
        echo "  test       Test deployment"
        echo "  help       Show this help message"
        echo ""
        echo "Run without arguments to execute full deployment process"
        ;;
    *)
        main
        ;;
esac
