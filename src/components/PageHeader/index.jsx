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
            ← {backLabel}
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
