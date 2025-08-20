#!/bin/bash

# TradingEdge Analytics Platform - Deployment Script (with Secrets Manager)
# Author: AWS Solutions Architect (refactored for secure secret handling)

set -e  # Exit on any error

# Configuration
PROJECT_NAME="tradingedge"
ENVIRONMENT="dev"
AWS_REGION="us-east-1"
STACK_PREFIX="${PROJECT_NAME}-${ENVIRONMENT}"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_status()   { echo -e "${BLUE}[INFO]${NC} $1"; }
print_success()  { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
print_warning()  { echo -e "${YELLOW}[WARNING]${NC} $1"; }
print_error()    { echo -e "${RED}[ERROR]${NC} $1"; }

# -----------------------------
# Check AWS CLI
# -----------------------------
check_aws_cli() {
    print_status "Checking AWS CLI..."
    if ! command -v aws &> /dev/null; then
        print_error "AWS CLI not installed."
        exit 1
    fi

    if ! aws sts get-caller-identity &> /dev/null; then
        print_error "AWS CLI not configured. Run 'aws configure'."
        exit 1
    fi

    ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
    print_success "AWS CLI configured. Account ID: $ACCOUNT_ID"
}

# -----------------------------
# Gather Parameters & Store Secrets
# -----------------------------
get_parameters() {
    print_status "Gathering deployment parameters..."

    # DB Secret
    read -s -p "Enter database password (8-41 chars): " DB_PASSWORD
    echo
    if [ ${#DB_PASSWORD} -lt 8 ] || [ ${#DB_PASSWORD} -gt 41 ]; then
        print_error "Database password must be 8-41 chars."
        exit 1
    fi

    # GitHub info
    read -p "Enter GitHub owner/org: " GITHUB_OWNER
    read -p "Enter GitHub repo name: " GITHUB_REPO
    read -p "Enter GitHub branch [main]: " GITHUB_BRANCH
    GITHUB_BRANCH=${GITHUB_BRANCH:-main}
    read -s -p "Enter GitHub Personal Access Token: " GITHUB_TOKEN
    echo

    # Optional Market Data API Key
    read -p "Enter Market Data API Key [demo-key]: " MARKET_API_KEY
    MARKET_API_KEY=${MARKET_API_KEY:-demo-key}

    # Secret names
    DB_SECRET_NAME="${STACK_PREFIX}-db-secret"
    GITHUB_SECRET_NAME="${STACK_PREFIX}-github-secret"

    print_status "Storing secrets in AWS Secrets Manager..."

    # DB Secret
    aws secretsmanager create-secret \
      --name "$DB_SECRET_NAME" \
      --description "Database password for $STACK_PREFIX" \
      --secret-string "{\"password\":\"$DB_PASSWORD\"}" \
      --region $AWS_REGION >/dev/null 2>&1 || \
    aws secretsmanager update-secret \
      --secret-id "$DB_SECRET_NAME" \
      --secret-string "{\"password\":\"$DB_PASSWORD\"}" \
      --region $AWS_REGION >/dev/null

    # GitHub Secret
    aws secretsmanager create-secret \
      --name "$GITHUB_SECRET_NAME" \
      --description "GitHub token for $STACK_PREFIX" \
      --secret-string "{\"token\":\"$GITHUB_TOKEN\"}" \
      --region $AWS_REGION >/dev/null 2>&1 || \
    aws secretsmanager update-secret \
      --secret-id "$GITHUB_SECRET_NAME" \
      --secret-string "{\"token\":\"$GITHUB_TOKEN\"}" \
      --region $AWS_REGION >/dev/null

    DB_SECRET_ARN=$(aws secretsmanager describe-secret --secret-id "$DB_SECRET_NAME" --query ARN --output text --region $AWS_REGION)
    GITHUB_SECRET_ARN=$(aws secretsmanager describe-secret --secret-id "$GITHUB_SECRET_NAME" --query ARN --output text --region $AWS_REGION)

    print_success "Secrets stored. DB Secret ARN: $DB_SECRET_ARN"
    print_success "GitHub Secret ARN: $GITHUB_SECRET_ARN"
}

# -----------------------------
# Deploy Main Infrastructure
# -----------------------------
deploy_main_stack() {
    print_status "Deploying main infrastructure stack..."
    aws cloudformation deploy \
        --template-file main-infrastructure.yaml \
        --stack-name "${STACK_PREFIX}-main" \
        --parameter-overrides \
            ProjectName=$PROJECT_NAME \
            Environment=$ENVIRONMENT \
            DatabaseSecretArn=$DB_SECRET_ARN \
        --capabilities CAPABILITY_NAMED_IAM \
        --region $AWS_REGION
    print_success "Main stack deployed."
}

# -----------------------------
# Build & Push Initial Images
# -----------------------------
build_initial_images() {
    print_status "Building & pushing initial container images..."
    ECR_URI=$(aws cloudformation describe-stacks \
        --stack-name "${STACK_PREFIX}-main" \
        --query "Stacks[0].Outputs[?OutputKey=='ECRRepositoryUri'].OutputValue" \
        --output text --region $AWS_REGION)

    aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $ECR_URI

    docker build -t $PROJECT_NAME:frontend-initial ./frontend
    docker tag $PROJECT_NAME:frontend-initial $ECR_URI:frontend-latest
    docker push $ECR_URI:frontend-latest

    docker build -t $PROJECT_NAME:backend-initial ./backend
    docker tag $PROJECT_NAME:backend-initial $ECR_URI:backend-latest
    docker push $ECR_URI:backend-latest

    print_success "Initial images pushed to ECR."
}

# -----------------------------
# Deploy ECS Services
# -----------------------------
deploy_ecs_stack() {
    print_status "Deploying ECS services stack..."
    DB_ENDPOINT=$(aws cloudformation describe-stacks \
        --stack-name "${STACK_PREFIX}-main" \
        --query "Stacks[0].Outputs[?OutputKey=='DatabaseEndpoint'].OutputValue" \
        --output text --region $AWS_REGION)

    ECR_URI=$(aws cloudformation describe-stacks \
        --stack-name "${STACK_PREFIX}-main" \
        --query "Stacks[0].Outputs[?OutputKey=='ECRRepositoryUri'].OutputValue" \
        --output text --region $AWS_REGION)

    aws cloudformation deploy \
        --template-file ecs-services.yaml \
        --stack-name "${STACK_PREFIX}-ecs" \
        --parameter-overrides \
            ProjectName=$PROJECT_NAME \
            Environment=$ENVIRONMENT \
            FrontendImageUri="$ECR_URI:frontend-latest" \
            BackendImageUri="$ECR_URI:backend-latest" \
            DatabaseEndpoint="$DB_ENDPOINT" \
            DatabaseSecretArn=$DB_SECRET_ARN \
            MarketDataApiKey="$MARKET_API_KEY" \
        --capabilities CAPABILITY_NAMED_IAM \
        --region $AWS_REGION
    print_success "ECS services deployed."
}

# -----------------------------
# Deploy CI/CD Pipeline
# -----------------------------
deploy_cicd_stack() {
    print_status "Deploying CI/CD pipeline..."
    aws cloudformation deploy \
        --template-file cicd-pipeline.yaml \
        --stack-name "${STACK_PREFIX}-cicd" \
        --parameter-overrides \
            ProjectName=$PROJECT_NAME \
            Environment=$ENVIRONMENT \
            GitHubOwner=$GITHUB_OWNER \
            GitHubRepo=$GITHUB_REPO \
            GitHubBranch=$GITHUB_BRANCH \
            GitHubSecretArn=$GITHUB_SECRET_ARN \
        --capabilities CAPABILITY_NAMED_IAM \
        --region $AWS_REGION
    print_success "CI/CD pipeline deployed."
}

# -----------------------------
# Show Deployment Info
# -----------------------------
show_deployment_info() {
    print_success "=== DEPLOYMENT COMPLETE ==="
    ALB_DNS=$(aws cloudformation describe-stacks \
        --stack-name "${STACK_PREFIX}-main" \
        --query "Stacks[0].Outputs[?OutputKey=='ApplicationLoadBalancerDNS'].OutputValue" \
        --output text --region $AWS_REGION)

    PIPELINE_URL=$(aws cloudformation describe-stacks \
        --stack-name "${STACK_PREFIX}-cicd" \
        --query "Stacks[0].Outputs[?OutputKey=='PipelineUrl'].OutputValue" \
        --output text --region $AWS_REGION)

    echo "🌐 App URL: http://$ALB_DNS"
    echo "🔧 CI/CD Pipeline: $PIPELINE_URL"
    echo "📊 CloudWatch Logs: https://console.aws.amazon.com/cloudwatch/home?region=$AWS_REGION#logsV2:log-groups"
    echo "🐳 ECR Repo: https://console.aws.amazon.com/ecr/repositories/$PROJECT_NAME-$ENVIRONMENT?region=$AWS_REGION"
    print_warning "App may take 5–10 mins to become available."
}

# -----------------------------
# Cleanup Resources
# -----------------------------
cleanup() {
    print_warning "Deleting ALL resources..."
    read -p "Type 'yes' to confirm: " CONFIRM
    if [ "$CONFIRM" = "yes" ]; then
        aws cloudformation delete-stack --stack-name "${STACK_PREFIX}-cicd" --region $AWS_REGION
        aws cloudformation wait stack-delete-complete --stack-name "${STACK_PREFIX}-cicd" --region $AWS_REGION
        aws cloudformation delete-stack --stack-name "${STACK_PREFIX}-ecs" --region $AWS_REGION
        aws cloudformation wait stack-delete-complete --stack-name "${STACK_PREFIX}-ecs" --region $AWS_REGION
        aws cloudformation delete-stack --stack-name "${STACK_PREFIX}-main" --region $AWS_REGION
        aws cloudformation wait stack-delete-complete --stack-name "${STACK_PREFIX}-main" --region $AWS_REGION

        # Delete secrets
        aws secretsmanager delete-secret --secret-id "${STACK_PREFIX}-db-secret" --force-delete-without-recovery --region $AWS_REGION
        aws secretsmanager delete-secret --secret-id "${STACK_PREFIX}-github-secret" --force-delete-without-recovery --region $AWS_REGION

        print_success "Cleanup complete."
    else
        print_status "Cleanup cancelled."
    fi
}

# -----------------------------
# Main Function
# -----------------------------
main() {
    echo "==============================================="
    echo "🚀 TradingEdge Analytics Platform Deployment"
    echo "==============================================="

    if [ "$1" = "--cleanup" ]; then
        cleanup
        exit 0
    fi

    check_aws_cli
    get_parameters

    read -p "Continue with deployment? (y/N): " CONFIRM
    if [ "$CONFIRM" != "y" ] && [ "$CONFIRM" != "Y" ]; then
        print_status "Deployment cancelled."
        exit 0
    fi

    deploy_main_stack
    build_initial_images
    deploy_ecs_stack
    deploy_cicd_stack
    show_deployment_info
}

main "$@"
