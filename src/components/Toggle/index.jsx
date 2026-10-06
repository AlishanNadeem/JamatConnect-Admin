import './Toggle.scss'

const Toggle = ({ checked = false, onChange, label, id, disabled = false }) => {
  const input_id = id || `toggle-${label?.replace(/\s+/g, '-').toLowerCase() || 'field'}`

  return (
    <label className={`toggle ${disabled ? 'is-disabled' : ''}`} htmlFor={input_id}>
      <input
        id={input_id}
        type="checkbox"
        className="toggle__input"
        checked={checked}
        disabled={disabled}
        onChange={(event) => onChange?.(event.target.checked)}
      />
      <span className="toggle__track" aria-hidden>
        <span className="toggle__thumb" />
      </span>
      {label ? <span className="toggle__label">{label}</span> : null}
    </label>
  )
}

export default Toggle
