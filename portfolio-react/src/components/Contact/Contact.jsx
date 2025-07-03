import { useState } from 'react'
import { motion } from 'framer-motion'
import './Contact.css'

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null) // 'success', 'error', or null

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const sanitizeInput = (input) => {
    // Basic XSS protection - remove potentially dangerous characters
    return input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                .replace(/<[^>]*>/g, '')
                .trim()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus(null)

    // Validate inputs
    if (!formData.name || !formData.email || !formData.message) {
      alert('Please fill in all required fields.')
      setIsSubmitting(false)
      return
    }

    if (!validateEmail(formData.email)) {
      alert('Please enter a valid email address.')
      setIsSubmitting(false)
      return
    }

    // Sanitize inputs
    const sanitizedData = {
      name: sanitizeInput(formData.name),
      email: sanitizeInput(formData.email),
      subject: sanitizeInput(formData.subject),
      message: sanitizeInput(formData.message)
    }

    try {
      // Submit to your Vercel API with Nodemailer
      const response = await fetch('https://portfolio-contact-api-iota.vercel.app/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: sanitizedData.name,
          email: sanitizedData.email,
          message: sanitizedData.message
        })
      })

      const result = await response.json()

      if (response.ok && result.success) {
        setSubmitStatus('success')
        setFormData({ name: '', email: '', subject: '', message: '' })
      } else {
        throw new Error(result.message || 'Failed to send message')
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      setSubmitStatus('error')
      
      // Fallback to mailto
      const subject = encodeURIComponent(sanitizedData.subject || 'Contact from Portfolio Website')
      const body = encodeURIComponent(
        `Name: ${sanitizedData.name}\nEmail: ${sanitizedData.email}\n\nMessage:\n${sanitizedData.message}`
      )
      const mailtoLink = `mailto:limengninglmn@gmail.com?subject=${subject}&body=${body}`
      window.open(mailtoLink, '_blank')
    } finally {
      setIsSubmitting(false)
    }
  }

  const contactInfo = [
    {
      icon: 'fas fa-envelope',
      text: 'limengninglmn@gmail.com'
    },
    {
      icon: 'fas fa-phone', 
      text: '+61 450230234'
    },
    {
      icon: 'fas fa-map-marker-alt',
      text: 'Gold Coast, Australia'
    }
  ]

  const socialLinks = [
    { icon: 'fab fa-github', url: 'https://github.com/mengning-li' },
    { icon: 'fab fa-linkedin', url: 'https://www.linkedin.com/in/mengning-li/' },
  ]

  return (
    <section id="contact" className="contact">
      <div className="content-container">
        <motion.div 
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="section-title">Get In Touch</h2>
          <p className="section-subtitle">Let's work together</p>
        </motion.div>

        <motion.div 
          className="contact-content"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <motion.div className="contact-info">
            <h3>Let's create something amazing together</h3>
            <p>
              I'm always interested in new opportunities and exciting projects. 
              Whether you have a question or just want to say hi, I'll do my best to get back to you!
            </p>
            
            <div className="contact-items">
              {contactInfo.map((item, index) => (
                <motion.div 
                  key={index}
                  className="contact-item"
                  whileHover={{ x: 5 }}
                >
                  <i className={item.icon}></i>
                  <span>{item.text}</span>
                </motion.div>
              ))}
            </div>
            
            <div className="social-links">
              {socialLinks.map((link, index) => (
                <motion.a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-link"
                  whileHover={{ scale: 1.1, y: -3 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <i className={link.icon}></i>
                </motion.a>
              ))}
            </div>
          </motion.div>

          <motion.div className="contact-form">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name *"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div className="form-group">
                <input
                  type="email"
                  name="email"
                  placeholder="Your Email *"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  name="subject"
                  placeholder="Subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                />
              </div>
              <div className="form-group">
                <textarea
                  name="message"
                  placeholder="Your Message *"
                  rows="5"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  disabled={isSubmitting}
                ></textarea>
              </div>
              
              {submitStatus === 'success' && (
                <div className="status-message success">
                  <i className="fas fa-check-circle"></i>
                  Message sent successfully! I'll get back to you soon.
                </div>
              )}
              
              {submitStatus === 'error' && (
                <div className="status-message error">
                  <i className="fas fa-exclamation-circle"></i>
                  Sorry, there was an error sending your message. Please try again or contact me directly.
                </div>
              )}
              
              <motion.button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting}
                whileHover={!isSubmitting ? { scale: 1.05 } : {}}
                whileTap={!isSubmitting ? { scale: 0.95 } : {}}
              >
                {isSubmitting ? (
                  <>
                    <i className="fas fa-spinner fa-spin" style={{ marginRight: '0.5rem' }}></i>
                    Sending...
                  </>
                ) : (
                  <>
                    <i className="fas fa-paper-plane" style={{ marginRight: '0.5rem' }}></i>
                    Send Message
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export default Contact 