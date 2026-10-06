import { motion } from 'framer-motion'
import Alert from '@/components/Alert'
import Button from '@/components/Button'
import Loader from '@/components/Loader'
import PageHeader from '@/components/PageHeader'
import { formatDate, formatPhone } from '@/helpers/general'
import useProfileController from './useProfileController'
import './Profile.scss'

const Profile = () => {
  const { values, functions } = useProfileController()
  const profile = values.profile

  if (values.isLoading && !profile) {
    return <Loader label="Loading profile…" compact />
  }

  return (
    <div className="profile-page">
      <PageHeader
        eyebrow="Account"
        title="My Profile"
        subtitle="View and manage your admin account details"
        actions={
          <>
            <Button fullWidth={false} variant="ghost" onClick={functions.onChangePassword}>
              Change Password
            </Button>
            <Button fullWidth={false} onClick={functions.onEditProfile}>
              Edit Profile
            </Button>
          </>
        }
      />

      {values.isError && !profile ? (
        <div className="profile-page__error">
          <Alert type="error" message={values.error_message} />
          <Button fullWidth={false} variant="ghost" onClick={functions.refetch}>
            Try Again
          </Button>
        </div>
      ) : null}

      {profile ? (
        <motion.section
          className="profile-card"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="profile-card__hero">
            <div className="profile-card__avatar">
              {profile.image_url ? (
                <img src={profile.image_url} alt={profile.name} />
              ) : (
                <span>{profile.name?.[0]?.toUpperCase() || 'A'}</span>
              )}
            </div>
            <div>
              <h2 className="profile-card__name">{profile.name}</h2>
              <p className="profile-card__email">{profile.email}</p>
              <span className="profile-card__role">{profile.role || 'admin'}</span>
            </div>
          </div>

          <div className="profile-card__grid">
            <div className="profile-card__item">
              <p className="profile-card__label">Phone</p>
              <p className="profile-card__value">{formatPhone(profile)}</p>
            </div>
            <div className="profile-card__item">
              <p className="profile-card__label">Country</p>
              <p className="profile-card__value">{profile.country_code || '—'}</p>
            </div>
            <div className="profile-card__item">
              <p className="profile-card__label">Status</p>
              <p className="profile-card__value">
                {profile.active ? 'Active' : 'Inactive'}
              </p>
            </div>
            <div className="profile-card__item">
              <p className="profile-card__label">Member since</p>
              <p className="profile-card__value">{formatDate(profile.createdAt)}</p>
            </div>
          </div>

          <div className="profile-card__footer">
            <Button
              fullWidth={false}
              variant="ghost"
              loading={values.is_logging_out}
              onClick={functions.onLogout}
              className="profile-card__logout"
            >
              Log Out
            </Button>
          </div>
        </motion.section>
      ) : null}
    </div>
  )
}

export default Profile
