import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  useDeleteBusinessCategoryMutation,
  useGetBusinessCategoriesQuery,
} from '@/redux/apis/BusinessCategory'
import { ROUTES, businessCategoryEditRoute } from '@/helpers/routes'

const PAGE_SIZE = 10

const useBusinessCategoryController = () => {
  const navigate = useNavigate()
  const [search_input, setSearchInput] = useState('')
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')
  const [page, setPage] = useState(1)
  const [action_error, setActionError] = useState('')

  const query_params = useMemo(() => {
    const params = {
      page,
      page_size: PAGE_SIZE,
    }

    if (search.trim()) params.search = search.trim()
    if (status === 'active') params.active = true
    if (status === 'inactive') params.active = false

    return params
  }, [page, search, status])

  const { data, isLoading, isFetching, isError, error, refetch } =
    useGetBusinessCategoriesQuery(query_params)

  const [deleteCategory, { isLoading: is_deleting }] = useDeleteBusinessCategoryMutation()

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(search_input)
      setPage(1)
    }, 350)

    return () => clearTimeout(timer)
  }, [search_input])

  const categories = data?.data || []
  const pagination = data?.pagination || {
    page: 1,
    total_pages: 1,
    total: 0,
    page_size: PAGE_SIZE,
  }

  const onCreate = () => navigate(ROUTES.BUSINESS_CATEGORY_CREATE)
  const onEdit = (id) => navigate(businessCategoryEditRoute(id))

  const onStatusChange = (value) => {
    setStatus(value)
    setPage(1)
  }

  const onDelete = async (category) => {
    const confirmed = window.confirm(
      `Delete "${category.name}"? This action cannot be undone.`
    )
    if (!confirmed) return

    setActionError('')

    try {
      await deleteCategory(category._id).unwrap()
    } catch (err) {
      setActionError(
        err?.data?.message || err?.error || 'Unable to delete business category.'
      )
    }
  }

  return {
    values: {
      categories,
      pagination,
      search_input,
      status,
      isLoading: isLoading || isFetching,
      isError,
      error_message: error?.data?.message || 'Unable to load business categories.',
      is_deleting,
      action_error,
    },
    functions: {
      setSearchInput,
      onStatusChange,
      setPage,
      onCreate,
      onEdit,
      onDelete,
      refetch,
      clearActionError: () => setActionError(''),
    },
  }
}

export default useBusinessCategoryController
