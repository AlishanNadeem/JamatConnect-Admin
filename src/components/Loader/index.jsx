import './Loader.scss'

const Loader = ({ label = 'Loading…' }) => {
  return (
    <div className="jc-loader" role="status" aria-live="polite">
      <span className="jc-loader__ring" />
      <p>{label}</p>
    </div>
  )
}

export default Loader
