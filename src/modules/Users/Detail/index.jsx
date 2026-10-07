import { motion } from 'framer-motion'
import Alert from '@/components/Alert'
import Button from '@/components/Button'
import Loader from '@/components/Loader'
import PageHeader from '@/components/PageHeader'
import StatusBadge from '@/components/StatusBadge'
import { formatDate, formatPhone } from '@/helpers/general'
import { ROUTES } from '@/helpers/routes'
import useUserDetailController from './useUserDetailController'
import './UserDetail.scss'

const UserDetail = () => {
  const { values, functions } = useUserDetailController()
  const user = values.user

  if (values.isLoading && !user) {
    return <Loader label="Loading user details…" compact />
  }

  if (values.isError && !user) {
    return (
      <div className="user-detail-page">
        <PageHeader
          backTo={ROUTES.USERS}
          backLabel="Back to Users"
          title="User details"
        />
        <div className="user-detail-page__error">
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
    <div className="user-detail-page">
      <PageHeader
        backTo={ROUTES.USERS}
        backLabel="Back to Users"
        title={user.name}
        subtitle="View account details and manage status"
        actions={
          !values.is_self ? (
            <Button
              fullWidth={false}
              variant={user.active ? 'ghost' : 'primary'}
              loading={values.is_toggling}
              onClick={functions.onToggleActive}
            >
              {user.active ? 'Mark Inactive' : 'Mark Active'}
            </Button>
          ) : null
        }
      />

      <motion.section
        className="user-detail-card"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <div className="user-detail-card__hero">
          <div className="user-detail-card__avatar">
            {user.image_url ? (
              <img src={user.image_url} alt={user.name} />
            ) : (
              <span>{user.name?.[0]?.toUpperCase() || 'U'}</span>
            )}
          </div>
          <div className="user-detail-card__intro">
            <div className="user-detail-card__title-row">
              <h2 className="user-detail-card__name">{user.name}</h2>
              {values.is_self ? <span className="user-detail-card__you">You</span> : null}
            </div>
            <p className="user-detail-card__email">{user.email}</p>
            <div className="user-detail-card__meta">
              <span className={`user-detail-card__role is-${user.role}`}>
                {user.role}
              </span>
              <StatusBadge active={user.active} />
            </div>
          </div>
        </div>

        <div className="user-detail-card__grid">
          <div className="user-detail-card__item">
            <p className="user-detail-card__label">Phone</p>
            <p className="user-detail-card__value">{formatPhone(user)}</p>
          </div>
          <div className="user-detail-card__item">
            <p className="user-detail-card__label">Country</p>
            <p className="user-detail-card__value">{user.country_code || '—'}</p>
          </div>
          <div className="user-detail-card__item">
            <p className="user-detail-card__label">Dialing code</p>
            <p className="user-detail-card__value">{user.dialing_code || '—'}</p>
          </div>
          <div className="user-detail-card__item">
            <p className="user-detail-card__label">Auth provider</p>
            <p className="user-detail-card__value">
              {user.auth_provider || 'email'}
            </p>
          </div>
          <div className="user-detail-card__item">
            <p className="user-detail-card__label">Seed member</p>
            <p className="user-detail-card__value">
              {user.is_seed ? 'Yes' : 'No'}
            </p>
          </div>
          <div className="user-detail-card__item">
            <p className="user-detail-card__label">Referral code</p>
            <p className="user-detail-card__value">
              {user.referral?.code || '—'}
            </p>
          </div>
          <div className="user-detail-card__item">
            <p className="user-detail-card__label">Member since</p>
            <p className="user-detail-card__value">{formatDate(user.createdAt)}</p>
          </div>
          <div className="user-detail-card__item">
            <p className="user-detail-card__label">Last updated</p>
            <p className="user-detail-card__value">{formatDate(user.updatedAt)}</p>
          </div>
        </div>

        {user.referral_link ? (
          <div className="user-detail-card__link-block">
            <p className="user-detail-card__label">Referral link</p>
            <p className="user-detail-card__link">{user.referral_link}</p>
          </div>
        ) : null}
      </motion.section>
    </div>
  )
}

export default UserDetail
