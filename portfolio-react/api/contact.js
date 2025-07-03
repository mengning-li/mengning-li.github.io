export default async function handler(req, res) {
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