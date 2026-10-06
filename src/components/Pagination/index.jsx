import './Pagination.scss'

const Pagination = ({ page = 1, total_pages = 1, total = 0, onChange }) => {
  if (total_pages <= 1) return null

  return (
    <div className="pagination">
      <p className="pagination__meta">
        Page {page} of {total_pages} · {total} total
      </p>
      <div className="pagination__actions">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => onChange?.(page - 1)}
        >
          Previous
        </button>
        <button
          type="button"
          disabled={page >= total_pages}
          onClick={() => onChange?.(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  )
}

export default Pagination
