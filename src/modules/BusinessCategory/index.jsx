import Alert from '@/components/Alert'
import Button from '@/components/Button'
import EmptyState from '@/components/EmptyState'
import Loader from '@/components/Loader'
import PageHeader from '@/components/PageHeader'
import Pagination from '@/components/Pagination'
import SearchInput from '@/components/SearchInput'
import Select from '@/components/Select'
import StatusBadge from '@/components/StatusBadge'
import { formatDate } from '@/helpers/general'
import useBusinessCategoryController from './useBusinessCategoryController'
import './BusinessCategory.scss'

const STATUS_OPTIONS = [
  { value: 'all', label: 'All statuses' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
]

const EditIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden>
    <path
      d="m4 20 4.5-1.1L19.4 8a1.5 1.5 0 0 0 0-2.1L18.1 4.6a1.5 1.5 0 0 0-2.1 0L5.1 15.5 4 20Z"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinejoin="round"
    />
  </svg>
)

const DeleteIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden>
    <path
      d="M5 7h14M10 11v6M14 11v6M9 7l1-2h4l1 2M7 7l1 12a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2l1-12"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const BusinessCategory = () => {
  const { values, functions } = useBusinessCategoryController()

  return (
    <div className="business-category-page">
      <PageHeader
        title="Manage business categories"
        subtitle="Create, update, and organize categories used across the app"
        actions={
          <Button fullWidth={false} onClick={functions.onCreate}>
            Add Category
          </Button>
        }
      />

      <div className="business-category-panel">
        <div className="business-category-panel__toolbar">
          <div className="business-category-panel__toolbar-left">
            <SearchInput
              value={values.search_input}
              onChange={functions.setSearchInput}
              placeholder="Search categories…"
            />
            <Select
              value={values.status}
              onChange={functions.onStatusChange}
              options={STATUS_OPTIONS}
              placeholder="All statuses"
            />
          </div>

          {values.pagination?.total ? (
            <p className="business-category-panel__count">
              {values.pagination.total} categor
              {values.pagination.total === 1 ? 'y' : 'ies'}
            </p>
          ) : null}
        </div>

        <Alert
          type="error"
          message={values.action_error}
          onClose={functions.clearActionError}
        />

        {values.isLoading && !values.categories.length ? (
          <Loader label="Loading categories…" compact />
        ) : null}

        {values.isError && !values.categories.length ? (
          <div className="business-category-panel__error">
            <Alert type="error" message={values.error_message} />
            <Button fullWidth={false} variant="ghost" onClick={functions.refetch}>
              Try Again
            </Button>
          </div>
        ) : null}

        {!values.isLoading && !values.isError && !values.categories.length ? (
          <EmptyState
            title="No business categories yet"
            description="Create your first category to start organizing businesses."
            action={
              <Button fullWidth={false} onClick={functions.onCreate}>
                Add Category
              </Button>
            }
          />
        ) : null}

        {values.categories.length ? (
          <>
            <div className="business-category-table-wrap">
              <table className="business-category-table">
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>Description</th>
                    <th>Status</th>
                    <th>Updated</th>
                    <th className="is-actions">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {values.categories.map((category) => {
                    const is_toggling =
                      values.toggling_category_id === category._id
                    const is_deleting_row =
                      values.deleting_category_id === category._id
                    const has_businesses = (category.business_count || 0) > 0

                    return (
                      <tr key={category._id}>
                        <td>
                          <div className="business-category-table__identity">
                            <span className="business-category-table__thumb">
                              {category.image_url ? (
                                <img src={category.image_url} alt="" />
                              ) : (
                                <span>{category.name?.[0]?.toUpperCase() || 'C'}</span>
                              )}
                            </span>
                            <div>
                              <p className="business-category-table__name">{category.name}</p>
                              <p className="business-category-table__id">
                                ID · {String(category._id).slice(-6).toUpperCase()}
                                {has_businesses
                                  ? ` · ${category.business_count} business${category.business_count === 1 ? '' : 'es'}`
                                  : ''}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td>
                          <p className="business-category-table__description">
                            {category.description || 'No description'}
                          </p>
                        </td>
                        <td>
                          <StatusBadge active={category.active} />
                        </td>
                        <td>
                          <span className="business-category-table__date">
                            {formatDate(category.updatedAt || category.createdAt)}
                          </span>
                        </td>
                        <td className="is-actions">
                          <div className="data-table-actions">
                            <button
                              type="button"
                              className="is-edit"
                              title="Edit category"
                              onClick={() => functions.onEdit(category._id)}
                            >
                              <EditIcon />
                              <span>Edit</span>
                            </button>
                            <button
                              type="button"
                              className={category.active ? 'is-inactive' : 'is-active'}
                              title={category.active ? 'Mark inactive' : 'Mark active'}
                              disabled={
                                is_toggling ||
                                values.is_updating ||
                                values.is_deleting
                              }
                              onClick={() => functions.onToggleActive(category)}
                            >
                              <span>
                                {is_toggling
                                  ? 'Updating…'
                                  : category.active
                                    ? 'Mark Inactive'
                                    : 'Mark Active'}
                              </span>
                            </button>
                            <button
                              type="button"
                              className="is-danger"
                              title={
                                has_businesses
                                  ? `Cannot delete: ${category.business_count} business${category.business_count === 1 ? '' : 'es'} registered`
                                  : 'Delete category'
                              }
                              disabled={
                                has_businesses ||
                                is_deleting_row ||
                                values.is_deleting ||
                                values.is_updating
                              }
                              onClick={() => functions.onDelete(category)}
                            >
                              <DeleteIcon />
                              <span>{is_deleting_row ? 'Deleting…' : 'Delete'}</span>
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

export default BusinessCategory
