import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { AlertTriangle, CheckCircle2, Info, TriangleAlert } from 'lucide-react'
import { useEffect } from 'react'
import './Modal.scss'

const VARIANT_ICONS = {
  danger: TriangleAlert,
  warning: AlertTriangle,
  info: Info,
  success: CheckCircle2,
}

const Modal = ({
  open = false,
  title,
  description,
  children,
  onClose,
  variant = 'default',
  size = 'md',
}) => {
  useEffect(() => {
    if (!open) return undefined

    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose?.()
    }

    const previous_overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = previous_overflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [open, onClose])

  const Icon = VARIANT_ICONS[variant]

  return createPortal(
    <AnimatePresence>
      {open ? (
        <motion.div
          className="jc-modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.button
            type="button"
            className="jc-modal__backdrop"
            aria-label="Close dialog"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.div
            className={`jc-modal__panel is-${size} is-${variant}`}
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? 'jc-modal-title' : undefined}
            aria-describedby={description ? 'jc-modal-description' : undefined}
            initial={{ opacity: 0, y: 14, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 420, damping: 30 }}
          >
            {title || description ? (
              <div className="jc-modal__header">
                {Icon ? (
                  <span className={`jc-modal__icon is-${variant}`} aria-hidden>
                    <Icon size={22} strokeWidth={2} />
                  </span>
                ) : null}
                <div className="jc-modal__copy">
                  {title ? (
                    <h2 id="jc-modal-title" className="jc-modal__title">
                      {title}
                    </h2>
                  ) : null}
                  {description ? (
                    <p id="jc-modal-description" className="jc-modal__description">
                      {description}
                    </p>
                  ) : null}
                </div>
              </div>
            ) : null}

            {children ? <div className="jc-modal__body">{children}</div> : null}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body
  )
}

export default Modal
