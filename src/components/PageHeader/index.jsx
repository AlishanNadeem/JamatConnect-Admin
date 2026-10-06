import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import './PageHeader.scss'

const PageHeader = ({
  eyebrow,
  title,
  subtitle,
  backTo,
  backLabel = 'Back',
  actions,
}) => {
  return (
    <motion.div
      className="page-header"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <div className="page-header__copy">
        {backTo ? (
          <Link to={backTo} className="page-header__back">
            <svg
              className="page-header__back-icon"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden
            >
              <path
                d="M15 6 9 12l6 6"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>{backLabel}</span>
          </Link>
        ) : null}
        {eyebrow ? <p className="page-header__eyebrow">{eyebrow}</p> : null}
        <h1 className="page-header__title">{title}</h1>
        {subtitle ? <p className="page-header__subtitle">{subtitle}</p> : null}
      </div>
      {actions ? <div className="page-header__actions">{actions}</div> : null}
    </motion.div>
  )
}

export default PageHeader
