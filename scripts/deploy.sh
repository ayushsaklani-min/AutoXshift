#!/bin/bash

# AutoXShift Deployment Script
# This script deploys the complete AutoXShift application

set -e

echo "🚀 Starting AutoXShift deployment..."

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
        print_error "Node.js is not installed. Please install Node.js 18+ and try again."
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed. Please install npm and try again."
        exit 1
    fi
    
    if ! command -v git &> /dev/null; then
        print_error "Git is not installed. Please install Git and try again."
        exit 1
    fi
    
    print_success "All dependencies are installed"
}

# Install dependencies for all projects
install_dependencies() {
    print_status "Installing dependencies..."
    
    # Install root dependencies
    npm install
    
    # Install frontend dependencies
    print_status "Installing frontend dependencies..."
    cd frontend
    npm install
    cd ..
    
    # Install backend dependencies
    print_status "Installing backend dependencies..."
    cd backend
    npm install
    cd ..
    
    # Install contract dependencies
    print_status "Installing contract dependencies..."
    cd contracts
    npm install
    cd ..
    
    print_success "All dependencies installed"
}

# Deploy smart contracts
deploy_contracts() {
    print_status "Deploying smart contracts to Polygon Amoy..."
    
    cd contracts
    
    # Check if .env file exists
    if [ ! -f .env ]; then
        print_warning ".env file not found. Creating from example..."
        cp env.example .env
        print_warning "Please edit contracts/.env with your configuration before continuing"
        print_warning "Required: POLYGON_AMOY_RPC_URL, PRIVATE_KEY"
        read -p "Press Enter to continue after configuring .env file..."
    fi
    
    # Compile contracts
    print_status "Compiling contracts..."
    npm run compile
    
    # Deploy contracts
    print_status "Deploying contracts..."
    npm run deploy:amoy
    
    print_success "Contracts deployed successfully"
    
    # Extract contract addresses
    print_status "Extracting contract addresses..."
    node -e "
        const fs = require('fs');
        const deployment = JSON.parse(fs.readFileSync('./deployments/amoy.json', 'utf8'));
        console.log('Contract Addresses:');
        console.log('AUTOX_TOKEN_ADDRESS=' + deployment.contracts.AutoXToken.address);
        console.log('SHIFT_TOKEN_ADDRESS=' + deployment.contracts.ShiftToken.address);
        console.log('SWAP_CONTRACT_ADDRESS=' + deployment.contracts.AutoXSwap.address);
    " > ../contract-addresses.env
    
    cd ..
    print_success "Contract addresses saved to contract-addresses.env"
}

# Build frontend
build_frontend() {
    print_status "Building frontend..."
    
    cd frontend
    
    # Check if .env.local exists
    if [ ! -f .env.local ]; then
        print_warning ".env.local file not found. Creating from example..."
        cp env.local.example .env.local
        print_warning "Please edit frontend/.env.local with your configuration"
    fi
    
    # Build frontend
    npm run build
    
    print_success "Frontend built successfully"
    cd ..
}

# Build backend
build_backend() {
    print_status "Building backend..."
    
    cd backend
    
    # Check if .env exists
    if [ ! -f .env ]; then
        print_warning ".env file not found. Creating from example..."
        cp env.example .env
        print_warning "Please edit backend/.env with your configuration"
    fi
    
    # Build backend
    npm run build
    
    print_success "Backend built successfully"
    cd ..
}

# Run tests
run_tests() {
    print_status "Running tests..."
    
    # Test contracts
    print_status "Testing smart contracts..."
    cd contracts
    npm test
    cd ..
    
    # Test backend
    print_status "Testing backend..."
    cd backend
    npm test
    cd ..
    
    print_success "All tests passed"
}

# Start development servers
start_dev() {
    print_status "Starting development servers..."
    
    # Start all services concurrently
    npm run dev &
    
    print_success "Development servers started"
    print_status "Frontend: http://localhost:3000"
    print_status "Backend: http://localhost:3001"
    print_status "Press Ctrl+C to stop all servers"
    
    # Wait for user to stop
    wait
}

# Main deployment function
main() {
    echo "🎯 AutoXShift - AI-Powered Cross-Chain Payment Router"
    echo "=================================================="
    
    # Parse command line arguments
    case "${1:-dev}" in
        "dev")
            check_dependencies
            install_dependencies
            build_frontend
            build_backend
            start_dev
            ;;
        "prod")
            check_dependencies
            install_dependencies
            deploy_contracts
            build_frontend
            build_backend
            run_tests
            print_success "Production build completed!"
            print_status "Deploy to your hosting platform using the built files"
            ;;
        "contracts")
            check_dependencies
            install_dependencies
            deploy_contracts
            ;;
        "test")
            check_dependencies
            install_dependencies
            run_tests
            ;;
        "help")
            echo "Usage: $0 [command]"
            echo ""
            echo "Commands:"
            echo "  dev       - Start development environment (default)"
            echo "  prod      - Build for production deployment"
            echo "  contracts - Deploy smart contracts only"
            echo "  test      - Run all tests"
            echo "  help      - Show this help message"
            ;;
        *)
            print_error "Unknown command: $1"
            echo "Use '$0 help' for available commands"
            exit 1
            ;;
    esac
}

# Run main function
main "$@"
