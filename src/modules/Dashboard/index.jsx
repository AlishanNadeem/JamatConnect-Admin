import { motion } from 'framer-motion'
import './Dashboard.scss'

const Dashboard = () => {
  return (
    <motion.section
      className="dashboard-home"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <p className="dashboard-home__eyebrow">Welcome</p>
      <h1 className="dashboard-home__title">Admin dashboard is ready</h1>
      <p className="dashboard-home__copy">
        Auth and profile modules are connected. Additional admin modules can be added here next.
      </p>
    </motion.section>
  )
}

export default Dashboard
