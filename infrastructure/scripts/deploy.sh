#!/bin/bash

# Deploy Trading Insights App Infrastructure
# This script deploys the CloudFormation stacks in the correct order

set -e

REGION="us-east-1"
NETWORK_STACK="trading-app-network"
DATABASE_STACK="trading-app-database" 
COMPUTE_STACK="trading-app-compute"

echo "🚀 Starting deployment of Trading Insights App..."

# Deploy network infrastructure
echo "📡 Deploying network infrastructure..."
aws cloudformation create-stack \
  --stack-name $NETWORK_STACK \
  --template-body file://cloudformation/network.yml \
  --region $REGION

# Wait for network stack to complete
echo "⏳ Waiting for network stack to complete..."
aws cloudformation wait stack-create-complete \
  --stack-name $NETWORK_STACK \
  --region $REGION

echo "✅ Network stack deployed successfully!"

# Deploy database infrastructure
echo "🗄️ Deploying database infrastructure..."
aws cloudformation create-stack \
  --stack-name $DATABASE_STACK \
  --template-body file://cloudformation/database.yml \
  --parameters ParameterKey=NetworkStackName,ParameterValue=$NETWORK_STACK \
  --region $REGION

# Wait for database stack to complete  
echo "⏳ Waiting for database stack to complete..."
aws cloudformation wait stack-create-complete \
  --stack-name $DATABASE_STACK \
  --region $REGION

echo "✅ Database stack deployed successfully!"

# Deploy compute infrastructure
echo "💻 Deploying compute infrastructure..."
aws cloudformation create-stack \
  --stack-name $COMPUTE_STACK \
  --template-body file://cloudformation/compute.yml \
  --parameters ParameterKey=NetworkStackName,ParameterValue=$NETWORK_STACK \
               ParameterKey=DatabaseStackName,ParameterValue=$DATABASE_STACK \
  --capabilities CAPABILITY_IAM \
  --region $REGION

# Wait for compute stack to complete
echo "⏳ Waiting for compute stack to complete..."
aws cloudformation wait stack-create-complete \
  --stack-name $COMPUTE_STACK \
  --region $REGION

echo "✅ Compute stack deployed successfully!"
echo "🎉 All infrastructure deployed successfully!"

# Get outputs
echo "📋 Getting stack outputs..."
aws cloudformation describe-stacks \
  --stack-name $COMPUTE_STACK \
  --region $REGION \
  --query 'Stacks[0].Outputs'