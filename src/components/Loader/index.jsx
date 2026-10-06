import './Loader.scss'

const Loader = ({ label = 'Loading…', compact = false }) => {
  return (
    <div
      className={`jc-loader ${compact ? 'jc-loader--compact' : ''}`}
      role="status"
      aria-live="polite"
    >
      <span className="jc-loader__ring" />
      <p>{label}</p>
    </div>
  )
}

export default Loader
