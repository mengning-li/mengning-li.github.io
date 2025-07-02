import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import './Hero.css'

const Hero = () => {
  const [displayText, setDisplayText] = useState('')
  const fullText = "Full Stack Developer & Creative Problem Solver"

  useEffect(() => {
    let index = 0
    const timer = setInterval(() => {
      if (index <= fullText.length) {
        setDisplayText(fullText.slice(0, index))
        index++
      } else {
        clearInterval(timer)
      }
    }, 80)

    return () => clearInterval(timer)
  }, [])

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const downloadCV = () => {
    // Create a temporary link to download CV
    const cvUrl = '/documents/Mengning_Li_CV.pdf' // You'll need to add this file to public/documents/
    const link = document.createElement('a')
    link.href = cvUrl
    link.download = 'Mengning_Li_CV.pdf'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <section id="home" className="home">
      <div className="home-container">
        <motion.div 
          className="home-image"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <div className="home-avatar">
            <img 
              src="/images/myPhoto.PNG" 
              alt="Mengning Li"
              className="profile-photo"
            />
          </div>
        </motion.div>

        <motion.div 
          className="home-content"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{ marginTop: '2rem' }}
        >
          <div className="home-text">
            <motion.h1 className="home-title">
            Hi, I'm <span className="name-highlight">Mengning Li</span>
            </motion.h1>
            
            
            <motion.p className="home-subtitle">
              {displayText}
              <span className="cursor">|</span>
            </motion.p>
            
            <motion.p className="home-description">
              I'm a passionate and detail-oriented full stack developer with a strong foundation in both frontend and backend technologies. 
              I have experience working with React, Laravel, MySQL, and Docker, and I enjoy building clean, efficient, and user-focused web applications. 
              I'm always eager to explore new technologies and consider myself a lifelong learner, constantly seeking ways to grow and adapt in a fast-changing industry.
            </motion.p>
            
            <motion.div className="home-buttons">
              <motion.button
                className="btn btn-primary"
                onClick={downloadCV}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <i className="fas fa-download" style={{ marginRight: '0.5rem' }}></i>
                Download CV
              </motion.button>
              <motion.button
                className="btn btn-secondary"
                onClick={() => scrollToSection('contact')}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <i className="fas fa-envelope" style={{ marginRight: '0.5rem' }}></i>
                Get In Touch
              </motion.button>
            </motion.div>
          </div>

          <div className="education-section">
            <div className="education-card">
              <div className="education-header">
                <div className="education-icon">
                  <i className="fas fa-graduation-cap"></i>
                </div>
                <div className="education-badge">Latest Achievement</div>
              </div>
                             <div className="education-content">
                 <h3 className="education-degree">Master's in Information Technology</h3>
                 <div className="education-details">
                   <p className="education-university">Griffith University</p>
                   <span className="education-year">2023 - 2025</span>
                 </div>
               </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Hero 