import { motion } from 'framer-motion'
import './Footer.css'

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <motion.div 
          className="footer-content"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <p>&copy; 2025 Mengning Li. All rights reserved.</p>
        </motion.div>
      </div>
    </footer>
  )
}

export default Footer 