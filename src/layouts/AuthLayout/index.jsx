import { motion } from 'framer-motion'
import logo from '@/assets/images/logo.png'
import './AuthLayout.scss'

const AuthLayout = ({ title, subtitle, children }) => {
  return (
    <div className="auth-layout">
      <div className="auth-layout__atmosphere" aria-hidden>
        <span className="auth-layout__orb auth-layout__orb--one" />
        <span className="auth-layout__orb auth-layout__orb--two" />
        <span className="auth-layout__pattern" />
      </div>

      <motion.div
        className="auth-layout__panel"
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.div
          className="auth-layout__brand"
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.12, duration: 0.5 }}
        >
          <img src={logo} alt="Jamat Connect" className="auth-layout__logo" />
          <p className="auth-layout__brand-name">Jamat Connect</p>
          <p className="auth-layout__brand-tag">Admin Panel</p>
        </motion.div>

        <motion.div
          className="auth-layout__content"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22, duration: 0.45 }}
        >
          <h1 className="auth-layout__title">{title}</h1>
          {subtitle ? <p className="auth-layout__subtitle">{subtitle}</p> : null}
          <div className="auth-layout__body">{children}</div>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default AuthLayout
