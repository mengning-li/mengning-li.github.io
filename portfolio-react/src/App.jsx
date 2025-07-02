import { useState, useEffect } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import Navbar from './components/Navbar/Navbar'
import Hero from './components/Hero/Hero'
import Skills from './components/Skills/Skills'
import Projects from './components/Projects/Projects'
import Contact from './components/Contact/Contact'
import Footer from './components/Footer/Footer'
import './App.css'

function App() {
  const [darkMode, setDarkMode] = useState(false)
  const [activeSection, setActiveSection] = useState('home')

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'skills', 'projects', 'contact']
      const scrollPosition = window.scrollY + 100

      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const { offsetTop, offsetHeight } = element
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section)
            break
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    // Initialize theme from localStorage or system preference
    const savedTheme = localStorage.getItem('theme')
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const initialDarkMode = savedTheme ? savedTheme === 'dark' : systemPrefersDark
    
    setDarkMode(initialDarkMode)
    document.documentElement.setAttribute('data-theme', initialDarkMode ? 'dark' : 'light')
  }, [])

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode
    setDarkMode(newDarkMode)
    document.documentElement.setAttribute('data-theme', newDarkMode ? 'dark' : 'light')
    localStorage.setItem('theme', newDarkMode ? 'dark' : 'light')
  }

  return (
    <Router>
      <div className={`App ${darkMode ? 'dark-mode' : ''}`}>
        <Navbar 
          activeSection={activeSection} 
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
        />
        <main>
          <Hero />
          <Skills />
          <Projects />
          <Contact />
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App
