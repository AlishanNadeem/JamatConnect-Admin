import { forwardRef, useState } from 'react'
import './Input.scss'

const MailIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
    <path
      d="M4 6.5h16a1.5 1.5 0 0 1 1.5 1.5v10A1.5 1.5 0 0 1 20 19.5H4A1.5 1.5 0 0 1 2.5 18V8A1.5 1.5 0 0 1 4 6.5Z"
      stroke="currentColor"
      strokeWidth="1.6"
    />
    <path d="m3.5 8 8.5 6 8.5-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
)

const LockIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
    <rect x="4.5" y="10" width="15" height="10" rx="2" stroke="currentColor" strokeWidth="1.6" />
    <path
      d="M8 10V7.5a4 4 0 0 1 8 0V10"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
  </svg>
)

const EyeIcon = ({ open }) =>
  open ? (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M2.5 12s3.5-7 9.5-7 9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7Z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <circle cx="12" cy="12" r="2.75" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M3 3l18 18M10.5 10.7a2.75 2.75 0 0 0 3.8 3.8M7 7.4C4.6 9 3 12 3 12s3.5 7 9.5 7c1.8 0 3.4-.5 4.8-1.2M17.4 14.7C19.5 13.1 21.5 12 21.5 12S18 5 12 5c-.8 0-1.5.1-2.2.2"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  )

const Input = forwardRef(
  (
    {
      label,
      required = false,
      error,
      type = 'text',
      icon,
      className = '',
      ...rest
    },
    ref
  ) => {
    const [show_password, setShowPassword] = useState(false)
    const is_password = type === 'password'
    const input_type = is_password ? (show_password ? 'text' : 'password') : type
    const has_icon = icon === 'mail' || icon === 'lock' || is_password

    return (
      <div
        className={`jc-input ${has_icon ? 'jc-input--with-icon' : ''} ${is_password ? 'jc-input--password' : ''} ${error ? 'jc-input--error' : ''} ${className}`}
      >
        {label ? (
          <label className="jc-input__label">
            {label}
            {required ? <span className="jc-input__required">*</span> : null}
          </label>
        ) : null}

        <div className="jc-input__field">
          {icon === 'mail' ? (
            <span className="jc-input__icon">
              <MailIcon />
            </span>
          ) : null}
          {icon === 'lock' || is_password ? (
            <span className="jc-input__icon">
              <LockIcon />
            </span>
          ) : null}

          <input ref={ref} type={input_type} className="jc-input__control" {...rest} />

          {is_password ? (
            <button
              type="button"
              className="jc-input__toggle"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={show_password ? 'Hide password' : 'Show password'}
            >
              <EyeIcon open={show_password} />
            </button>
          ) : null}
        </div>

        {error ? <p className="jc-input__error">{error}</p> : null}
      </div>
    )
  }
)

Input.displayName = 'Input'

export default Input
