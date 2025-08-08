#!/usr/bin/env node

/**
 * Automatically update API endpoint in frontend Contact component
 * Usage: node update-frontend.js <API_GATEWAY_ID>
 */

const fs = require('fs');
const path = require('path');

// Get API Gateway ID
const apiGatewayId = process.argv[2];

if (!apiGatewayId) {
    console.error('❌ Please provide API Gateway ID');
    console.log('Usage: node update-frontend.js <API_GATEWAY_ID>');
    console.log('');
    console.log('Get API Gateway ID:');
    console.log('aws cloudformation describe-stacks --stack-name portfolio-contact-api --query "Stacks[0].Outputs[?OutputKey==`ApiGatewayId`].OutputValue" --output text');
    process.exit(1);
}

// Frontend file path
const contactFilePath = path.join(__dirname, '..', 'portfolio-react', 'src', 'components', 'Contact', 'Contact.jsx');

// Check if file exists
if (!fs.existsSync(contactFilePath)) {
    console.error('❌ Cannot find Contact.jsx file:', contactFilePath);
    process.exit(1);
}

try {
    // Read file content
    let content = fs.readFileSync(contactFilePath, 'utf8');
    
    // Build new API endpoint URL
    const newApiUrl = `https://${apiGatewayId}.execute-api.us-east-1.amazonaws.com/prod/contact`;
    
    // Replace API endpoint URL
    const updatedContent = content.replace(
        /https:\/\/YOUR_API_GATEWAY_ID\.execute-api\.us-east-1\.amazonaws\.com\/prod\/contact/g,
        newApiUrl
    );
    
    // Check if there are changes
    if (content === updatedContent) {
        console.log('⚠️  No API endpoint URL found to update');
        console.log('Current file may already be updated or uses a different URL format');
    } else {
        // Write updated content
        fs.writeFileSync(contactFilePath, updatedContent, 'utf8');
        
        console.log('✅ Frontend API endpoint updated successfully!');
        console.log(`📍 New API endpoint: ${newApiUrl}`);
        console.log(`📁 Updated file: ${contactFilePath}`);
    }
    
} catch (error) {
    console.error('❌ Error updating frontend file:', error.message);
    process.exit(1);
}

console.log('');
console.log('📝 Next steps:');
console.log('1. Ensure AWS SES email is verified');
console.log('2. Test contact form functionality');
console.log('3. Rebuild and deploy frontend application');