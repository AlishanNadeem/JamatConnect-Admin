import './StatusBadge.scss'

const StatusBadge = ({
  active,
  activeLabel = 'Active',
  inactiveLabel = 'Inactive',
}) => {
  return (
    <span className={`status-badge ${active ? 'is-active' : 'is-inactive'}`}>
      {active ? activeLabel : inactiveLabel}
    </span>
  )
}

export default StatusBadge
