import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import './Projects.css'

const Projects = () => {
  const [selectedProject, setSelectedProject] = useState(null)

  const projects = [
    {
      id: 1,
      title: 'Student Peer Review System',
      description: 'A web application that allows teachers to manage courses and assessments, and students to review their peers based on custom criteria.',
      detailedDescription: `A comprehensive web application designed to facilitate peer review processes in educational environments. This system supports two user roles: teachers and students, providing a streamlined platform for academic assessment and collaboration.

System Overview:
Teachers can upload courses, enroll students, create peer assessments, and download review templates. Students can submit peer reviews for their classmates based on teacher-defined assessments.`,
      icon: 'fas fa-users',
      image: '/images/projects/peer-review-system.jpg',
      tech: ['Laravel', 'SQLite', 'PHP', 'HTML/CSS'],
      features: [
        'Role-based login system using s-number authentication',
        'Teacher Functions: Upload courses, add assessments, enroll students in courses',
        'Student Functions: Complete peer reviews for classmates using simple, intuitive forms',
        'Assessment Management: Teachers can create custom peer review criteria and templates',
        'Review Templates: Downloadable templates for standardized assessment processes',
        'User Management: Efficient enrollment and role assignment system',
        'CRUD operations for all entities'
      ],
      challenges: [
        'Implementing secure role-based authentication with s-numbers',
        'Designing intuitive forms for peer review submissions',
        'Creating efficient student enrollment workflows',
        'Generating realistic test data with Laravel factories',
        'Ensuring data integrity across CRUD operations'
      ],
      liveDemo: '#',
      code: 'https://github.com/mengning-li/Student-peer-review.git'
    },
    {
      id: 2,
      title: 'Drug Speak – React Native App',
      description: 'A mobile app that helps users practice and improve their pronunciation of drug names through interactive features and community engagement.',
      detailedDescription: `Drug Speak is a React Native mobile app designed to support users—particularly pharmacy or medical students—in learning how to pronounce complex drug names accurately. The app provides a comprehensive learning environment with interactive features and community-driven feedback.`,
      icon: 'fas fa-microphone',
      image: '/images/projects/drug-speak-app.jpg',
      tech: ['React Native', 'Expo', 'expo-av', 'JavaScript'],
      features: [
        'Audio Playback System: Drug names played at different speeds for gradual learning',
        'Voice Recording: Users can upload their own voice recordings for self-evaluation',
        'Personalized Learning: "Add to Learning List" function for customized practice sessions',
        'Community Engagement: Display community rankings',
        'Progressive Learning: Multiple speed options to accommodate different learning paces',
        'Self-Assessment Tools: Compare personal recordings with standard pronunciations',
      ],
      challenges: [
        'Implementing efficient audio playback with expo-av',
        'Creating intuitive voice recording user interface',
        'Designing audio mapping logic for large drug databases',
        'Building responsive UI components for various mobile screens',
        'Optimizing audio file management and storage'
      ],
      liveDemo: '#',
      code: 'https://github.com/mengning-li/DrugSpeak.git'
    },
    {
      id: 3,
      title: 'Personal Portfolio Website',
      description: 'A responsive and professional portfolio website showcasing my skills, projects, and contact information. Built with React and deployed on GitHub Pages with Vercel backend integration.',
      detailedDescription: `A modern, responsive personal portfolio website built with React, featuring a clean component-based architecture. The site showcases my skills, projects, and professional background with an integrated contact form. Deployed on GitHub Pages for the frontend with a separate Vercel backend to handle contact form submissions securely.`,
      icon: 'fas fa-briefcase',
      image: '/images/projects/personal-portfolio.jpg',
      tech: ['React', 'JavaScript', 'CSS', 'Vercel', 'GitHub Pages'],
      features: [
        'Responsive design optimized for all devices',
        'Professional layout with smooth animations',
        'Interactive contact form with email integration',
        'Dark theme support throughout the site',
        'Modern component-based React architecture',
        'GitHub Pages deployment for fast loading'
      ],
      challenges: [
        'Creating consistent visual design across different screen sizes',
        'Implementing secure contact form with Vercel backend and Nodemailer',
        'Setting up cross-origin communication between GitHub Pages and Vercel API',
        'Optimizing mobile responsiveness and navigation experience'
      ],
      liveDemo: 'https://mengning-li.github.io',
      code: 'https://github.com/mengning-li/mengning-li.github.io'
    }
  ]

  const openModal = (project) => {
    setSelectedProject(project)
    document.body.style.overflow = 'hidden'
  }

  const closeModal = () => {
    setSelectedProject(null)
    document.body.style.overflow = 'unset'
  }

  return (
    <>
      <section id="projects" className="projects">
        <div className="content-container">
          <motion.div 
            className="section-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="section-title">Featured Projects</h2>
            <p className="section-subtitle">Some of my recent work</p>
          </motion.div>

          <motion.div 
            className="projects-grid"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                className="project-card"
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                whileHover={{ y: -10, scale: 1.02 }}
                viewport={{ once: true }}
                onClick={() => openModal(project)}
                style={{ cursor: 'pointer' }}
              >
                <div 
                  className="project-image"
                  style={{
                    backgroundImage: `url(${project.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                  }}
                >
                </div>
                
                <div className="project-content">
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                  
                  <div className="project-tech">
                    {project.tech.map((tech, techIndex) => (
                      <span key={techIndex} className="tech-tag">{tech}</span>
                    ))}
                  </div>
                  
                  <div className="project-links">
                    <motion.a
                      href={project.liveDemo}
                      className="project-link"
                      whileHover={{ scale: 1.05 }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <i className="fas fa-external-link-alt"></i> Live Demo
                    </motion.a>
                    <motion.a
                      href={project.code}
                      className="project-link"
                      whileHover={{ scale: 1.05 }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <i className="fab fa-github"></i> Code
                    </motion.a>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Project Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          >
            <motion.div
              className="modal-content"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="modal-close" onClick={closeModal}>
                <i className="fas fa-times"></i>
              </button>
              
              <div className="modal-header">
                <div className="modal-icon">
                  <i className={selectedProject.icon}></i>
                </div>
                <h2>{selectedProject.title}</h2>
              </div>

              <div className="modal-body">
                <div className="modal-section">
                  <h3>Project Overview</h3>
                  <p className="modal-description">{selectedProject.detailedDescription}</p>
                </div>

                <div className="modal-section">
                  <h3>Technologies Used</h3>
                  <div className="modal-tech">
                    {selectedProject.tech.map((tech, index) => (
                      <span key={index} className="modal-tech-tag">{tech}</span>
                    ))}
                  </div>
                </div>

                <div className="modal-section">
                  <h3>Key Features</h3>
                  <ul className="modal-list">
                    {selectedProject.features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                </div>

                <div className="modal-section">
                  <h3>Challenges & Solutions</h3>
                  <ul className="modal-list">
                    {selectedProject.challenges.map((challenge, index) => (
                      <li key={index}>{challenge}</li>
                    ))}
                  </ul>
                </div>

                <div className="modal-actions">
                  <motion.a
                    href={selectedProject.liveDemo}
                    className="modal-btn modal-btn-primary"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <i className="fas fa-external-link-alt"></i> Live Demo
                  </motion.a>
                  <motion.a
                    href={selectedProject.code}
                    className="modal-btn modal-btn-secondary"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <i className="fab fa-github"></i> View Code
                  </motion.a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default Projects 