import { AnimatePresence, motion } from 'framer-motion'
import './Alert.scss'

const Alert = ({ type = 'error', message, onClose }) => {
  return (
    <AnimatePresence>
      {message ? (
        <motion.div
          className={`jc-alert jc-alert--${type}`}
          role="alert"
          initial={{ opacity: 0, y: -8, height: 0 }}
          animate={{ opacity: 1, y: 0, height: 'auto' }}
          exit={{ opacity: 0, y: -6, height: 0 }}
          transition={{ duration: 0.28 }}
        >
          <p>{message}</p>
          {onClose ? (
            <button type="button" className="jc-alert__close" onClick={onClose} aria-label="Dismiss">
              ×
            </button>
          ) : null}
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}

export default Alert
