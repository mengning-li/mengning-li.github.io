# Portfolio Contact API - AWS Deployment

This project contains a complete solution for deploying a portfolio contact form to AWS.

## Architecture Overview

- **AWS Lambda**: Server-side logic for handling contact form submissions
- **API Gateway**: Provides HTTP endpoints and handles CORS
- **AWS SES**: Email sending service
- **CloudFormation**: Infrastructure as Code

## Quick Deployment

### 1. Prerequisites

Ensure you have installed and configured:

```bash
# Install AWS CLI
# macOS:
brew install awscli

# Or download installer:
# https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html

# Configure AWS credentials
aws configure
```

You'll need to provide:
- AWS Access Key ID
- AWS Secret Access Key  
- Default region name (recommended: us-east-1)
- Default output format (json)

### 2. One-Click Deployment

```bash
# Navigate to project directory
cd aws-contact-api

# Run deployment script
./deploy.sh
```

### 3. Verify SES Email

If this is your first time using SES, you need to verify your email address:

```bash
aws ses verify-email-identity --email-address limengninglmn@gmail.com --region us-east-1
```

Then check your email and click the verification link.

### 4. Update Frontend Code

After deployment, update the frontend code with the output API endpoint URL.

## Manual Deployment Steps

If you prefer manual deployment:

### 1. Create Lambda Deployment Package

```bash
cd lambda
npm install --production
zip -r ../lambda-deployment.zip . -x "*.git*" "node_modules/.cache/*"
cd ..
```

### 2. Deploy CloudFormation Template

```bash
aws cloudformation deploy \
    --template-file cloudformation/contact-api-stack.yaml \
    --stack-name portfolio-contact-api \
    --parameter-overrides \
        EmailAddress=limengninglmn@gmail.com \
        DomainName=mengning-li.github.io \
    --capabilities CAPABILITY_NAMED_IAM \
    --region us-east-1
```

### 3. Update Lambda Code

```bash
# Get function name
FUNCTION_NAME=$(aws cloudformation describe-stacks \
    --stack-name portfolio-contact-api \
    --query 'Stacks[0].Outputs[?OutputKey==`LambdaFunctionName`].OutputValue' \
    --output text)

# Update code
aws lambda update-function-code \
    --function-name $FUNCTION_NAME \
    --zip-file fileb://lambda-deployment.zip
```

## Configuration Details

### Environment Variables

The Lambda function uses the following environment variables:

- `RECIPIENT_EMAIL`: Email address to receive messages
- `CORS_ORIGIN`: Allowed frontend domain
- `AWS_REGION`: AWS region

### CORS Configuration

API Gateway is configured with CORS to allow:
- Origin: `https://mengning-li.github.io`
- Methods: `POST, OPTIONS`
- Headers: `Content-Type`

### SES Configuration

- Emails sent from `limengninglmn@gmail.com`
- Reply-to address set to form submitter's email
- Supports both text and HTML formats

## Troubleshooting

### 1. SES Email Sending Failure

Ensure email address is verified:
```bash
aws ses get-identity-verification-attributes --identities limengninglmn@gmail.com
```

### 2. CORS Errors

Check API Gateway CORS configuration to ensure domain matches.

### 3. Lambda Function Errors

View CloudWatch logs:
```bash
aws logs describe-log-groups --log-group-name-prefix /aws/lambda/portfolio-contact-api
```

## API Endpoint

Deployed API endpoint format:
```
https://{api-id}.execute-api.{region}.amazonaws.com/prod/contact
```

### Request Format

```json
POST /contact
Content-Type: application/json

{
    "name": "User Name",
    "email": "user@example.com", 
    "subject": "Email Subject (optional)",
    "message": "User Message"
}
```

### Response Format

Success:
```json
{
    "success": true,
    "message": "Message sent successfully!",
    "timestamp": "2024-01-01T00:00:00.000Z"
}
```

Error:
```json
{
    "success": false,
    "message": "Error description"
}
```

## Cost Estimation

Based on normal usage (100-1000 submissions per month):

- Lambda: ~$0.00
- API Gateway: ~$0.01-0.10
- SES: ~$0.01-0.10

Total: < $1/month

## Clean Up Resources

To delete all AWS resources:

```bash
aws cloudformation delete-stack --stack-name portfolio-contact-api
```