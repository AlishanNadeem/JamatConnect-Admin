import { useEffect, useId, useMemo, useRef, useState } from 'react'
import './Select.scss'

const ChevronIcon = ({ open }) => (
  <svg
    className={`jc-select__chevron ${open ? 'is-open' : ''}`}
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden
  >
    <path
      d="m6 9 6 6 6-6"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
    <path
      d="m5 12.5 5 5L19 7.5"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const Select = ({
  value,
  onChange,
  options = [],
  placeholder = 'Select…',
  className = '',
  disabled = false,
}) => {
  const [open, setOpen] = useState(false)
  const root_ref = useRef(null)
  const listbox_id = useId()

  const selected = useMemo(
    () => options.find((option) => option.value === value) || null,
    [options, value]
  )

  useEffect(() => {
    const onPointerDown = (event) => {
      if (!root_ref.current?.contains(event.target)) {
        setOpen(false)
      }
    }

    const onKeyDown = (event) => {
      if (event.key === 'Escape') setOpen(false)
    }

    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [])

  return (
    <div
      ref={root_ref}
      className={`jc-select ${open ? 'is-open' : ''} ${disabled ? 'is-disabled' : ''} ${className}`}
    >
      <button
        type="button"
        className="jc-select__trigger"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listbox_id}
        onClick={() => setOpen((prev) => !prev)}
      >
        <span className={`jc-select__value ${selected ? '' : 'is-placeholder'}`}>
          {selected?.label || placeholder}
        </span>
        <ChevronIcon open={open} />
      </button>

      {open ? (
        <ul id={listbox_id} className="jc-select__menu" role="listbox">
          {options.map((option) => {
            const is_selected = option.value === value

            return (
              <li key={String(option.value)} role="option" aria-selected={is_selected}>
                <button
                  type="button"
                  className={`jc-select__option ${is_selected ? 'is-selected' : ''}`}
                  onClick={() => {
                    onChange?.(option.value)
                    setOpen(false)
                  }}
                >
                  <span>{option.label}</span>
                  {is_selected ? <CheckIcon /> : null}
                </button>
              </li>
            )
          })}
        </ul>
      ) : null}
    </div>
  )
}

export default Select
