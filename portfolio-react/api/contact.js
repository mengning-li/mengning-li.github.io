export default async function handler(req, res) {
  // Set CORS headers to allow requests from GitHub Pages
  res.setHeader('Access-Control-Allow-Origin', 'https://mengning-li.github.io')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const { name, email, subject, message } = req.body

  // Basic validation
  if (!name || !email || !message) {
    return res.status(400).json({ message: 'Missing required fields' })
  }

  try {
    // Here you can integrate with your preferred email service:
    // - Nodemailer with Gmail/Outlook
    // - SendGrid
    // - Resend
    // - Or just log to Vercel's logs for now

    console.log('Contact form submission:', {
      name,
      email,
      subject: subject || 'No subject',
      message,
      timestamp: new Date().toISOString()
    })

    // For now, we'll just return success
    // You can add actual email sending here later
    res.status(200).json({ 
      message: 'Message received successfully!',
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Error processing contact form:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
} 