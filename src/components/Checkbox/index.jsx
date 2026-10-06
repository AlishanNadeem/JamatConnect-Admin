import './Checkbox.scss'

const Checkbox = ({ label, checked = false, onChange, id }) => {
  const input_id = id || `checkbox-${label?.replace(/\s+/g, '-').toLowerCase()}`

  return (
    <label className="jc-checkbox" htmlFor={input_id}>
      <input
        id={input_id}
        type="checkbox"
        className="jc-checkbox__input"
        checked={checked}
        onChange={onChange}
      />
      <span className="jc-checkbox__box" aria-hidden>
        <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
          <path
            d="M1.5 5.2 4.4 8.1 10.5 1.5"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      {label ? <span className="jc-checkbox__label">{label}</span> : null}
    </label>
  )
}

export default Checkbox
