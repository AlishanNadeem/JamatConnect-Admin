import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Alert from '@/components/Alert'
import Button from '@/components/Button'
import Loader from '@/components/Loader'
import StatusBadge from '@/components/StatusBadge'
import { formatDateTime } from '@/helpers/general'
import { ROUTES, userDetailRoute } from '@/helpers/routes'
import useFeedbackDetailController from './useFeedbackDetailController'
import './FeedbackDetail.scss'

const Row = ({ label, value, wide = false }) => (
  <div className={`feedback-detail__row ${wide ? 'is-wide' : ''}`}>
    <span className="feedback-detail__label">{label}</span>
    <span className="feedback-detail__value">{value || '—'}</span>
  </div>
)

const FeedbackDetail = () => {
  const { values, functions } = useFeedbackDetailController()
  const feedback = values.feedback

  if (values.isLoading && !feedback) {
    return <Loader label="Loading feedback…" compact />
  }

  if (values.isError && !feedback) {
    return (
      <div className="feedback-detail">
        <Link to={ROUTES.FEEDBACKS} className="feedback-detail__back">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M15 6 9 12l6 6"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Back to Feedbacks
        </Link>
        <div className="feedback-detail__error">
          <Alert type="error" message={values.error_message} />
          <Button fullWidth={false} variant="ghost" onClick={functions.refetch}>
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  if (!feedback) return null

  return (
    <div className="feedback-detail">
      <div className="feedback-detail__top">
        <Link to={ROUTES.FEEDBACKS} className="feedback-detail__back">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M15 6 9 12l6 6"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Back to Feedbacks
        </Link>
      </div>

      <motion.div
        className="feedback-detail__layout"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <aside className="feedback-detail__aside">
          <div className="feedback-detail__avatar">
            {feedback.user?.image_url ? (
              <img src={feedback.user.image_url} alt={feedback.name} />
            ) : (
              <span>{feedback.name?.[0]?.toUpperCase() || 'F'}</span>
            )}
          </div>

          <h1 className="feedback-detail__name">{feedback.name}</h1>
          <p className="feedback-detail__email">{feedback.email}</p>

          <div className="feedback-detail__badges">
            <StatusBadge
              active={feedback.is_read}
              activeLabel="Read"
              inactiveLabel="Unread"
            />
          </div>

          <div className="feedback-detail__cta-wrap">
            <Button
              fullWidth
              variant={feedback.is_read ? 'ghost' : 'primary'}
              loading={values.is_toggling}
              onClick={functions.onToggleRead}
              className={`feedback-detail__cta ${
                feedback.is_read ? 'is-deactivate' : 'is-activate'
              }`}
            >
              {feedback.is_read ? 'Mark Unread' : 'Mark Read'}
            </Button>
          </div>
        </aside>

        <div className="feedback-detail__main">
          <section className="feedback-detail__block">
            <h2 className="feedback-detail__heading">Feedback</h2>
            <div className="feedback-detail__rows">
              <Row label="Subject" value={feedback.subject} />
              <Row
                label="Message"
                wide
                value={
                  <p className="feedback-detail__message">{feedback.message}</p>
                }
              />
            </div>
          </section>

          <section className="feedback-detail__block">
            <h2 className="feedback-detail__heading">Details</h2>
            <div className="feedback-detail__rows">
              <Row label="Submitted" value={formatDateTime(feedback.createdAt)} />
              <Row
                label="Account"
                value={
                  feedback.user?._id ? (
                    <Link
                      to={userDetailRoute(feedback.user._id)}
                      className="feedback-detail__inline-link"
                    >
                      {feedback.user.name || 'View user'}
                      {feedback.user.email
                        ? ` (${feedback.user.email})`
                        : ''}
                    </Link>
                  ) : (
                    'Guest (not signed in)'
                  )
                }
              />
            </div>
          </section>
        </div>
      </motion.div>
    </div>
  )
}

export default FeedbackDetail
