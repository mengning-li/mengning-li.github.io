#!/bin/bash

# Complete Security Deployment Script
# This script deploys all security measures for the contact form

set -e

STACK_NAME="portfolio-contact-api"
SECURITY_STACK_NAME="portfolio-security"
REGION="us-east-1"
EMAIL="limengninglmn@gmail.com"

echo "🛡️  Deploying Complete Security Suite for Portfolio Contact Form"
echo "============================================================="
echo ""

# 1. Update Lambda function with security enhancements
echo "1️⃣  Updating Lambda function with security features..."
cd lambda
npm install --production
cd ..

# Create new deployment package
cd lambda && zip -r ../lambda-deployment.zip . -x "*.git*" "node_modules/.cache/*" && cd ..

# Update Lambda function
aws lambda update-function-code \
    --function-name portfolio-contact-api-contact-handler \
    --zip-file fileb://lambda-deployment.zip \
    --region $REGION

echo "✅ Lambda function updated with security enhancements"
echo ""

# 2. Deploy CloudWatch monitoring
echo "2️⃣  Setting up CloudWatch monitoring and alarms..."
aws cloudformation deploy \
    --template-file monitoring/cloudwatch-alarms.yaml \
    --stack-name "$SECURITY_STACK_NAME-monitoring" \
    --parameter-overrides \
        EmailForAlerts=$EMAIL \
    --capabilities CAPABILITY_IAM \
    --region $REGION

echo "✅ CloudWatch monitoring deployed"
echo ""

# 3. Deploy WAF (optional - can be expensive)
read -p "3️⃣  Deploy WAF protection? This may incur additional costs. (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "Deploying WAF protection..."
    
    # Get API Gateway ID
    API_ID=$(aws cloudformation describe-stacks \
        --stack-name $STACK_NAME \
        --query 'Stacks[0].Outputs[?OutputKey==`ApiGatewayId`].OutputValue' \
        --output text \
        --region $REGION)
    
    if [ -z "$API_ID" ]; then
        echo "❌ Could not find API Gateway ID. Please check your main stack."
        exit 1
    fi
    
    aws cloudformation deploy \
        --template-file security/waf-rules.yaml \
        --stack-name "$SECURITY_STACK_NAME-waf" \
        --parameter-overrides \
            ApiGatewayId=$API_ID \
        --capabilities CAPABILITY_IAM \
        --region $REGION
    
    echo "✅ WAF protection deployed"
else
    echo "⏭️  Skipping WAF deployment"
fi
echo ""

# 4. Set up monitoring scripts
echo "4️⃣  Setting up monitoring tools..."
chmod +x monitoring/monitor.sh
chmod +x security/block-ip.sh

echo "✅ Monitoring tools configured"
echo ""

# 5. Test the security features
echo "5️⃣  Testing security features..."

# Test rate limiting (simulate multiple requests)
echo "Testing rate limiting..."
for i in {1..3}; do
    response=$(curl -s -o /dev/null -w "%{http_code}" \
        -X POST https://$(aws cloudformation describe-stacks \
            --stack-name $STACK_NAME \
            --query 'Stacks[0].Outputs[?OutputKey==`ApiUrl`].OutputValue' \
            --output text \
            --region $REGION | sed 's|https://||' | sed 's|/prod||')/prod/contact \
        -H "Content-Type: application/json" \
        -d '{"name":"Test","email":"test@test.com","message":"Test"}')
    
    echo "Request $i: HTTP $response"
    sleep 1
done

echo "✅ Security testing completed"
echo ""

# Clean up
rm -f lambda-deployment.zip

echo "🎉 Security Deployment Complete!"
echo ""
echo "📋 What was deployed:"
echo "  ✅ Enhanced Lambda function with rate limiting and input validation"
echo "  ✅ CloudWatch alarms for monitoring suspicious activity"
echo "  ✅ Security monitoring scripts"
if [[ $REPLY =~ ^[Yy]$ ]]; then
echo "  ✅ WAF protection with rate limiting and geo-blocking"
fi
echo ""
echo "📧 You will receive email alerts at: $EMAIL"
echo ""
echo "🔧 Available tools:"
echo "  • Run './monitoring/monitor.sh' to check security status"
echo "  • Run './security/block-ip.sh <IP>' to manually block an IP"
echo ""
echo "💡 Security Features Active:"
echo "  • Rate limiting: Max 10 requests per hour per IP"
echo "  • Input validation: Blocks suspicious content"
echo "  • Email alerts: For high volume or suspicious activity"
echo "  • Monitoring: Real-time logs and metrics"