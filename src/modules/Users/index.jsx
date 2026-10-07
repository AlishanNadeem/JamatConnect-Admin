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
import { formatDate, formatPhone } from '@/helpers/general'
import useUsersController from './useUsersController'
import './Users.scss'

const STATUS_OPTIONS = [
  { value: 'all', label: 'All statuses' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
]

const ROLE_OPTIONS = [
  { value: 'all', label: 'All roles' },
  { value: 'user', label: 'User' },
  { value: 'admin', label: 'Admin' },
]

const Users = () => {
  const { values, functions } = useUsersController()

  return (
    <div className="users-page">
      <PageHeader
        title="Manage users"
        subtitle="View, create, and manage user account status"
        actions={
          <Button fullWidth={false} onClick={functions.onCreate}>
            Add User
          </Button>
        }
      />

      <div className="users-panel">
        <div className="users-panel__toolbar">
          <div className="users-panel__toolbar-left">
            <SearchInput
              value={values.search_input}
              onChange={functions.setSearchInput}
              placeholder="Search name, email, phone…"
            />
            <Select
              value={values.role}
              onChange={functions.onRoleChange}
              options={ROLE_OPTIONS}
            />
            <Select
              value={values.status}
              onChange={functions.onStatusChange}
              options={STATUS_OPTIONS}
            />
          </div>

          {values.pagination?.total ? (
            <p className="users-panel__count">
              {values.pagination.total} user{values.pagination.total === 1 ? '' : 's'}
            </p>
          ) : null}
        </div>

        <Alert
          type="error"
          message={values.action_error}
          onClose={functions.clearActionError}
        />

        {values.isLoading && !values.users.length ? (
          <Loader label="Loading users…" compact />
        ) : null}

        {values.isError && !values.users.length ? (
          <div className="users-panel__error">
            <Alert type="error" message={values.error_message} />
            <Button fullWidth={false} variant="ghost" onClick={functions.refetch}>
              Try Again
            </Button>
          </div>
        ) : null}

        {!values.isLoading && !values.isError && !values.users.length ? (
          <EmptyState
            title="No users found"
            description="Create a user or adjust your search filters."
            action={
              <Button fullWidth={false} onClick={functions.onCreate}>
                Add User
              </Button>
            }
          />
        ) : null}

        {values.users.length ? (
          <>
            <div className="users-table-wrap">
              <table className="users-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Phone</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Joined</th>
                    <th className="is-actions">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {values.users.map((user) => {
                    const is_self = String(user._id) === String(values.current_user_id)
                    const is_toggling = values.toggling_user_id === user._id

                    return (
                      <tr key={user._id}>
                        <td>
                          <div className="users-table__identity">
                            <span className="users-table__thumb">
                              {user.image_url ? (
                                <img src={user.image_url} alt="" />
                              ) : (
                                <span>{user.name?.[0]?.toUpperCase() || 'U'}</span>
                              )}
                            </span>
                            <div>
                              <p className="users-table__name">
                                {user.name}
                                {is_self ? <span className="users-table__you">You</span> : null}
                              </p>
                              <p className="users-table__email">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="users-table__muted">{formatPhone(user)}</span>
                        </td>
                        <td>
                          <span className={`users-table__role is-${user.role}`}>
                            {user.role}
                          </span>
                        </td>
                        <td>
                          <StatusBadge active={user.active} />
                        </td>
                        <td>
                          <span className="users-table__date">{formatDate(user.createdAt)}</span>
                        </td>
                        <td className="is-actions">
                          <div className="data-table-actions">
                            <button
                              type="button"
                              className="is-view"
                              title="View details"
                              onClick={() => functions.onView(user._id)}
                            >
                              <Eye />
                              <span>View Details</span>
                            </button>
                            <button
                              type="button"
                              className={user.active ? 'is-inactive' : 'is-active'}
                              title={user.active ? 'Mark inactive' : 'Mark active'}
                              disabled={is_self || is_toggling || values.is_updating}
                              onClick={() => functions.onToggleActive(user)}
                            >
                              <span>
                                {is_toggling
                                  ? 'Updating…'
                                  : user.active
                                    ? 'Mark Inactive'
                                    : 'Mark Active'}
                              </span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
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

export default Users
