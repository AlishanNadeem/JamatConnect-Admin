import { forwardRef } from 'react'
import { motion } from 'framer-motion'
import './Button.scss'

const Button = forwardRef(
  (
    {
      children,
      type = 'button',
      variant = 'primary',
      loading = false,
      disabled = false,
      fullWidth = true,
      onClick,
      className = '',
      ...rest
    },
    ref
  ) => {
    const is_disabled = disabled || loading

    return (
      <motion.button
        ref={ref}
        type={type}
        className={`jc-btn jc-btn--${variant} ${fullWidth ? 'jc-btn--full' : ''} ${className}`}
        disabled={is_disabled}
        onClick={onClick}
        whileHover={is_disabled ? undefined : { y: -1, scale: 1.01 }}
        whileTap={is_disabled ? undefined : { scale: 0.985 }}
        transition={{ type: 'spring', stiffness: 420, damping: 28 }}
        {...rest}
      >
        {loading ? <span className="jc-btn__spinner" aria-hidden /> : null}
        <span className={loading ? 'jc-btn__label jc-btn__label--hidden' : 'jc-btn__label'}>
          {children}
        </span>
      </motion.button>
    )
  }
)

Button.displayName = 'Button'

export default Button
