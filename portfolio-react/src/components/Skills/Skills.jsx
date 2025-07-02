import { motion } from 'framer-motion'
import './Skills.css'

const Skills = () => {
  const skills = [
    {
      icon: 'fab fa-html5',
      title: 'Frontend Development',
      description: 'HTML5, CSS3, JavaScript, React',
      color: '#e34f26'
    },
    {
      icon: 'fas fa-server',
      title: 'Backend Development', 
      description: 'Laravel, Python',
      color: '#68a063'
    },
    {
      icon: 'fas fa-database',
      title: 'Database',
      description: 'MySQL, MongoDB',
      color: '#336791'
    },
    {
      icon: 'fab fa-aws',
      title: 'Cloud & DevOps',
      description: 'AWS, Docker, Git',
      color: '#ff9900'
    },
    {
      icon: 'fas fa-mobile-alt',
      title: 'Mobile Development',
      description: 'React Native',
      color: '#61dafb'
    },
  ]

  return (
    <section id="skills" className="skills">
      <div className="content-container">
        <motion.div 
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="section-title">Skills & Expertise</h2>
          <p className="section-subtitle">Technologies I work with</p>
        </motion.div>

        <motion.div 
          className="skills-grid"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          {skills.map((skill, index) => (
            <motion.div
              key={index}
              className="skill-card"
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -10, scale: 1.02 }}
              viewport={{ once: true }}
            >
              <motion.div 
                className="skill-icon"
                style={{ backgroundColor: skill.color }}
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <i className={skill.icon}></i>
              </motion.div>
              <h3>{skill.title}</h3>
              <p>{skill.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default Skills 