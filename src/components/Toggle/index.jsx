import './Toggle.scss'

const Toggle = ({ checked = false, onChange, label, id }) => {
  const input_id = id || `toggle-${label?.replace(/\s+/g, '-').toLowerCase() || 'field'}`

  return (
    <label className="toggle" htmlFor={input_id}>
      <input
        id={input_id}
        type="checkbox"
        className="toggle__input"
        checked={checked}
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
