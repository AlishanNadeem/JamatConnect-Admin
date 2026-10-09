import Alert from '@/components/Alert'
import Button from '@/components/Button'
import EmptyState from '@/components/EmptyState'
import Loader from '@/components/Loader'
import PageHeader from '@/components/PageHeader'
import Pagination from '@/components/Pagination'
import SearchInput from '@/components/SearchInput'
import Select from '@/components/Select'
import StatusBadge from '@/components/StatusBadge'
import { Eye } from 'lucide-react'
import { formatDateTime } from '@/helpers/general'
import useFeedbacksController from './useFeedbacksController'
import './Feedbacks.scss'

const STATUS_OPTIONS = [
  { value: 'all', label: 'All messages' },
  { value: 'unread', label: 'Unread' },
  { value: 'read', label: 'Read' },
]

const Feedbacks = () => {
  const { values, functions } = useFeedbacksController()

  return (
    <div className="feedbacks-page">
      <PageHeader
        title="Feedbacks"
        subtitle="Messages submitted from the app Contact Us form"
      />

      <div className="feedbacks-panel">
        <div className="feedbacks-panel__toolbar">
          <div className="feedbacks-panel__toolbar-left">
            <SearchInput
              value={values.search_input}
              onChange={functions.setSearchInput}
              placeholder="Search name, email, subject…"
            />
            <Select
              value={values.status}
              onChange={functions.onStatusChange}
              options={STATUS_OPTIONS}
            />
          </div>

          {values.pagination?.total ? (
            <p className="feedbacks-panel__count">
              {values.pagination.total} message
              {values.pagination.total === 1 ? '' : 's'}
            </p>
          ) : null}
        </div>

        {values.isLoading && !values.feedbacks.length ? (
          <Loader label="Loading feedbacks…" compact />
        ) : null}

        {values.isError && !values.feedbacks.length ? (
          <div className="feedbacks-panel__error">
            <Alert type="error" message={values.error_message} />
            <Button fullWidth={false} variant="ghost" onClick={functions.refetch}>
              Try Again
            </Button>
          </div>
        ) : null}

        {!values.isLoading && !values.isError && !values.feedbacks.length ? (
          <EmptyState
            title="No feedbacks yet"
            description="Contact Us submissions from the app will show up here."
          />
        ) : null}

        {values.feedbacks.length ? (
          <>
            <div className="feedbacks-table-wrap">
              <table className="feedbacks-table">
                <thead>
                  <tr>
                    <th>From</th>
                    <th>Subject</th>
                    <th>Status</th>
                    <th>Submitted</th>
                    <th className="is-actions">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {values.feedbacks.map((item) => (
                    <tr
                      key={item._id}
                      className={item.is_read ? '' : 'is-unread'}
                    >
                      <td>
                        <div className="feedbacks-table__identity">
                          <span className="feedbacks-table__thumb">
                            {item.user?.image_url ? (
                              <img src={item.user.image_url} alt="" />
                            ) : (
                              <span>
                                {item.name?.[0]?.toUpperCase() || 'F'}
                              </span>
                            )}
                          </span>
                          <div>
                            <p className="feedbacks-table__name">{item.name}</p>
                            <p className="feedbacks-table__email">{item.email}</p>
                          </div>
                        </div>
                      </td>
                      <td>
                        <p className="feedbacks-table__subject">{item.subject}</p>
                      </td>
                      <td>
                        <StatusBadge
                          active={item.is_read}
                          activeLabel="Read"
                          inactiveLabel="Unread"
                        />
                      </td>
                      <td>
                        <span className="feedbacks-table__date">
                          {formatDateTime(item.createdAt)}
                        </span>
                      </td>
                      <td className="is-actions">
                        <div className="data-table-actions">
                          <button
                            type="button"
                            className="is-view"
                            title="View details"
                            onClick={() => functions.onView(item._id)}
                          >
                            <Eye />
                            <span>View Details</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <Pagination
              page={values.pagination.page}
              total_pages={values.pagination.total_pages}
              total={values.pagination.total}
              onChange={functions.setPage}
            />
          </>
        ) : null}
      </div>
    </div>
  )
}

export default Feedbacks
