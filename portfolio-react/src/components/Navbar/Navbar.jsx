import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './Navbar.css'

const Navbar = ({ activeSection, darkMode, toggleDarkMode }) => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'skills', label: 'Skills' },
    { id: 'projects', label: 'Projects' },
    { id: 'contact', label: 'Contact' }
  ]

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
      setIsMobileMenuOpen(false)
    }
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <motion.nav 
      className={`navbar ${isScrolled ? 'scrolled' : ''}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      style={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 9999
      }}
    >
      <div className="nav-container">
        <motion.div 
          className="nav-logo"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <button onClick={() => scrollToSection('home')}>
            Mengning Li
          </button>
        </motion.div>

        <div className={`nav-menu ${isMobileMenuOpen ? 'active' : ''}`}>
          {navItems.map((item) => (
            <motion.button
              key={item.id}
              className={`nav-link ${activeSection === item.id ? 'active' : ''}`}
              onClick={() => scrollToSection(item.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {item.label}
              {activeSection === item.id && (
                <motion.div
                  className="active-indicator"
                  layoutId="activeIndicator"
                  initial={false}
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </motion.button>
          ))}
        </div>

        <div className="nav-controls">
          <motion.button
            className="theme-toggle"
            onClick={toggleDarkMode}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <i className={`fas ${darkMode ? 'fa-sun' : 'fa-moon'}`}></i>
          </motion.button>

          <motion.button
            className={`nav-toggle ${isMobileMenuOpen ? 'active' : ''}`}
            onClick={toggleMobileMenu}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
          </motion.button>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="mobile-menu-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>
    </motion.nav>
  )
}

export default Navbar 