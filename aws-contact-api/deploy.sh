#!/bin/bash

# AWS Contact API Deployment Script
# Deployment script for portfolio contact form to AWS

set -e

# Configuration variables
STACK_NAME="portfolio-contact-api"
REGION="us-east-1"  # Modify region as needed
EMAIL="limengninglmn@gmail.com"
DOMAIN="mengning-li.github.io"

echo "🚀 Starting Portfolio Contact API deployment to AWS..."
echo "Stack Name: $STACK_NAME"
echo "Region: $REGION"
echo "Email: $EMAIL"
echo "Domain: $DOMAIN"
echo ""

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo "❌ AWS CLI is not installed. Please install AWS CLI first:"
    echo "https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html"
    exit 1
fi

# Check AWS credentials
echo "🔍 Checking AWS credentials..."
if ! aws sts get-caller-identity &> /dev/null; then
    echo "❌ AWS credentials not configured. Please run: aws configure"
    exit 1
fi

echo "✅ AWS credentials verified successfully"

# Create Lambda deployment package
echo "📦 Preparing Lambda deployment package..."
cd lambda

if [ ! -f "package.json" ]; then
    echo "❌ Cannot find package.json in lambda directory"
    exit 1
fi

# Install dependencies
echo "📥 Installing Lambda dependencies..."
npm install --production

# Create deployment package
echo "📦 Creating deployment package..."
zip -r ../lambda-deployment.zip . -x "*.git*" "node_modules/.cache/*"

cd ..

echo "✅ Lambda deployment package created successfully"

# Deploy CloudFormation template
echo "☁️  Deploying CloudFormation template..."

aws cloudformation deploy \
    --template-file cloudformation/contact-api-stack.yaml \
    --stack-name "$STACK_NAME" \
    --parameter-overrides \
        EmailAddress="$EMAIL" \
        DomainName="$DOMAIN" \
    --capabilities CAPABILITY_NAMED_IAM \
    --region "$REGION"

if [ $? -eq 0 ]; then
    echo "✅ CloudFormation template deployed successfully"
else
    echo "❌ CloudFormation template deployment failed"
    exit 1
fi

# Update Lambda function code
echo "🔄 Updating Lambda function code..."
FUNCTION_NAME=$(aws cloudformation describe-stacks \
    --stack-name "$STACK_NAME" \
    --region "$REGION" \
    --query 'Stacks[0].Outputs[?OutputKey==`LambdaFunctionName`].OutputValue' \
    --output text)

aws lambda update-function-code \
    --function-name "$FUNCTION_NAME" \
    --zip-file fileb://lambda-deployment.zip \
    --region "$REGION"

echo "✅ Lambda function code updated successfully"

# Get API endpoint
echo "🌐 Getting API endpoint information..."
API_ENDPOINT=$(aws cloudformation describe-stacks \
    --stack-name "$STACK_NAME" \
    --region "$REGION" \
    --query 'Stacks[0].Outputs[?OutputKey==`ApiEndpoint`].OutputValue' \
    --output text)

echo ""
echo "🎉 Deployment completed!"
echo "📍 API Endpoint: $API_ENDPOINT"
echo ""
echo "📝 Next steps:"
echo "1. Verify SES email address (if not already verified)"
echo "2. Update frontend code with the API endpoint URL"
echo "3. Test contact form functionality"
echo ""
echo "💡 SES email verification command:"
echo "aws ses verify-email-identity --email-address $EMAIL --region $REGION"
echo ""

# Clean up deployment package
rm -f lambda-deployment.zip
echo "🧹 Cleanup completed"

echo "✨ Deployment script finished successfully!"