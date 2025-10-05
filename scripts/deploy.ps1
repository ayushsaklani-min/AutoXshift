# AutoXShift Deployment Script for Windows PowerShell
# This script deploys the complete AutoXShift application

param(
    [string]$Command = "dev"
)

# Colors for output
$Red = "Red"
$Green = "Green"
$Yellow = "Yellow"
$Blue = "Blue"

# Function to print colored output
function Write-Status {
    param([string]$Message)
    Write-Host "[INFO] $Message" -ForegroundColor $Blue
}

function Write-Success {
    param([string]$Message)
    Write-Host "[SUCCESS] $Message" -ForegroundColor $Green
}

function Write-Warning {
    param([string]$Message)
    Write-Host "[WARNING] $Message" -ForegroundColor $Yellow
}

function Write-Error {
    param([string]$Message)
    Write-Host "[ERROR] $Message" -ForegroundColor $Red
}

# Check if required tools are installed
function Test-Dependencies {
    Write-Status "Checking dependencies..."
    
    if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
        Write-Error "Node.js is not installed. Please install Node.js 18+ and try again."
        exit 1
    }
    
    if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
        Write-Error "npm is not installed. Please install npm and try again."
        exit 1
    }
    
    if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
        Write-Error "Git is not installed. Please install Git and try again."
        exit 1
    }
    
    Write-Success "All dependencies are installed"
}

# Install dependencies for all projects
function Install-Dependencies {
    Write-Status "Installing dependencies..."
    
    # Install root dependencies
    npm install
    
    # Install frontend dependencies
    Write-Status "Installing frontend dependencies..."
    Set-Location frontend
    npm install
    Set-Location ..
    
    # Install backend dependencies
    Write-Status "Installing backend dependencies..."
    Set-Location backend
    npm install
    Set-Location ..
    
    # Install contract dependencies
    Write-Status "Installing contract dependencies..."
    Set-Location contracts
    npm install
    Set-Location ..
    
    Write-Success "All dependencies installed"
}

# Deploy smart contracts
function Deploy-Contracts {
    Write-Status "Deploying smart contracts to Polygon Amoy..."
    
    Set-Location contracts
    
    # Check if .env file exists
    if (-not (Test-Path .env)) {
        Write-Warning ".env file not found. Creating from example..."
        Copy-Item env.example .env
        Write-Warning "Please edit contracts/.env with your configuration before continuing"
        Write-Warning "Required: POLYGON_AMOY_RPC_URL, PRIVATE_KEY"
        Read-Host "Press Enter to continue after configuring .env file"
    }
    
    # Compile contracts
    Write-Status "Compiling contracts..."
    npm run compile
    
    # Deploy contracts
    Write-Status "Deploying contracts..."
    npm run deploy:amoy
    
    Write-Success "Contracts deployed successfully"
    
    # Extract contract addresses
    Write-Status "Extracting contract addresses..."
    $deployment = Get-Content ./deployments/amoy.json | ConvertFrom-Json
    $addresses = @"
AUTOX_TOKEN_ADDRESS=$($deployment.contracts.AutoXToken.address)
SHIFT_TOKEN_ADDRESS=$($deployment.contracts.ShiftToken.address)
SWAP_CONTRACT_ADDRESS=$($deployment.contracts.AutoXSwap.address)
"@
    $addresses | Out-File -FilePath ../contract-addresses.env -Encoding UTF8
    
    Set-Location ..
    Write-Success "Contract addresses saved to contract-addresses.env"
}

# Build frontend
function Build-Frontend {
    Write-Status "Building frontend..."
    
    Set-Location frontend
    
    # Check if .env.local exists
    if (-not (Test-Path .env.local)) {
        Write-Warning ".env.local file not found. Creating from example..."
        Copy-Item env.local.example .env.local
        Write-Warning "Please edit frontend/.env.local with your configuration"
    }
    
    # Build frontend
    npm run build
    
    Write-Success "Frontend built successfully"
    Set-Location ..
}

# Build backend
function Build-Backend {
    Write-Status "Building backend..."
    
    Set-Location backend
    
    # Check if .env exists
    if (-not (Test-Path .env)) {
        Write-Warning ".env file not found. Creating from example..."
        Copy-Item env.example .env
        Write-Warning "Please edit backend/.env with your configuration"
    }
    
    # Build backend
    npm run build
    
    Write-Success "Backend built successfully"
    Set-Location ..
}

# Run tests
function Invoke-Tests {
    Write-Status "Running tests..."
    
    # Test contracts
    Write-Status "Testing smart contracts..."
    Set-Location contracts
    npm test
    Set-Location ..
    
    # Test backend
    Write-Status "Testing backend..."
    Set-Location backend
    npm test
    Set-Location ..
    
    Write-Success "All tests passed"
}

# Start development servers
function Start-Development {
    Write-Status "Starting development servers..."
    
    # Start all services concurrently
    Start-Process -FilePath "npm" -ArgumentList "run", "dev" -NoNewWindow
    
    Write-Success "Development servers started"
    Write-Status "Frontend: http://localhost:3000"
    Write-Status "Backend: http://localhost:3001"
    Write-Status "Press Ctrl+C to stop all servers"
    
    # Wait for user input
    Read-Host "Press Enter to stop servers"
}

# Main deployment function
function Main {
    Write-Host "🎯 AutoXShift - AI-Powered Cross-Chain Payment Router" -ForegroundColor Cyan
    Write-Host "==================================================" -ForegroundColor Cyan
    
    switch ($Command) {
        "dev" {
            Test-Dependencies
            Install-Dependencies
            Build-Frontend
            Build-Backend
            Start-Development
        }
        "prod" {
            Test-Dependencies
            Install-Dependencies
            Deploy-Contracts
            Build-Frontend
            Build-Backend
            Invoke-Tests
            Write-Success "Production build completed!"
            Write-Status "Deploy to your hosting platform using the built files"
        }
        "contracts" {
            Test-Dependencies
            Install-Dependencies
            Deploy-Contracts
        }
        "test" {
            Test-Dependencies
            Install-Dependencies
            Invoke-Tests
        }
        "help" {
            Write-Host "Usage: .\deploy.ps1 [command]"
            Write-Host ""
            Write-Host "Commands:"
            Write-Host "  dev       - Start development environment (default)"
            Write-Host "  prod      - Build for production deployment"
            Write-Host "  contracts - Deploy smart contracts only"
            Write-Host "  test      - Run all tests"
            Write-Host "  help      - Show this help message"
        }
        default {
            Write-Error "Unknown command: $Command"
            Write-Host "Use '.\deploy.ps1 help' for available commands"
            exit 1
        }
    }
}

# Run main function
Main
