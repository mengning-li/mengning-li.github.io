// Use AWS SDK v3 for Node.js 18+
const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses');
const sesClient = new SESClient({ region: 'us-east-1' });

// Rate limiting storage (in production, use DynamoDB)
const rateLimitMap = new Map();

// Security and validation functions
const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && email.length <= 100;
};

const isValidInput = (input, maxLength = 1000) => {
    if (!input || typeof input !== 'string') return false;
    if (input.length > maxLength) return false;
    
    // Check for suspicious patterns
    const suspiciousPatterns = [
        /<script/i,
        /javascript:/i,
        /on\w+\s*=/i,
        /\[url\]/i,
        /\[link\]/i,
        /viagra|cialis|pharmacy|casino|poker/i
    ];
    
    return !suspiciousPatterns.some(pattern => pattern.test(input));
};

const checkRateLimit = (sourceIp) => {
    const now = Date.now();
    const windowMs = 3600000; // 1 hour
    const maxRequests = 10; // Maximum 10 emails per hour per IP
    
    if (!rateLimitMap.has(sourceIp)) {
        rateLimitMap.set(sourceIp, []);
    }
    
    const requests = rateLimitMap.get(sourceIp);
    
    // Remove old requests outside the time window
    const validRequests = requests.filter(time => now - time < windowMs);
    
    if (validRequests.length >= maxRequests) {
        return false; // Rate limit exceeded
    }
    
    validRequests.push(now);
    rateLimitMap.set(sourceIp, validRequests);
    return true;
};

exports.handler = async (event) => {
    console.log('Received event:', JSON.stringify(event, null, 2));
    
    // Get source IP for rate limiting
    const sourceIp = event.requestContext?.identity?.sourceIp || 'unknown';
    
    // Set CORS headers - allow both production and local development
    const origin = event.headers?.origin || event.headers?.Origin;
    const allowedOrigins = [
        'https://mengning-li.github.io',
        'http://localhost:5173',
        'http://127.0.0.1:5173',
        'file://',
        'null'
    ];
    const corsOrigin = allowedOrigins.includes(origin) || !origin ? '*' : 'https://mengning-li.github.io';
    
    const headers = {
        'Access-Control-Allow-Origin': corsOrigin,
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json'
    };
    
    // Handle OPTIONS preflight request
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: ''
        };
    }
    
    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ message: 'Method not allowed' })
        };
    }
    
    try {
        // Check rate limit first
        if (!checkRateLimit(sourceIp)) {
            console.warn(`Rate limit exceeded for IP: ${sourceIp}`);
            return {
                statusCode: 429,
                headers,
                body: JSON.stringify({
                    success: false,
                    message: 'Too many requests. Please try again later.'
                })
            };
        }

        let body;
        if (typeof event.body === 'string') {
            body = JSON.parse(event.body);
        } else {
            body = event.body;
        }
        
        const { name, email, message, subject } = body;
        
        // Enhanced validation
        if (!name || !email || !message) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ 
                    success: false,
                    message: 'Missing required fields: name, email, message' 
                })
            };
        }
        
        // Enhanced security validation
        if (!isValidEmail(email)) {
            console.warn(`Invalid email attempted: ${email} from IP: ${sourceIp}`);
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({
                    success: false,
                    message: 'Invalid email address format'
                })
            };
        }

        if (!isValidInput(name, 100) || !isValidInput(message, 2000) || !isValidInput(subject, 200)) {
            console.warn(`Suspicious input detected from IP: ${sourceIp}`, { name, email, subject });
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ 
                    success: false,
                    message: 'Invalid input detected. Please check your message content.' 
                })
            };
        }
        
        // Prepare email content
        const emailSubject = subject || `Portfolio Contact: Message from ${name}`;
        const emailBody = `
Name: ${name}
Email: ${email}
Subject: ${subject || 'No subject'}

Message:
${message}

---
Sent from your portfolio website
Time: ${new Date().toISOString()}
        `.trim();
        
        // SES email parameters
        const emailParams = {
            Source: 'limengninglmn@gmail.com', // Must be a verified email address
            Destination: {
                ToAddresses: ['limengninglmn@gmail.com']
            },
            Message: {
                Subject: {
                    Data: emailSubject,
                    Charset: 'UTF-8'
                },
                Body: {
                    Text: {
                        Data: emailBody,
                        Charset: 'UTF-8'
                    },
                    Html: {
                        Data: `
                            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                                <h2 style="color: #333;">New Portfolio Contact Message</h2>
                                <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                                    <p><strong>Name:</strong> ${name}</p>
                                    <p><strong>Email:</strong> ${email}</p>
                                    <p><strong>Subject:</strong> ${subject || 'No subject'}</p>
                                </div>
                                <div style="background: white; padding: 20px; border-left: 4px solid #007bff;">
                                    <p><strong>Message:</strong></p>
                                    <p style="white-space: pre-wrap;">${message}</p>
                                </div>
                                <hr style="margin: 30px 0;">
                                <p style="color: #666; font-size: 12px;">
                                    Sent from your portfolio website<br>
                                    Time: ${new Date().toLocaleString()}
                                </p>
                            </div>
                        `,
                        Charset: 'UTF-8'
                    }
                }
            },
            ReplyToAddresses: [email] // Allow direct reply to sender
        };
        
        // Send email
        const command = new SendEmailCommand(emailParams);
        await sesClient.send(command);
        
        console.log('Email sent successfully');
        
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                message: 'Message sent successfully!',
                timestamp: new Date().toISOString()
            })
        };
        
    } catch (error) {
        console.error('Error processing contact form:', error);
        
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                success: false,
                message: 'Internal server error. Please try again later.'
            })
        };
    }
};