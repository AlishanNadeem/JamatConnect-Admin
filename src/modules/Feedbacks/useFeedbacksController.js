import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { feedbackDetailRoute } from '@/helpers/routes'
import { useGetFeedbacksQuery } from '@/redux/apis/Feedback'

const PAGE_SIZE = 10

const useFeedbacksController = () => {
  const navigate = useNavigate()
  const [search_input, setSearchInput] = useState('')
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')
  const [page, setPage] = useState(1)

  const query_params = useMemo(() => {
    const params = {
      page,
      page_size: PAGE_SIZE,
    }

    if (search.trim()) params.search = search.trim()
    if (status === 'read') params.is_read = true
    if (status === 'unread') params.is_read = false

    return params
  }, [page, search, status])

  const { data, isLoading, isFetching, isError, error, refetch } =
    useGetFeedbacksQuery(query_params)

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(search_input)
      setPage(1)
    }, 350)

    return () => clearTimeout(timer)
  }, [search_input])

  const feedbacks = data?.data || []
  const pagination = data?.pagination || {
    page: 1,
    total_pages: 1,
    total: 0,
    page_size: PAGE_SIZE,
  }

  const onStatusChange = (value) => {
    setStatus(value)
    setPage(1)
  }

  const onView = (id) => navigate(feedbackDetailRoute(id))

  return {
    values: {
      feedbacks,
      pagination,
      search_input,
      status,
      isLoading: isLoading || isFetching,
      isError,
      error_message: error?.data?.message || 'Unable to load feedbacks.',
    },
    functions: {
      setSearchInput,
      onStatusChange,
      setPage,
      onView,
      refetch,
    },
  }
}

export default useFeedbacksController
