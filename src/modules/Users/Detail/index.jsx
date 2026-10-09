import { Link } from 'react-router-dom'
import { Check, Copy } from 'lucide-react'
import { motion } from 'framer-motion'
import Alert from '@/components/Alert'
import Button from '@/components/Button'
import Loader from '@/components/Loader'
import StatusBadge from '@/components/StatusBadge'
import { formatDate, formatDateTime, formatPhone } from '@/helpers/general'
import { ROUTES, userDetailRoute } from '@/helpers/routes'
import useUserDetailController from './useUserDetailController'
import './UserDetail.scss'

const Row = ({ label, value, wide = false }) => (
  <div className={`user-detail__row ${wide ? 'is-wide' : ''}`}>
    <span className="user-detail__label">{label}</span>
    <span className="user-detail__value">{value || '—'}</span>
  </div>
)

const UserDetail = () => {
  const { values, functions } = useUserDetailController()
  const user = values.user

  if (values.isLoading && !user) {
    return <Loader label="Loading user details…" compact />
  }

  if (values.isError && !user) {
    return (
      <div className="user-detail">
        <Link to={ROUTES.USERS} className="user-detail__back">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M15 6 9 12l6 6"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Back to Users
        </Link>
        <div className="user-detail__error">
          <Alert type="error" message={values.error_message} />
          <Button fullWidth={false} variant="ghost" onClick={functions.refetch}>
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="user-detail">
      <div className="user-detail__top">
        <Link to={ROUTES.USERS} className="user-detail__back">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M15 6 9 12l6 6"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Back to Users
        </Link>
      </div>

      <motion.div
        className="user-detail__layout"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <aside className="user-detail__aside">
          <div className="user-detail__avatar">
            {user.image_url ? (
              <img src={user.image_url} alt={user.name} />
            ) : (
              <span>{user.name?.[0]?.toUpperCase() || 'U'}</span>
            )}
          </div>

          <h1 className="user-detail__name">
            {user.name}
            {values.is_self ? <span className="user-detail__you">You</span> : null}
          </h1>
          <p className="user-detail__email">{user.email}</p>

          <div className="user-detail__badges">
            <span className={`user-detail__role is-${user.role}`}>{user.role}</span>
            <StatusBadge active={user.active} />
          </div>

          {!values.is_self ? (
            <div className="user-detail__cta-wrap">
              <Button
                fullWidth
                variant={user.active ? 'ghost' : 'primary'}
                loading={values.is_toggling}
                onClick={functions.onToggleActive}
                className={`user-detail__cta ${user.active ? 'is-deactivate' : 'is-activate'}`}
              >
                {user.active ? 'Mark Inactive' : 'Mark Active'}
              </Button>
            </div>
          ) : null}
        </aside>

        <div className="user-detail__main">
          <section className="user-detail__block">
            <h2 className="user-detail__heading">Contact information</h2>
            <div className="user-detail__rows">
              <Row label="Phone" value={formatPhone(user)} />
              <Row label="Country" value={user.country_code} />
              <Row label="Dialing code" value={user.dialing_code} />
            </div>
          </section>

          <section className="user-detail__block">
            <h2 className="user-detail__heading">Account</h2>
            <div className="user-detail__rows">
              <Row
                label="Sign-in method"
                value={(user.auth_provider || 'email').replace(/^\w/, (c) => c.toUpperCase())}
              />
              <Row label="Added by admin" value={user.is_seed ? 'Yes' : 'No'} />
              <Row
                label="Push notifications"
                value={
                  <span
                    className={`user-detail__flag ${
                      user.push_notifications_enabled ? 'is-on' : 'is-off'
                    }`}
                  >
                    {user.push_notifications_enabled ? 'On' : 'Off'}
                  </span>
                }
              />
              <Row label="Member since" value={formatDate(user.createdAt)} />
              <Row label="Last login" value={formatDateTime(user.last_login?.at)} />
              <Row label="Last updated" value={formatDate(user.updatedAt)} />
            </div>
          </section>

          <section className="user-detail__block">
            <h2 className="user-detail__heading">Referral</h2>
            <div className="user-detail__rows">
              <Row
                label="Referred by"
                value={
                  user.referred_by_user?._id ? (
                    <Link
                      to={userDetailRoute(user.referred_by_user._id)}
                      className="user-detail__inline-link"
                    >
                      {user.referred_by_user.name}
                      {user.referred_by_user.email
                        ? ` (${user.referred_by_user.email})`
                        : ''}
                    </Link>
                  ) : user.is_seed ? (
                    'Admin (added directly)'
                  ) : null
                }
              />
              <Row label="Code" value={user.referral?.code} />
              <Row
                label="Code status"
                value={
                  user.referral?.code ? (
                    <StatusBadge active={user.referral.active} />
                  ) : null
                }
              />
              <Row
                label="Link"
                wide
                value={
                  user.referral_link ? (
                    <span className="user-detail__link-row">
                      <span className="user-detail__link-text">{user.referral_link}</span>
                      <button
                        type="button"
                        className={`user-detail__copy ${values.link_copied ? 'is-copied' : ''}`}
                        onClick={functions.onCopyReferralLink}
                        title={values.link_copied ? 'Copied' : 'Copy referral link'}
                      >
                        {values.link_copied ? <Check size={15} /> : <Copy size={15} />}
                        <span>{values.link_copied ? 'Copied' : 'Copy'}</span>
                      </button>
                    </span>
                  ) : null
                }
              />
            </div>

            {values.can_manage_referral ? (
              <div className="user-detail__referral-actions">
                {values.has_referral ? (
                  <Button
                    fullWidth={false}
                    variant={user.referral?.active ? 'ghost' : 'primary'}
                    loading={values.is_toggling_referral}
                    disabled={values.is_regenerating_referral}
                    onClick={functions.onToggleReferral}
                    className={`user-detail__referral-btn ${
                      user.referral?.active ? 'is-deactivate' : 'is-activate'
                    }`}
                  >
                    {user.referral?.active
                      ? 'Deactivate Referral Code'
                      : 'Activate Referral Code'}
                  </Button>
                ) : null}
                <Button
                  fullWidth={false}
                  variant="ghost"
                  loading={values.is_regenerating_referral}
                  disabled={values.is_toggling_referral}
                  onClick={functions.onRegenerateReferral}
                  className="user-detail__referral-btn is-regenerate"
                >
                  {values.has_referral
                    ? 'Regenerate Referral Code'
                    : 'Generate Referral Code'}
                </Button>
              </div>
            ) : null}
          </section>

          <section className="user-detail__block">
            <div className="user-detail__heading-row">
              <h2 className="user-detail__heading">People they referred</h2>
              <span className="user-detail__count">
                {user.referred_count || 0} member
                {(user.referred_count || 0) === 1 ? '' : 's'}
              </span>
            </div>

            {(user.referred_users || []).length ? (
              <div className="user-detail__people">
                {(user.referred_users || []).map((member) => (
                  <Link
                    key={member._id}
                    to={userDetailRoute(member._id)}
                    className="user-detail__person"
                  >
                    <span className="user-detail__person-avatar">
                      {member.image_url ? (
                        <img src={member.image_url} alt="" />
                      ) : (
                        <span>{member.name?.[0]?.toUpperCase() || 'U'}</span>
                      )}
                    </span>
                    <span className="user-detail__person-copy">
                      <span className="user-detail__person-name">{member.name}</span>
                      <span className="user-detail__person-email">{member.email}</span>
                    </span>
                    <span className="user-detail__person-date">
                      {formatDate(member.createdAt)}
                    </span>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="user-detail__empty">No referred members yet.</p>
            )}
          </section>
        </div>
      </motion.div>
    </div>
  )
}

export default UserDetail
