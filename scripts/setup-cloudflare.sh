#!/bin/bash
# Automated Cloudflare Setup Script for AI Error Query Builder
# This script helps you set up and deploy the application to Cloudflare Pages

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Helper functions
print_header() {
    echo -e "\n${BLUE}========================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}========================================${NC}\n"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ $1${NC}"
}

# Check prerequisites
check_prerequisites() {
    print_header "Checking Prerequisites"
    
    # Check Node.js
    if command -v node &> /dev/null; then
        NODE_VERSION=$(node -v)
        print_success "Node.js installed: $NODE_VERSION"
    else
        print_error "Node.js is not installed. Please install Node.js 18+ first."
        exit 1
    fi
    
    # Check npm
    if command -v npm &> /dev/null; then
        NPM_VERSION=$(npm -v)
        print_success "npm installed: $NPM_VERSION"
    else
        print_error "npm is not installed."
        exit 1
    fi
    
    # Check if wrangler is installed
    if command -v wrangler &> /dev/null; then
        print_success "Wrangler CLI already installed"
    else
        print_warning "Wrangler CLI not found. Installing globally..."
        npm install -g wrangler
        print_success "Wrangler CLI installed"
    fi
}

# Install dependencies
install_dependencies() {
    print_header "Installing Dependencies"
    
    if [ -d "node_modules" ]; then
        print_info "node_modules exists. Running npm install..."
    else
        print_info "Installing packages for the first time..."
    fi
    
    npm install
    print_success "Dependencies installed"
}

# Create .env file
setup_env_file() {
    print_header "Setting Up Environment Variables"
    
    if [ -f ".env" ]; then
        print_warning ".env file already exists"
        read -p "Do you want to overwrite it? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            print_info "Keeping existing .env file"
            return
        fi
    fi
    
    print_info "Creating .env file from .env.example..."
    cp .env.example .env
    
    print_info "Please enter your OpenAI API key (get one at: https://platform.openai.com/api-keys)"
    read -p "OpenAI API Key: " OPENAI_KEY
    
    # Update .env file
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        sed -i '' "s|OPENAI_API_KEY=.*|OPENAI_API_KEY=$OPENAI_KEY|" .env
    else
        # Linux
        sed -i "s|OPENAI_API_KEY=.*|OPENAI_API_KEY=$OPENAI_KEY|" .env
    fi
    
    print_success ".env file created"
}

# Test locally
test_locally() {
    print_header "Testing Locally"
    
    print_info "Building the frontend..."
    npm run build
    print_success "Build complete"
    
    print_info "Starting local Cloudflare Pages server..."
    print_warning "The server will start on http://localhost:8788"
    print_warning "Press Ctrl+C when you're done testing"
    print_info "Opening in 3 seconds..."
    sleep 3
    
    # Try to open browser
    if command -v open &> /dev/null; then
        open http://localhost:8788 &
    elif command -v xdg-open &> /dev/null; then
        xdg-open http://localhost:8788 &
    fi
    
    npm run pages:dev
}

# Deploy to Cloudflare
deploy_to_cloudflare() {
    print_header "Deploying to Cloudflare Pages"
    
    # Check if logged in
    print_info "Checking Cloudflare authentication..."
    if wrangler whoami &> /dev/null; then
        print_success "Already logged in to Cloudflare"
    else
        print_warning "Not logged in to Cloudflare"
        print_info "Opening browser for authentication..."
        wrangler login
    fi
    
    # Deploy
    print_info "Deploying to Cloudflare Pages..."
    print_warning "This will build and deploy your application"
    
    npm run cf:deploy
    
    print_success "Deployment complete!"
}

# Set production secrets
set_production_secrets() {
    print_header "Setting Production Secrets"
    
    print_info "You need to set your OpenAI API key as a Cloudflare secret"
    print_warning "This is required for the app to work in production"
    
    read -p "Do you want to set the OPENAI_API_KEY secret now? (Y/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Nn]$ ]]; then
        print_info "Setting OPENAI_API_KEY..."
        print_warning "Paste your OpenAI API key when prompted"
        wrangler pages secret put OPENAI_API_KEY
        print_success "Secret set successfully"
    fi
    
    print_info "Optional: Set up Cloudflare AI Gateway for caching and analytics"
    read -p "Do you want to set AI Gateway secrets? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_info "Setting AI_GATEWAY_ACCOUNT_ID..."
        wrangler pages secret put AI_GATEWAY_ACCOUNT_ID
        
        print_info "Setting AI_GATEWAY_ID..."
        wrangler pages secret put AI_GATEWAY_ID
        
        print_success "AI Gateway secrets set"
    fi
}

# Main menu
show_menu() {
    clear
    echo -e "${BLUE}"
    cat << "EOF"
    ╔═══════════════════════════════════════════╗
    ║   AI Error Query Builder                  ║
    ║   Cloudflare Setup Script                 ║
    ╚═══════════════════════════════════════════╝
EOF
    echo -e "${NC}"
    
    echo "What would you like to do?"
    echo ""
    echo "1) Full Setup & Deployment (Recommended for first time)"
    echo "2) Install Dependencies Only"
    echo "3) Set Up Environment Variables"
    echo "4) Test Locally"
    echo "5) Deploy to Cloudflare"
    echo "6) Set Production Secrets"
    echo "7) Exit"
    echo ""
    read -p "Enter your choice [1-7]: " choice
    
    case $choice in
        1)
            check_prerequisites
            install_dependencies
            setup_env_file
            
            read -p "Do you want to test locally first? (Y/n): " -n 1 -r
            echo
            if [[ ! $REPLY =~ ^[Nn]$ ]]; then
                test_locally
            fi
            
            read -p "Do you want to deploy to Cloudflare now? (Y/n): " -n 1 -r
            echo
            if [[ ! $REPLY =~ ^[Nn]$ ]]; then
                deploy_to_cloudflare
                set_production_secrets
            fi
            
            print_header "Setup Complete!"
            print_success "Your AI Error Query Builder is ready!"
            print_info "Next steps:"
            echo "  1. Visit your Cloudflare Pages URL"
            echo "  2. Test all four platforms (Sentry, Datadog, Elasticsearch, Splunk)"
            echo "  3. Set up a custom domain (optional)"
            echo "  4. Configure AI Gateway for caching (optional)"
            ;;
        2)
            check_prerequisites
            install_dependencies
            ;;
        3)
            setup_env_file
            ;;
        4)
            test_locally
            ;;
        5)
            deploy_to_cloudflare
            ;;
        6)
            set_production_secrets
            ;;
        7)
            print_info "Goodbye!"
            exit 0
            ;;
        *)
            print_error "Invalid option. Please try again."
            sleep 2
            show_menu
            ;;
    esac
}

# Run the script
if [ "$1" == "--auto" ]; then
    # Automated mode (run all steps)
    check_prerequisites
    install_dependencies
    setup_env_file
    deploy_to_cloudflare
    set_production_secrets
else
    # Interactive mode
    show_menu
fi
